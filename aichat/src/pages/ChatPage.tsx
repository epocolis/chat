import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatInput } from "../layouts/components/ChatInput";
import { ArrowLeft, Copy, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import useChatStore from "@/store/ChatStore";

interface ChatPageProps {
  onBack: () => void;
}

const ChatPage = ({ onBack }: ChatPageProps) => {
  // Get current chat data from store
  const currentChatId = useChatStore(state => state.currentChatId);
  const chatSessions = useChatStore(state => state.chatSessions);
  const addMessage = useChatStore(state => state.addMessage);

  // Find current chat session
  const currentChat = chatSessions.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages ?? [];

  const handleSendMessage = useCallback(
    (message: string) => {
      addMessage(message);
    },
    [addMessage]
  );

  if (!currentChat) {
    return null; // Or some loading/error state
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b">
        <div className="flex items-center px-4 py-2">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-lg font-medium">{currentChat.name}</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                ⭐
              </Button>
              <Button variant="ghost" size="sm">
                ⚙️
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
          {messages.map((message, index) => (
            <div
              key={`${currentChat.id}-${index}`}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  C
                </div>
              )}
              <Card
                className={`max-w-[80%] ${
                  message.role === "user" ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="p-4">
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.role === "assistant" && (
                    <div className="mt-4 flex items-center justify-end space-x-2 text-gray-500">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <div className="border-l h-4 mx-2" />
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} />
          <div className="mt-2 text-center text-sm text-gray-500">
            ChatAI can make mistakes. Please double-check responses.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;