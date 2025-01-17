import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/.server/llm/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

async function chatAction({ context, request }: ActionFunctionArgs) {
  const { messages } = await request.json<{ messages: Messages }>();

  const stream = new SwitchableStream();

  try {
    const options: StreamingOptions = {
      toolChoice: 'none',
      onFinish: async ({ text: content, finishReason }) => {
        if (finishReason !== 'length') {
          return stream.close();
        }

        if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
          throw Error('Cannot continue message: Maximum segments reached');
        }

        const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;

        console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);

        messages.push({ role: 'assistant', content });
        messages.push({ role: 'user', content: CONTINUE_PROMPT });

        const result = await streamText(messages, context.cloudflare.env, options);

        return stream.switchSource(result.toAIStream());
      },
    };

    const result = await streamText(messages, context.cloudflare.env, options);

    stream.switchSource(result.toAIStream());

    return new Response(stream.readable, {
      status: 200,
      headers: {
        contentType: 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.log(error);

    throw new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}

// Tests for api.chat.ts

import { describe, it, expect } from 'vitest';
import { createRequest, createContext } from 'remix-mock';
import { action } from './api.chat';

describe('api.chat', () => {
  it('should handle maximum token limits', async () => {
    const request = createRequest({
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Test message' },
        ],
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
    expect(text).toContain('Continuing message');
  });

  it('should handle multiple response segments', async () => {
    const request = createRequest({
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Test message' },
        ],
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
    expect(text).toContain('Continuing message');
  });
});
