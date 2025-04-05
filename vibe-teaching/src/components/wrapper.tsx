"use client";

import { useState, useCallback } from "react";
import { Eye } from "lucide-react";
import ChatInterface from "./chat/chat-interface";
import Timeline from "./timeline/timeline";
import Preview from "./preview/preview";
import { Button } from "@/components/ui/button";
import { Message } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

// Define TimelineItem interface for type safety
interface TimelineItem {
	id: string;
	title: string;
	videoUrl: string;
	thumbnail?: string;
}

export default function Wrapper() {
	// State to track if we have content to display
	const [hasContent, setHasContent] = useState(false);
	// State to track if we're generating a video (loading state)
	const [isGenerating, setIsGenerating] = useState(false);
	// Currently selected timeline item
	const [selectedTimelineItem, setSelectedTimelineItem] = useState<
		TimelineItem | undefined
	>(undefined);
	// Shared messages state to preserve across layout changes
	const [sharedMessages, setSharedMessages] = useState<Message[]>([]);
	// View mode state (normal or focus/blur background)
	const [isViewMode, setIsViewMode] = useState(false);

	// Function to handle new messages - will be passed to both chat interfaces
	const handleMessageUpdate = useCallback((messages: Message[]) => {
		setSharedMessages(messages);
	}, []);

	const handleSendMessage = (message: string) => {
		// When a message is sent, start the generation process
		setIsGenerating(true);

		// Simulate video generation with a timeout
		setTimeout(() => {
			setIsGenerating(false);
			setHasContent(true);
		}, 3000); // Simulate 3 second delay for video generation
	};

	const handleReceiveMessage = (message: string) => {
		console.log("Received message:", message);
	};

	const handleTimelineItemSelect = (item: TimelineItem) => {
		setSelectedTimelineItem(item);
	};

	// Function to toggle view mode (with blurred background)
	const toggleViewMode = () => {
		setIsViewMode(!isViewMode);
	};

	return (
		<div
			className={cn(
				"flex w-full h-screen transition-all duration-500",
				isViewMode && hasContent ? "bg-gray-900/80" : ""
			)}
		>
			{hasContent ? (
				// Three-panel layout when content exists
				<>
					<div
						className={cn(
							"w-[20%] transition-all duration-500 relative",
							isViewMode ? "opacity-30" : ""
						)}
					>
						<Timeline onSelectItem={handleTimelineItemSelect} />
					</div>
					<div
						className={cn(
							"w-[40%] transition-all duration-500 relative",
							isViewMode ? "z-10" : ""
						)}
					>
						<Preview
							selectedItem={selectedTimelineItem}
							isLoading={isGenerating}
						/>

						{/* Control buttons - positioned in the top right of the preview panel */}
						<div className="absolute top-4 right-4 flex gap-2">
							{/* Toggle view mode button */}
							<Button
								onClick={toggleViewMode}
								className={cn(
									"rounded-full w-8 h-8 p-0 shadow-md transition-colors",
									isViewMode
										? "bg-blue-500 hover:bg-blue-600"
										: "bg-white hover:bg-gray-100"
								)}
								title={isViewMode ? "Exit view mode" : "Enter view mode"}
							>
								<Eye
									className={cn(
										"h-4 w-4",
										isViewMode ? "text-white" : "text-gray-600"
									)}
								/>
								<span className="sr-only">
									{isViewMode ? "Exit view mode" : "Enter view mode"}
								</span>
							</Button>
						</div>
					</div>
					<div
						className={cn(
							"w-[40%] transition-all duration-500",
							isViewMode ? "opacity-30" : ""
						)}
					>
						<ChatInterface
							onSendMessage={handleSendMessage}
							onReceiveMessage={handleReceiveMessage}
							initialMessages={sharedMessages}
							onMessagesChange={handleMessageUpdate}
						/>
					</div>
				</>
			) : (
				// Full-width chat interface when no content
				<div className="w-full transition-all duration-500">
					<ChatInterface
						onSendMessage={handleSendMessage}
						onReceiveMessage={handleReceiveMessage}
						initialMessages={sharedMessages}
						onMessagesChange={handleMessageUpdate}
						isFullWidth={true}
					/>
				</div>
			)}
		</div>
	);
}
