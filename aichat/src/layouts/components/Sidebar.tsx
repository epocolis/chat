import React, { useMemo } from "react";
import { MessageCircle, FolderGit2, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useChatStore from "@/store/ChatStore";
import { useNavigate, useLocation } from "react-router-dom";

export function Sidebar() {
	const navigate = useNavigate();
	const location = useLocation();

	// Use store selectors
	const chatSessions = useChatStore((state) => state.chatSessions);
	const currentChatId = useChatStore((state) => state.currentChatId);
	const selectChat = useChatStore((state) => state.selectChat);
	const resetChat = useChatStore((state) => state.resetChat);

	// Memoize the recent chats calculation
	const recentChats = useMemo(() => {
		return [...chatSessions]
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, 6);
	}, [chatSessions]);

	// Handlers
	const handleNewChat = React.useCallback(() => {
		resetChat(); // Reset current chat before navigation
		navigate("/chat");
	}, [resetChat, navigate]);

	const handleSelectChat = React.useCallback(
		(chatId: string) => {
			// First reset the current chat state
			resetChat();
			// Then select the new chat
			selectChat(chatId);
			// Force navigation to chat page to trigger re-render
			navigate("/chat", { replace: true });
		},
		[selectChat, resetChat, navigate]
	);

	return (
		<div className="w-72 bg-[#FAFAF9] flex flex-col h-screen">
			{/* Header */}
			<div className="p-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-xl font-medium">AIChat</span>
					<Button variant="ghost" size="icon" className="h-6 w-6">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* New Chat Button */}
			<div className="px-3 mb-2">
				<Button
					variant="ghost"
					className="w-full justify-start text-muted-foreground hover:text-foreground gap-2 pl-4"
					onClick={handleNewChat}
				>
					<Plus className="h-4 w-4" />
					Start new chat
				</Button>
			</div>

			{/* Projects Section */}
			<div className="px-3 mb-2">
				<Button
					variant="ghost"
					className="w-full justify-start text-muted-foreground hover:text-foreground gap-2 pl-4"
				>
					<FolderGit2 className="h-4 w-4" />
					Projects
				</Button>
			</div>

			{/* Recents Section */}
			<div className="px-4 py-2">
				<h3 className="text-sm font-medium mb-2">Recents</h3>
				<div className="space-y-1">
					{recentChats.map((chat) => (
						<Button
							key={chat.id}
							variant="ghost"
							className={`w-full justify-start text-sm font-normal truncate px-4 h-auto py-1 ${
								currentChatId === chat.id ? "bg-gray-100" : ""
							}`}
							onClick={() => handleSelectChat(chat.id)}
						>
							<MessageCircle className="h-4 w-4 mr-2 shrink-0" />
							<span className="truncate">{chat.name}</span>
						</Button>
					))}
				</div>
				<Button
					variant="ghost"
					className="w-full justify-start text-sm text-muted-foreground mt-2 pl-4"
				>
					View all →
				</Button>
			</div>

			{/* Bottom Section */}
			<div className="mt-auto border-t">
				<div className="p-4">
					<Button
						variant="ghost"
						className="w-full justify-start gap-2 text-sm font-normal"
					>
						<div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
							T
						</div>
						email.address@email.co...
					</Button>
				</div>
			</div>
		</div>
	);
}

export default React.memo(Sidebar);
