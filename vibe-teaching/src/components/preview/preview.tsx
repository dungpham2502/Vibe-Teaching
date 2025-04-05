"use client";

import { useRef, useEffect } from "react";
import { RemotionPreview } from "../remotion-preview";
import { useScenesStore } from "@/store/useScenesStore";
import { Scene, Title, Heading, Paragraph } from "@/types/remotion-types";

interface TimelineItem {
	id: string;
	title: string;
	videoUrl: string;
	thumbnail?: string;
}

interface PreviewProps {
	selectedItem?: TimelineItem;
	isLoading?: boolean;
}

export default function Preview({
	selectedItem,
	isLoading = false,
}: PreviewProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const { scenes, selectedSceneId } = useScenesStore();

	// Reset video when selectedItem changes
	useEffect(() => {
		if (videoRef.current && selectedItem?.videoUrl) {
			videoRef.current.load();
		}
	}, [selectedItem]);

	return (
		<div className="h-screen bg-white p-4 flex flex-col">
			<h2 className="text-xl font-bold mb-4">Preview</h2>

			<div className="flex-grow flex items-center justify-center relative bg-gray-100 rounded-lg">
				{isLoading ? (
					<div className="text-center p-8">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
						<p className="text-gray-600">Generating preview...</p>
					</div>
				) : selectedItem ? (
					<div className="w-full h-full relative">
						<RemotionPreview scenes={scenes} />
						{/* <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              poster={selectedItem.thumbnail || "/placeholder-video.jpg"}
            >
              <source src={selectedItem.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}
						<div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium">
							{selectedItem.title}
						</div>
					</div>
				) : (
					<div className="text-center p-8">
						<p className="text-gray-600">No content selected</p>
						<p className="text-gray-400 text-sm mt-2">
							Select an item from the timeline to preview
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
