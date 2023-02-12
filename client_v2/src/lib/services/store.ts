import { writable } from "svelte/store";

export const currentChapter = writable<chapter_def>()
export const currentBook = writable<metadata_def>()
export const currentPerson = writable<person_def>()