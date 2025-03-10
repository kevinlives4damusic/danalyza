declare module 'openai' {
  export default class OpenAI {
    constructor(options: { apiKey: string; dangerouslyAllowBrowser?: boolean });
    
    chat: {
      completions: {
        create: (options: {
          model: string;
          messages: Array<{
            role: 'system' | 'user' | 'assistant';
            content: string;
          }>;
          response_format?: { type: string };
        }) => Promise<{
          choices: Array<{
            message: {
              content: string;
            };
          }>;
        }>;
      };
    };
  }
} 