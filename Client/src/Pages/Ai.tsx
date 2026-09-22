import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useChatHistory, useSendMessage } from "../Hooks/useChat";
import type { ChatMessage } from "../Api/ai";

export default function Ai() {
  const { data: history, isLoading } = useChatHistory();
  const sendMessage = useSendMessage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages: ChatMessage[] = history ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sendMessage.isPending]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const message = input.trim();
    setInput("");
    sendMessage.mutate(message);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0f14] text-[#f1f3f5] font-[IBM_Plex_Sans,sans-serif]">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16 md:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
          Ask about your tasks
        </p>
        <h1 className="mt-3 font-[Fraunces,serif] text-3xl md:text-4xl font-normal tracking-tight">
          Assistant
        </h1>

        <div className="mt-8 flex flex-1 flex-col gap-3">
          {isLoading && (
            <p className="text-sm text-gray-500">Loading conversation…</p>
          )}

          {!isLoading && messages.length === 0 && (
            <p className="text-sm text-gray-500">
              Ask me to add, update, or check on your tasks.
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m._id}
              className={`max-w-[85%] rounded-xl border px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "self-end border-indigo-500/30 bg-indigo-500/10 text-white"
                  : "self-start border-white/[0.07] bg-white/[0.03] text-[#f1f3f5]"
              }`}
            >
              {m.content}
            </div>
          ))}

          {sendMessage.isPending && (
            <div className="self-start rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-500">
              Thinking…
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="sticky bottom-6 mt-6 flex gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your assistant…"
            className="flex-1 rounded-lg border border-transparent bg-transparent px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={sendMessage.isPending || !input.trim()}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
