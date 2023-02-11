import { writable } from "svelte/store";

export const currentChapter = writable<number>(0)
export const currentBook = writable<metadata_def>()
export const book_open = writable<boolean>(true)
export const chapters_open = writable<boolean>(false)