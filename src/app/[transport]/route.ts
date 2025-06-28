import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import OpenAI from "openai";

const handler = createMcpHandler(
  async (server) => {
    //@ts-ignore
    server.tool(
      "echo",
      "Returns a confirmation message with no input",
      z.object({}),
      async () => {
        return {
          content: [
            { type: "text", text: "Echo tool triggered successfully!" },
          ],
        };
      }
    );
    server.tool(
      "ask-openai",
      "Ask a question to GPT",
      {
        prompt: z.string(),
      },
      async ({ prompt }) => {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const res = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
        });
        return {
          content: [
            {
              type: "text",
              text: res.choices[0]?.message?.content || "No response",
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        "ask-openai": {
          description: "Ask a question to OpenAI",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    sseEndpoint: "/sse",
    streamableHttpEndpoint: "/mcp",
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
