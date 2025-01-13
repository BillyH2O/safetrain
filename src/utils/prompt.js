import { promptTemplates } from '../data/promptTemplate';

export function generatePrompt(templateKey, context, isRAG, additionalParams = {}) {
  if (!promptTemplates[templateKey]) {
    throw new Error(`Template not found: ${templateKey}`);
  }

  const externalNote = isRAG ? "" : promptTemplates.externalNote;

  let prompt = promptTemplates[templateKey]
    .replace("{context}", context)
    .replace("{externalNote}", externalNote);

  // Replace additional placeholders if provided
  for (const [key, value] of Object.entries(additionalParams)) {
    const placeholder = `{${key}}`;
    prompt = prompt.replace(placeholder, value);
  }

  return prompt;
}