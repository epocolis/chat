// src/components/ChatInput.tsx
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { Image, ArrowRight, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
	onSend: (message: string) => void;
	disabled?: boolean;
	className?: string;
}

const ChatInput = memo(function ChatInput({
	onSend,
	disabled = false,
	className,
}: ChatInputProps) {
	const [message, setMessage] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize textarea
	const adjustTextareaHeight = useCallback(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "0px";
			const scrollHeight = Math.max(textarea.scrollHeight, 96); // 24px * 4 lines
			textarea.style.height = `${scrollHeight}px`;
		}
	}, []);

	useEffect(() => {
		adjustTextareaHeight();
	}, [message, adjustTextareaHeight]);

	const handleSubmit = useCallback(() => {
		if (message.trim() && !disabled) {
			onSend(message.trim());
			setMessage("");
			if (textareaRef.current) {
				textareaRef.current.style.height = "96px"; // Reset to 4 lines
				textareaRef.current.focus();
			}
		}
	}, [message, onSend, disabled]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSubmit();
			}
		},
		[handleSubmit]
	);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setMessage(e.target.value);
		},
		[]
	);

	return (
		<Card className={cn("mb-6", className)}>
			<div className="p-4">
				<div className="flex items-start gap-2">
					<div className="flex-1 relative rounded-xl overflow-hidden">
						<textarea
							ref={textareaRef}
							placeholder="How can Claude help you today?"
							value={message}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							disabled={disabled}
							className={cn(
								"w-full resize-none overflow-hidden",
								"min-h-[96px]", // 4 lines minimum (24px per line)
								"max-h-[240px]", // 10 lines maximum
								"rounded-xl border border-input bg-transparent",
								"px-4 py-3 text-sm shadow-sm",
								"placeholder:text-muted-foreground",
								"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								"disabled:cursor-not-allowed disabled:opacity-50"
							)}
							style={{
								lineHeight: "24px", // Consistent line height
							}}
							rows={4}
						/>
					</div>
					<Button
						onClick={handleSubmit}
						size="icon"
						className="shrink-0 h-12 w-12 rounded-xl"
						disabled={disabled || !message.trim()}
					>
						<ArrowRight className="h-6 w-6" />
					</Button>
				</div>
				<div className="flex justify-between items-center mt-3">
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							className="rounded-lg"
							disabled={disabled}
						>
							<Image className="w-4 h-4 mr-2" />
							Add content
						</Button>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							className="rounded-lg"
							disabled={disabled}
						>
							Use a project
							<ChevronDown className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
});

export { ChatInput };
