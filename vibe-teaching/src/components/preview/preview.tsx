"use client";

import { useRef, useEffect } from "react";
import { RemotionPreview } from "../remotion-preview";
import { useScenesStore } from "@/store/useScenesStore";

interface TimelineItem {
	id: string;
	title: string;
	videoUrl?: string;
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
	const { scenes, selectedSceneId, setSelectedSceneId } = useScenesStore();
	
	// Find the selected scene from the global store
	const selectedScene = scenes.find(scene => scene.class === selectedSceneId);

	// If there's a selected item via props but no selectedSceneId in global state,
	// update the global state to match
	useEffect(() => {
		if (selectedItem?.id && !selectedSceneId && scenes.some(scene => scene.class === selectedItem.id)) {
			setSelectedSceneId(selectedItem.id);
		}
	}, [selectedItem, selectedSceneId, scenes, setSelectedSceneId]);

	// Reset video when selectedItem changes
	useEffect(() => {
		if (videoRef.current && selectedItem?.videoUrl) {
			videoRef.current.load();
		}
	}, [selectedItem]);

	// Helper function to render selected scene information
	const renderSceneInfo = () => {
		if (!selectedScene) return null;
		
		return (
			<div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md space-y-2 max-w-xs">
				<h3 className="font-bold text-base">{selectedScene.desc}</h3>
				<p className="text-xs text-gray-600">Duration: {selectedScene.durationInFrames} frames</p>
				<p className="text-xs text-gray-600">Elements: {selectedScene.children.length}</p>
				{selectedScene.children.map((child, index) => (
					<div key={child.class} className="text-xs">
						<span className="font-medium">{child.type}:</span> {
							'text' in child ? child.text : 
							'src' in child ? child.src : 
							child.class
						}
					</div>
				)).slice(0, 3)}
				{selectedScene.children.length > 3 && (
					<p className="text-xs text-gray-400">+ {selectedScene.children.length - 3} more elements</p>
				)}
			</div>
		);
	};

	return (
		<div className="h-screen bg-white p-4 flex flex-col">
			<h2 className="text-xl font-bold mb-4">Preview</h2>

			<div className="flex-grow flex items-center justify-center relative bg-gray-100 rounded-lg">
				{isLoading ? (
					<div className="text-center p-8">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
						<p className="text-gray-600">Generating preview...</p>
					</div>
				) : scenes.length === 0 ? (
					<div className="text-center p-8">
						<p className="text-gray-600">No scenes available</p>
						<p className="text-gray-400 text-sm mt-2">
							Chat with the AI to generate scenes
						</p>
					</div>
				) : selectedScene ? (
					<div className="w-full h-full relative">
						{/* Use RemotionPreview component with the scenes data */}
						<RemotionPreview scenes={scenes} selectedSceneId={selectedSceneId} />
						
						{/* Scene information overlay */}
						{renderSceneInfo()}
					</div>
				) : (
					<div className="text-center p-8">
						<p className="text-gray-600">No scene selected</p>
						<p className="text-gray-400 text-sm mt-2">
							Select a scene from the timeline to preview
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
