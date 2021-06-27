import globals from '$lib/global';
import fs from 'fs';
import type { EndpointOutput } from '@sveltejs/kit';

export async function get(/* request */): Promise<EndpointOutput> {
    return new Promise((resolve,reject)=>{
        fs.readdir(globals.resolveDir(), (err,files) => {
            if (err) {
                resolve( {
                    status: 500,
                    body: JSON.stringify({
                        message: err
                    })
                });
            } else {
                const list = files.filter((file) => file.endsWith('.novel'));
                resolve ({
                    status: 200,
                    body: {
                        result: list
                    }
                });
            }
        });
    })
	
}
