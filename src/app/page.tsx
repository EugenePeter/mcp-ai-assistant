"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useMcp } from "use-mcp/react";
export default function Home() {
  const {
    state, // Connection state: 'discovering' | 'authenticating' | 'connecting' | 'loading' | 'ready' | 'failed'
    tools, // Available tools from MCP server
    error, // Error message if connection failed
    callTool, // Function to call tools on the MCP server
    retry, // Retry connection manually
    authenticate, // Manually trigger authentication
    clearStorage, // Clear stored tokens and credentials
  } = useMcp({
    url: "https://mcp-ai-assistant-kjfoknxys-eugenepeters-projects.vercel.app/mcp",
    clientName: "My App",
    autoReconnect: true,
  });

  console.log();

  return (
    <div className={styles.page}>
      asffdfs
      <h1>hello there</h1>
    </div>
  );
}
