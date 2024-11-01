import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ChatInput } from "../layouts/components/ChatInput";
import { useState, useEffect, useMemo } from "react";
import ChatPage from "./ChatPage";
import useChatStore from "@/store/ChatStore";

const NewChatPage = () => {
	// Use store selectors
	const currentChatId = useChatStore((state) => state.currentChatId);
	const chatSessions = useChatStore((state) => state.chatSessions);
	const startNewChat = useChatStore((state) => state.startNewChat);
	const resetChat = useChatStore((state) => state.resetChat);

	// Memoize recent chats calculation
	const recentChats = useMemo(
		() =>
			[...chatSessions]
				.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
				.slice(0, 6),
		[chatSessions]
	);

	// Handlers
	const handleSendMessage = (message: string): void => {
		startNewChat(message);
	};

	const handleBack = () => {
		resetChat();
	};

	const handleChatSelect = (chatId: string) => {
		useChatStore.getState().selectChat(chatId);
	};

	const formatTimeAgo = (date: Date) => {
		const now = new Date();
		const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
		if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
		if (diffInMinutes < 1440)
			return `${Math.floor(diffInMinutes / 60)} hours ago`;
		return `${Math.floor(diffInMinutes / 1440)} days ago`;
	};

	// If there's a current chat, show the ChatPage
	if (currentChatId) {
		return <ChatPage onBack={handleBack} />;
	}

	// Otherwise show the new chat page
	return (
		<div className="flex flex-col h-screen">
			<div className="border-b">
				<div className="flex items-center justify-between px-4 pt-52 pb-2">
					<div className="flex-1 flex justify-center items-center">
						<div className="flex items-center space-x-2">
							<span className="text-4xl">👋</span>
							<h1 className="text-4xl font-semibold">Good afternoon Tasman</h1>
						</div>
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-auto">
				<div className="max-w-4xl mx-auto p-4">
					<ChatInput onSend={handleSendMessage} />
					<div>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center space-x-2">
								<h2 className="text-lg font-medium">Your recent chats</h2>
								<ChevronDown className="w-4 h-4" />
							</div>
							<Button variant="ghost" size="sm">
								View all →
							</Button>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{recentChats.map((chat) => (
								<Card
									key={chat.id}
									className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
									onClick={() => handleChatSelect(chat.id)}
								>
									<div className="flex items-start space-x-2">
										<div className="text-xs bg-gray-100 p-1 rounded">
											{chat.project || "General"}
										</div>
									</div>
									<h3 className="mt-2 font-medium line-clamp-2">{chat.name}</h3>
									<p className="text-sm text-gray-500 mt-2">
										{formatTimeAgo(chat.createdAt)}
									</p>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(NewChatPage);
