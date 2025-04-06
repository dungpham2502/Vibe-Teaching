"use client";

import { useRef, useEffect } from "react";
import { RemotionPreview } from "../remotion-preview";
import { useScenesStore } from "@/store/useScenesStore";
import { motion } from "framer-motion";
import { Film, Info, Code } from "lucide-react";

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

	// Animation variants
	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } }
	};

	// Helper function to render selected scene information
	const renderSceneInfo = () => {
		if (!selectedScene) return null;
		
		return (
			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md space-y-2 max-w-xs border border-blue-100"
			>
				<h3 className="font-bold text-base text-indigo-700">{selectedScene.desc}</h3>
				<div className="flex items-center text-xs text-indigo-500">
					<Info className="h-3 w-3 mr-1" />
					<span>Duration: {selectedScene.durationInFrames} frames</span>
				</div>
				<div className="flex items-center text-xs text-indigo-500">
					<Code className="h-3 w-3 mr-1" />
					<span>Elements: {selectedScene.children.length}</span>
				</div>
				{selectedScene.children.map((child, index) => (
					<div key={index} className="text-xs text-gray-600">
						<span className="font-medium">{child.type}:</span> {
							'text' in child ? child.text : 
							'src' in child ? child.src : 
							child.class
						}
					</div>
				)).slice(0, 3)}
				{selectedScene.children.length > 3 && (
					<p className="text-xs text-indigo-400">+ {selectedScene.children.length - 3} more elements</p>
				)}
			</motion.div>
		);
	};

	return (
		<div className="h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex flex-col">
			<h2 className="text-xl font-bold mb-4 text-indigo-700">Preview</h2>

			<div className="flex-grow flex items-center justify-center relative bg-white/70 backdrop-blur-sm rounded-lg border border-purple-100 shadow-sm">
				{isLoading ? (
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }} 
						className="text-center p-8"
					>
						<motion.div 
							animate={{ rotate: 360 }}
							transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
							className="rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"
						></motion.div>
						<p className="text-indigo-600 font-medium">Generating preview...</p>
						<p className="text-gray-500 text-sm mt-2">Creating something amazing!</p>
					</motion.div>
				) : scenes.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center p-8"
					>
						<div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
							<Film className="h-10 w-10 text-white" />
						</div>
						<p className="text-gray-600 font-medium">No scenes available</p>
						<p className="text-gray-400 text-sm mt-2">
							Chat with the AI to generate scenes
						</p>
					</motion.div>
				) : (
					<motion.div
						variants={fadeIn}
						initial="hidden"
						animate="visible" 
						className="w-full h-full relative"
					>
						{/* Use RemotionPreview component with the scenes data */}
						<RemotionPreview scenes={scenes} selectedSceneId={selectedSceneId} />
						
						{/* Scene information overlay */}
						{renderSceneInfo()}
						
						{/* Debug overlay for all scenes */}
						{debug && (
							<motion.div 
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								className="absolute top-16 right-4 bg-black/70 text-white p-2 rounded-md text-xs font-mono z-50 max-h-[80%] overflow-y-auto w-64 border border-purple-500"
							>
								<h4 className="font-bold mb-1">All Scenes:</h4>
								{scenes.map((scene, idx) => (
									<div key={idx} className={`mb-2 p-1 ${selectedSceneId === scene.id ? 'bg-blue-800/50 rounded' : ''}`}>
										<div>Scene {idx+1}: {scene.desc}</div>
										<div>ID: {scene.id}</div>
										<div>Duration: {scene.durationInFrames} frames</div>
										<div>Children: {scene.children.length}</div>
									</div>
								))}
							</motion.div>
						)}
					</motion.div>
				)}
			</div>
		</div>
	);
}
