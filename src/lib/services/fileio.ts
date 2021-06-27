/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from 'svelte/store';
import type { metadata_def } from './novel.d';

export const current = writable(undefined);

export async function openCurrent() {
	try {
		const res = await fetch('/novel/metadata.json');
		if (res.ok) {
			const metadata = await res.json();
			current.set(metadata);
		} else {
			current.set(undefined);
		}
	} catch (err) {
		alert(err);
		throw err;
	}
}
export async function saveMetadata(meta: metadata_def): Promise<boolean> {
	try {
		const res = await fetch(`/novel/metadata.json`, {
			method: 'POST',
			body: JSON.stringify(meta)
		});
		if (res.ok) {
			return true;
		}
		return false;
	} catch (err) {
		throw new Error(err);
	}
}

export async function save(type: string, name: string, data: any): Promise<any> {
	try {
		const res = await fetch(`/novel/${type}-${name}.json`, {
			method: 'POST',
			body: JSON.stringify(data)
		});
		if (res.ok) {
			const ret = await res.json();
			return ret;
		} else {
			throw new Error('Write error ' + res.status);
		}
	} catch (err) {
		throw new Error('Write error ' + err);
	}
}

export async function load(type: string, name: string): Promise<any> {
	try {
		const res = await fetch(`/novel/${type}-${name}.json`);
		if (res.ok) {
			const ret = await res.json();
			return ret;
		} else {
			throw new Error('Read error ' + res.status);
		}
	} catch (err) {
		throw new Error('Read error ' + err);
	}
}
