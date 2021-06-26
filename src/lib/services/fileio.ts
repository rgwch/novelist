/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

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

