"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineItem {
	id: string;
	title: string;
	videoUrl: string;
	thumbnail?: string;
}

interface TimelineProps {
	onSelectItem?: (item: TimelineItem) => void;
}

export default function Timeline({ onSelectItem }: TimelineProps) {
	// Sample timeline items
	const [timelineItems] = useState<TimelineItem[]>([
		{
			id: "slide-1",
			title: "Introduction",
			videoUrl: "/videos/intro.mp4",
			thumbnail: "/file.svg",
		},
		{
			id: "slide-2",
			title: "Main Concept",
			videoUrl: "/videos/concept.mp4",
			thumbnail: "/globe.svg",
		},
		{
			id: "slide-3",
			title: "Examples",
			videoUrl: "/videos/examples.mp4",
			thumbnail: "/window.svg",
		},
		{
			id: "slide-4",
			title: "Conclusion",
			videoUrl: "/videos/conclusion.mp4",
			thumbnail: "/next.svg",
		},
	]);

	const [selectedItemId, setSelectedItemId] = useState<string>(
		timelineItems[0]?.id || ""
	);

	const handleItemClick = (item: TimelineItem) => {
		setSelectedItemId(item.id);
		if (onSelectItem) {
			onSelectItem(item);
		}
	};

	return (
		<div className="h-screen bg-gray-100 p-4 overflow-y-auto">
			<h2 className="text-xl font-bold mb-4">Timeline</h2>
			<div className="space-y-3">
				{timelineItems.map((item) => (
					<div
						key={item.id}
						className={cn(
							"p-3 rounded-lg cursor-pointer transition-all border",
							selectedItemId === item.id
								? "bg-blue-50 border-blue-400 shadow"
								: "bg-white border-gray-200 hover:bg-gray-50"
						)}
						onClick={() => handleItemClick(item)}
					>
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
								{item.thumbnail ? (
									<img src={item.thumbnail} alt="" className="w-6 h-6" />
								) : (
									<span className="text-xl">🎬</span>
								)}
							</div>
							<div>
								<h3 className="font-medium">{item.title}</h3>
								<p className="text-sm text-gray-500">
									Slide {item.id.split("-")[1]}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
