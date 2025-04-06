"use client";

import { useState, useCallback } from "react";
import { Eye } from "lucide-react";
import ChatInterface from "./chat/chat-interface";
import Timeline from "./timeline/timeline";
import Preview from "./preview/preview";
import { Button } from "@/components/ui/button";
import { Message } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Define TimelineItem interface for type safety
interface TimelineItem {
	id: string;
	title: string;
	videoUrl?: string;
	thumbnail?: string;
}

// Welcome screen component for empty state
const WelcomeScreen = () => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full text-center px-6 py-12 bg-gray-50">
			<div className="max-w-2xl">
				<div className="mb-8 relative h-80 w-full animate-fadeIn">
					<Image 
						src="/welcome-illustration.svg" 
						alt="Welcome to VibeSlide"
						fill
						className="object-contain"
						priority
					/>
				</div>
				<h1 className="text-3xl font-bold mb-4 text-gray-800 animate-slideUp">Welcome to VibeSlide</h1>
				<p className="text-gray-600 mb-4 text-lg max-w-lg mx-auto animate-slideUp animation-delay-100">
					Start by describing the lesson you want to create. Our AI will generate
					video lessons based on your conversation.
				</p>
				<div className="text-sm text-gray-500 animate-slideUp animation-delay-200">
					Type your first message below to begin
				</div>
			</div>
		</div>
	);
};

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
		}, 100); // Simulate 3 second delay for video generation
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
				"flex w-full h-screen transition-all duration-500 bg-gray-50",
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
							initialMessages={sharedMessages}
							onMessagesChange={handleMessageUpdate}
						/>
					</div>
				</>
			) : (
				// Welcome screen with chat interface when no content
				<div className="w-full flex flex-col h-full transition-all duration-500">
					<div className="flex-1 min-h-0">
						<WelcomeScreen />
					</div>
					<div className="h-[280px]">
						<ChatInterface
							onSendMessage={handleSendMessage}
							initialMessages={sharedMessages}
							onMessagesChange={handleMessageUpdate}
							isFullWidth={true}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
