import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { StreamingTextResponse, parseStreamPart } from 'ai';
import { streamText } from '~/lib/.server/llm/stream-text';
import { stripIndents } from '~/utils/stripIndent';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function action(args: ActionFunctionArgs) {
  return enhancerAction(args);
}

async function enhancerAction({ context, request }: ActionFunctionArgs) {
  const { message } = await request.json<{ message: string }>();

  try {
    const result = await streamText(
      [
        {
          role: 'user',
          content: stripIndents`
          I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.

          IMPORTANT: Only respond with the improved prompt and nothing else!

          <original_prompt>
            ${message}
          </original_prompt>
        `,
        },
      ],
      context.cloudflare.env,
    );

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const processedChunk = decoder
          .decode(chunk)
          .split('\n')
          .filter((line) => line !== '')
          .map(parseStreamPart)
          .map((part) => part.value)
          .join('');

        controller.enqueue(encoder.encode(processedChunk));
      },
    });

    const transformedStream = result.toAIStream().pipeThrough(transformStream);

    return new StreamingTextResponse(transformedStream);
  } catch (error) {
    console.log(error);

    throw new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}

// Tests for api.enhancer.ts

import { describe, it, expect } from 'vitest';
import { createRequest, createContext } from 'remix-mock';
import { action } from './api.enhancer';

describe('api.enhancer', () => {
  it('should handle valid prompt enhancement', async () => {
    const request = createRequest({
      method: 'POST',
      body: JSON.stringify({
        message: 'Test message',
      }),
    });

    const context = createContext({
      cloudflare: {
        env: {
          ANTHROPIC_API_KEY: 'test-api-key',
        },
      },
    });

    const response = await action({ request, context });

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('improved prompt');
  });

  it('should handle empty message', async () => {
    const request = createRequest({
      method: 'POST',
      body: JSON.stringify({
        message: '',
      }),
    });

    const context = createContext({
      cloudflare: {
        env: {
          ANTHROPIC_API_KEY: 'test-api-key',
        },
      },
    });

    const response = await action({ request, context });

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain('improved prompt');
  });

  it('should handle error conditions', async () => {
    const request = createRequest({
      method: 'POST',
      body: JSON.stringify({
        message: 'Test message',
      }),
    });

    const context = createContext({
      cloudflare: {
        env: {
          ANTHROPIC_API_KEY: 'invalid-api-key',
        },
      },
    });

    try {
      await action({ request, context });
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect(error.status).toBe(500);
    }
  });
});
