import OpenAiLogo from "../assets/openai-logo.png";
import OpenAiLogo2 from "../assets/openai-logo2.png";
import GrokLogo from "../assets/grok-logo.png";
import GeminiLogo from "../assets/gemini-logo.png";
import GeminiLogo2 from "../assets/gemini-logo2.png";

export const modelOptions = [
  { value: "gpt-4o", label: "gpt-4o", logo: OpenAiLogo2, width: 24, height: 24 },
  { value: "gpt-4o-mini", label: "gpt-4o-mini", logo: OpenAiLogo, width: 24, height: 24 },
  { value: "gpt-4-turbo", label: "gpt-4-turbo", logo: OpenAiLogo, width: 24, height: 24 },
  { value: "grok-2-1212", label: "grok-2-1212", logo: GrokLogo, width: 20, height: 5 },
  { value: "grok-beta", label: "grok-beta", logo: GrokLogo, width: 20, height: 5 },
  { value: "gemini-2.0-flash-exp", label: "gemini-2.0-flash-exp", logo: GeminiLogo, width: 17, height: 17 },
  { value: "gemini-1.5-flash-latest", label: "gemini-1.5-flash-latest", logo: GeminiLogo2, width: 17, height: 17 },
  { value: "gemini-1.5-flash", label: "gemini-1.5-flash", logo: GeminiLogo2, width: 17, height: 17 }
];


export const embeddingModelOptions = [
    { value: "text-embedding-ada-002", label: "text-embedding-ada-002" },
    { value: "text-embedding-3-small", label: "text-embedding-3-small" }
    // { value: "text-embedding-004", label: "text-embedding-004" } // Option commentée
  ];
  