"use server";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
const origin = "https://mcp-ai-assistant.vercel.app";
export async function askOpenAI(prompt: string) {
  //   const transport = new StreamableHTTPClientTransport(
  //     new URL(`${process.env.MCP_SERVER_ORIGIN ?? "http://localhost:6020"}/mcp`)
  //   );

  const transport = new SSEClientTransport(new URL(`${origin}/sse`));

  const client = new Client(
    {
      name: "nextjs-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    }
  );

  await client.connect(transport);

  console.log("PROMPT", prompt);
  //@ts-ignore
  //   const result = await client.callTool("echo", {});
  const result = await client.listTools();

  await client.close();

  //@ts-ignore
  return tools.map((tool) => tool.name).join(", ");
  //   return result?.content?.[0]?.text ?? "No response from agent";
}
