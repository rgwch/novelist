import type { EndpointOutput } from '@sveltejs/kit';
import type { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import path from 'path';

export async function post({ params, body }): Promise<EndpointOutput> {
  const request = JSON.parse(body)
  try {
    console.log("modify")
    if (globals.novel) {
      const novel: Novel = globals.novel
      console.log(body)
      if (request.op = "changePwd" && request.password) {
        await novel.changePassword(request.password)
        return {
          status: 200,
          body: {
            message: "ok"
          }
        }
      } else {
        console.log("Bad request "+body)
        return {
          status: 400,
          body: {
            message: "bad request"
          }
        }
      }

    } else {
      return {
        status: 404,
        body: {
          message: "No book is open"
        }
      }
    }

  } catch (err) {
    return {
      status: 500,
      body: {
        message: "Open error: Bad password or file corrupt."
      }
    }
  }
}