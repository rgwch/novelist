/// <reference types="svelte" />
declare module 'svelte-i18n';
declare module 'svelte';

type metadata_def = {
	id?: string;
	title?: string;
	series?: string;
	cover?: string;
	sequence?: number;
	genre?: string;
	language?: string; // de, en, fr etc.
	description?: string;
	contents?: string;
	tags?: string;
	author?: string;
	fileAs?: string;
	copyright?: string;
	publisher?: string;
	published?: string; // year-month-day
	created?: Date;
	modified?: Date;
	expose?: string;
	chapters?: Array<string>;
	persons?: Array<string>;
	places?: Array<string>;
	images?: Array<string>;
	// [propName: string]: any;
};

type entrydef = {
	name?: string
}

type person_def = entrydef & {
	nicknames?: string;
	gender?: 'm' | 'f';
	height?: number | string;
	stature?: string;
	hair?: string;
	age?: number;
	description?: string;
};
type place_def = entrydef & {
	alias?: string;
	surround?: string;
	description?: string;
};
type chapter_def = entrydef & {
	persons?: Array<string>;
	places?: Array<string>;
	summary?: string;
	time?: string;
	text?: string;
};
type noveldef = {
	metadata?: metadata_def;
	cover?: Uint8Array;
	persons?: {
		[name: string]: person_def;
	};
	places?: {
		[name: string]: place_def;
	};
	timeline?: string;
	notes?: string;
	chapters?: {
		[name: string]: chapter_def;
	};
};

type time_unit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

type timeline_entry = {
	chapter: string; // Chapter this entry belongs to
	summary: string; // summary of that chapter
	date: Date; // Date/time for this entry
	offset: number; // Offset of this entry from the beginning  in units
	remark: string; // any text after the time spec
	unit: time_unit;
};
