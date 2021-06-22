import global from '$lib/global'
import type { EndpointOutput } from '@sveltejs/kit';
import type { EndpointData } from '@sveltejs/kit/types/internal';

export async function get(request): Promise<EndpointOutput> {
  global.value=request.params.value
  return {
    body:{
      result: global.value
    }
  }
}
