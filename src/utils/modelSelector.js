import { createXai } from '@ai-sdk/xai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const xai = createXai({
  apiKey: process.env.GROK_API_KEY,
});

export function getModelFromKey(selectedModelKey) {
  switch (selectedModelKey) {
    case 'o1-preview':
      return openai('o1');
    case 'gpt-4o':
      return openai('gpt-4o');
    case 'gpt-4o-mini':
      return openai('gpt-4o-mini');
    case 'gpt-4-turbo':
      return openai('gpt-4-turbo');
    case 'grok-2-1212':
      return xai('grok-2-1212');
    case 'grok-beta':
      return xai('grok-beta');
    case 'gemini-2.0-flash-exp':
      return google('gemini-2.0-flash-exp');
    case 'gemini-1.5-flash-latest':
      return google('gemini-1.5-flash-latest');
    case 'gemini-1.5-flash':
      return google('gemini-1.5-flash');
    default:
      return openai('gpt-4o-mini');
  }
}
