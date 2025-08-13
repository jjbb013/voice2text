import type { ExecutionContext } from '@cloudflare/workers-types';

function isFile(value: any): value is File {
  return value instanceof (globalThis as any).File;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Expected POST request', { status: 405 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!isFile(audioFile)) {
      return new Response('No audio file uploaded or the uploaded item is not a file.', { status: 400 });
    }

    const audioArrayBuffer = await audioFile.arrayBuffer();

    const response = await env.AI.run(
      '@cf/openai/whisper',
      {
        audio: [...new Uint8Array(audioArrayBuffer)],
      }
    );

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

interface Env {
  AI: any;
}
