<svelte:options customElement="fs-thumbnail" />

<script lang="ts">
    import { send, receive } from "./crossfade.js";
    import { currentPhoto, currentPhotoStatus, _currentIndex } from "./store.js";
    export let key: string;
    export let addPlaceholder: boolean = false;

    let isCurrent = false;

    let containerEl: HTMLDivElement;

    function handleClick() {
        _currentIndex.setKey(key);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            _currentIndex.setKey(key);
        }
    }

    currentPhoto.subscribe((v) => {
        if (!v) {
            isCurrent = false;
            return;
        }

        let newCurrent = v.key == key;
        if (isCurrent === newCurrent) return;

        if (newCurrent) {
            /* containerEl.style.width = containerEl.clientWidth + "px"; */
            /* containerEl.style.height = containerEl.clientHeight + "px"; */
        } else {
            /* containerEl.style.width = "unset"; */
            /* containerEl.style.height = "unset"; */
        }
        isCurrent = newCurrent;
    });
</script>

<div class="container" bind:this={containerEl}>
    {#if !isCurrent || (isCurrent && !$currentPhotoStatus.loaded)}
        <div
            class="thumbnail"
            role="button"
            tabindex="0"
            in:receive={{ key: key }}
            out:send={{ key: key }}
            on:click={handleClick}
            on:keydown={handleKeydown}
        >
            <slot />
            {#if isCurrent && $currentPhotoStatus.loading}
                <div class="is-overlay">
                    <span class="loader" />
                </div>
            {/if}
        </div>
    {:else if addPlaceholder}
        <div class="thumbnail" style="width:{containerEl.clientWidth}px"></div>
    {/if}
</div>

<style>
    .container {
        position: relative;
        display: block;
        height: 100%;
        width: 100%;
    }
    .thumbnail {
        height: 100%;
        width: 100%;
        /* display: inline-flex; /1* or display: block; *1/ */
    }
    .is-overlay {
        background-color: rgba(1, 1, 1, 0.5);
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
    }

    .loader {
        /* width: 70%; */
        /* height: 70%; */
        /* margin: auto; */
        /* top: 10%; */
        position: absolute;
        left: calc(50% - (1em / 2));
        top: calc(50% - (1em / 2));
        /* transform: scale(20); */
    }

    .loader {
        animation: spinAround 500ms infinite linear;
        border: 2px solid #dbdbdb;
        border-radius: 290486px;
        border-right-color: transparent;
        border-top-color: transparent;
        content: "";
        display: block;
        height: 1em;
        position: relative;
        width: 1em;
    }

    @keyframes spinAround {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }

    :host {
        position: relative;
        display: inline-flex; /* or display: block; */
    }
</style>
