"use server";

import { askOpenAI } from "@/app/actions/ai-assistant";
import { Suspense } from "react";

import { handleSubmit } from "../actions/handleSubmit";

export default async function ChatPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        🧠 Ask AI (RSC + Server Action)
      </h1>

      <Suspense fallback={<p>Loading...</p>}>
        <ChatForm />
      </Suspense>
    </div>
  );
}

async function ChatForm() {
  return (
    <form action={handleSubmit} className="space-y-4">
      <textarea
        name="prompt"
        placeholder="Type your message..."
        rows={4}
        className="w-full border border-gray-300 p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
}
