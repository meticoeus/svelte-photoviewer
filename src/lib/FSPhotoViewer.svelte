<script lang="ts">
    import { spring } from "svelte/motion";
    import { fade } from "svelte/transition";
    import { pannable } from "./pannable.js";
    import type { Photo } from "./store.js";
    import {
        _currentIndex,
        _photos,
        currentPhoto,
        currentPhotoStatus,
        nextPhoto,
        prevPhoto,
    } from "./store.js";
    import { receive, send } from "./crossfade.js";
    import { get } from "svelte/store";

    export let photos: Photo[];

    _photos.set(photos);

    function loadPhoto(p: Photo | undefined) {
        if (!p) return;
        const timeout = setTimeout(
            () => currentPhotoStatus.update((a) => ({ ...a, loading: true })),
            100,
        );

        const img = new Image();

        img.onload = () => {
            clearTimeout(timeout);
            currentPhotoStatus.set({ loading: false, loaded: true });
            /* console.log("done loading"); */
        };

        img.onerror = () => {
            clearTimeout(timeout);
            currentPhotoStatus.set({ loading: false, loaded: false });
            console.warn("[svelte-photoviewer] IMAGE TIMEOUT ERROR");
        };

        img.src = p.src;

        new Image().src = $prevPhoto.src;
        new Image().src = $nextPhoto.src;
    }

    currentPhoto.subscribe((p: Photo | undefined) => {
        /* console.log("current: ", p); */
        loadPhoto(p);
    });

    /*
    // Web components event workaround
    import { createEventDispatcher } from 'svelte'
    import { get_current_component } from 'svelte/internal'
    const component = get_current_component()
    const svelteDispatch = createEventDispatcher()
    function dispatch (name, detail) {
        svelteDispatch(name, detail)
        component.dispatchEvent && component.dispatchEvent(new CustomEvent(name, { detail }))
    }
    */

    const imageScale = spring(1);
    const coords = spring({ x: 0, y: 0 });

    function changePhoto(n) {
        if ($imageScale > 1) return;
        // console.log($_currentIndex);
        if (n > 0) {
            _currentIndex.next();
        } else {
            _currentIndex.prev();
        }

        /* dispatch("next"); */
    }

    function handleKeydown(e) {
        const status = get(currentPhotoStatus);
        if (!status.loaded) return;

        //console.log(e)
        if (e.key === "ArrowRight") {
            changePhoto(1);
        } else if (e.key === "ArrowLeft") {
            changePhoto(-1);
        } else if (["ArrowUp", "Escape"].includes(e.key)) {
            closeModal();
        }
    }

    function handlePanMove(e) {
        coords.set(
            {
                x: e.detail.panX,
                y: e.detail.panY,
            },
            { hard: !e.detail.spring },
        );
    }

    function handleZoom(e) {
        imageScale.set(e.detail.scale, { hard: !e.detail.spring });
    }

    function closeModal() {
        //console.log("cclosing");
        /* dispatch("ccclose"); */
        coords.set({ x: 0, y: 0 });
        imageScale.set(1);

        currentPhotoStatus.set({ loading: false, loaded: false });
        _currentIndex.set(-1);
    }

    /* $: console.log("loaded ", $currentPhotoStatus.loaded); */
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $currentPhotoStatus.loaded}
    {#await $currentPhoto}
        <slot name="placeholder" />
    {:then d}
        <section>
            <div
                transition:fade={{ duration: 200 }}
                class="modal-background"
                on:click={closeModal}
            />
            <div class="slidecontainer">
                <div
                    use:pannable
                    on:panmove={handlePanMove}
                    on:zoomchanged={handleZoom}
                    style="transform: scale({$imageScale}) translate({$coords.x}px,{$coords.y}px)"
                    class="slider"
                >
                    <img
                        draggable="false"
                        on:mousedown|preventDefault
                        alt="Photo"
                        src={d.src}
                        in:receive={{ key: d.key }}
                        out:send={{ key: d.key }}
                    />
                </div>
            </div>
        </section>
    {:catch error}
        <slot name="error" {error} />
    {/await}
{/if}

<style>
    .modal-background {
        background-color: rgba(10, 10, 10, 0.86);
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
    }

    section {
        position: fixed;
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;

        top: 0;
        left: 0;
        z-index: 100;
    }

    .slidecontainer {
        /* padding: 50px; */
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    img {
        max-width: unset;
        max-width: 100vw;
        max-height: 100vh;
        object-fit: contain;
        user-select: none;
    }

    @keyframes fadeImg {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
</style>
