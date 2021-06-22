import global from '$lib/global'
import type { EndpointOutput } from '@sveltejs/kit';
import type { EndpointData } from '@sveltejs/kit/types/internal';

export async function get(request: EndpointData): Promise<EndpointOutput> {
  if (global.novel) {
    return {
      status: 200,
      body: {
        metadata: global.novel.def.metadata
      }
    }
  } else {
    return {
      status: 404,
      body: {
        result: "not found"
      }
    }
  }
}