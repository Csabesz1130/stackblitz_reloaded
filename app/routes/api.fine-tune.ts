import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { fineTuneModel } from '~/lib/.server/llm/fine-tune';

export async function action(args: ActionFunctionArgs) {
  return fineTuneAction(args);
}

async function fineTuneAction({ context, request }: ActionFunctionArgs) {
  const { dataset } = await request.json<{ dataset: any }>();

  try {
    const fineTunedModel = await fineTuneModel(dataset, context.cloudflare.env);

    return new Response(JSON.stringify({ success: true, model: fineTunedModel }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
