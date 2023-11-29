import { crossfade } from "svelte/transition";

const [send, receive] = crossfade({
    duration: 300,
});

export { send, receive };
