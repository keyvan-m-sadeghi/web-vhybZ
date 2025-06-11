"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/thread";
import { ThreadList } from "@/components/thread-list";
import { ProtectedRoute } from "@/components/protected-route";

export default function Assistant() {
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <ProtectedRoute>
      <AssistantRuntimeProvider runtime={runtime}>
        <div className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
          <ThreadList />
          <Thread />
        </div>
      </AssistantRuntimeProvider>
    </ProtectedRoute>
  );
}
