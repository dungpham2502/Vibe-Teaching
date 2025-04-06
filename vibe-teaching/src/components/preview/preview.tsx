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
	const { scenes, selectedSceneId, setSelectedSceneId, currentFrame, setCurrentFrame, debug, toggleDebug } = useScenesStore();
	
	// Find the selected scene from the global store
	const selectedScene = scenes.find(scene => scene.id === selectedSceneId);

	// If there's a selected item via props but no selectedSceneId in global state,
	// update the global state to match
	useEffect(() => {
		if (selectedItem?.id && selectedSceneId !== selectedItem.id && scenes.some(scene => scene.id === selectedItem.id)) {
			setSelectedSceneId(selectedItem.id);
			
			// Also update the current frame to show the beginning of this scene
			let frameOffset = 0;
			for (const scene of scenes) {
				if (scene.id === selectedItem.id) {
					setCurrentFrame(frameOffset);
					break;
				}
				frameOffset += scene.durationInFrames;
			}
			
			if (debug) {
				console.log(`Preview: Selected scene from props: ${selectedItem.id}`);
				console.log(`Preview: Set current frame to: ${frameOffset}`);
			}
		}
	}, [selectedItem, selectedSceneId, scenes, setSelectedSceneId, setCurrentFrame, debug]);

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
					<div key={index} className="text-xs">
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

			{/* Debug toggle button */}
			{/* <button 
				onClick={toggleDebug}
				className={`absolute top-4 right-4 z-50 px-3 py-2 rounded-md text-xs font-mono transition-colors ${
					debug ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
				}`}
			>
				{debug ? 'Debug: ON' : 'Debug: OFF'}
			</button> */}

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
				) : (
					<div className="w-full h-full relative">
						{/* Use RemotionPreview component with the scenes data */}
						<RemotionPreview scenes={scenes} selectedSceneId={selectedSceneId} />
						
						{/* Scene information overlay */}
						{renderSceneInfo()}
						
						{/* Debug overlay for all scenes */}
						{debug && (
							<div className="absolute top-16 right-4 bg-black/70 text-white p-2 rounded-md text-xs font-mono z-50 max-h-[80%] overflow-y-auto w-64">
								<h4 className="font-bold mb-1">All Scenes:</h4>
								{scenes.map((scene, idx) => (
									<div key={idx} className={`mb-2 p-1 ${selectedSceneId === scene.id ? 'bg-blue-800/50 rounded' : ''}`}>
										<div>Scene {idx+1}: {scene.desc}</div>
										<div>ID: {scene.id}</div>
										<div>Duration: {scene.durationInFrames} frames</div>
										<div>Children: {scene.children.length}</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
