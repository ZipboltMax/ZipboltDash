"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from "react-markdown";
import { Loader2 } from "lucide-react";

export default function Chat() {
  // Load saved messages from localStorage on initial render
  const [initialMessages, setInitialMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat-messages");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    initialMessages,
  });

  const [files, setFiles] = useState(null);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Clear chat history function
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat-messages");
  };

  return (
    <div className="flex flex-col w-full h-screen bg-white">
      {/* Chat area with fixed height and scroll */}
      <div className="flex-1 overflow-hidden pb-4 px-4 pt-4">
        <div className="h-full max-w-3xl mx-auto flex flex-col">
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="text-xs"
            >
              Clear Chat
            </Button>
          </div>
          <ScrollArea
            ref={scrollRef}
            className="flex-1 rounded-lg border bg-gray-50 p-2" // changed p-4 → p-2
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            <div className="space-y-2">
              {" "}
              {/* changed space-y-4 → space-y-2 */}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2 rounded-lg text-sm whitespace-pre-wrap max-w-[80%] ${
                    m.role === "user"
                      ? "bg-blue-100 text-black ml-auto"
                      : "bg-gray-200 text-gray-900 mr-auto"
                  }`}
                >
                  <p className="mb-1 font-bold">
                    {" "}
                    {/* changed mb-2 → mb-1 */}
                    {m.role === "user" ? "You:" : "ZipSure AI:"}
                  </p>
                  <div className="leading-[1]">
                    <Markdown>{m.content}</Markdown>
                  </div>

                  <div className="mt-1 space-y-1">
                    {m?.experimental_attachments?.map((attachment, index) => (
                      <div key={`${m.id}-${index}`} className="flex flex-col">
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {attachment.name || `Attachment ${index + 1}`}
                        </a>
                        {attachment.contentType?.startsWith("image/") && (
                          <Image
                            src={attachment.url}
                            width={400}
                            height={400}
                            alt={attachment.name ?? `attachment-${index}`}
                            className="rounded-md mt-1" // changed mt-2 → mt-1
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start p-2 mr-auto max-w-[80%]">
                  {" "}
                  {/* changed p-4 → p-2 */}
                  <Loader2 className="h-5 w-5 animate-spin text-gray-600" />{" "}
                  {/* slightly reduced size */}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Fixed input area at the bottom */}
      <div className="w-full bg-white border-t border-gray-200 px-4 py-4">
        <form
          className="max-w-3xl mx-auto"
          onSubmit={(event) => {
            handleSubmit(event, {
              experimental_attachments: files,
            });
            setFiles(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          <div className="flex flex-col gap-2">
            <Input
              type="file"
              onChange={(event) => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              multiple
              ref={fileInputRef}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Input
                className="text-sm flex-1"
                value={input}
                placeholder="Say something..."
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-900"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
