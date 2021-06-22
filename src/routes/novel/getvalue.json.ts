import global from '$lib/global'
import type { EndpointOutput } from '@sveltejs/kit';
import type { EndpointData } from '@sveltejs/kit/types/internal';

export async function get(request): Promise<EndpointOutput> {
  return {
    body:{
      current: global.value,
      novel: global.novel
    }
  }
}
