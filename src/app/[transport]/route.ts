import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import OpenAI from "openai";

import { NextRequest } from "next/server";

// === CORS HEADERS ===
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Use specific origin for production
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "echo",
      "description",
      {
        message: z.string(),
      },
      async ({ message }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
      })
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

// export { handler as GET, handler as POST, handler as DELETE };

// === EXPORT HANDLERS WITH CORS ===

// Handle CORS preflight
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Wrap all methods (GET, POST, DELETE) — they all just invoke the same MCP handler
export async function GET(req: NextRequest) {
  const res = await handler(req);
  cors(res);
  return res;
}

export async function POST(req: NextRequest) {
  const res = await handler(req);
  cors(res);
  return res;
}

export async function DELETE(req: NextRequest) {
  const res = await handler(req);
  cors(res);
  return res;
}

// Utility to apply CORS headers to a response
function cors(res: Response) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
}
