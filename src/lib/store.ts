import type { Readable, Writable } from "svelte/store";
import { derived, get, writable } from "svelte/store";

type Move = (x: number, max: number) => number;

const prev: Move = (x, max) => (x - 1 < 0 ? max : x - 1);
const next: Move = (x, max) => (x + 1 > max ? 0 : x + 1);

export interface Photo {
    src: string;
    width: number;
    height: number;
    key: string;
}

export interface PhotoStatus {
    loading: boolean;
    loaded: boolean;
}

export interface PhotoIndex extends Writable<number> {
    next(): void;
    prev(): void;
    setKey(key: string): void;
}

const photos: Writable<Photo[]> = writable([]);
const currentIndex: PhotoIndex = writable<number>(-1) as PhotoIndex;

const currentPhotoStatus: Writable<PhotoStatus> = writable({ loading: false, loaded: false });

const photosLength: Readable<number> = derived(photos, (a) => a.length);
const prevPhoto: Readable<Photo> = derived(
    [photos, currentIndex],
    ([a, b]) => a[prev(b, a.length - 1)],
);
const currentPhoto: Readable<Photo | undefined> = derived([photos, currentIndex], ([a, b]) => a[b]);
const nextPhoto: Readable<Photo> = derived(
    [photos, currentIndex],
    ([a, b]) => a[next(b, a.length - 1)],
);

currentIndex.next = (): void => currentIndex.update((x) => next(x, get(photosLength) - 1));
currentIndex.prev = (): void => currentIndex.update((x) => prev(x, get(photosLength) - 1));
currentIndex.setKey = (key: string): void =>
    currentIndex.set(get(photos).findIndex((x) => x.key === key));

export {
    photos as _photos,
    currentIndex as _currentIndex,
    currentPhoto,
    nextPhoto,
    prevPhoto,
    currentPhotoStatus,
};
