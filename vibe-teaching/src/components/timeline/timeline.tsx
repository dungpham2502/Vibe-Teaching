"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScenesStore } from "@/store/useScenesStore";
import type { Scene } from "@/types/remotion-types";
import { motion } from "framer-motion";

interface TimelineProps {
  onSelectItem?: (item: {
    id: string;
    title: string;
    videoUrl?: string;
    thumbnail?: string;
  }) => void;
}

export default function Timeline({ onSelectItem }: TimelineProps) {
  const { scenes, selectedSceneId, setSelectedSceneId, setCurrentFrame, debug } = useScenesStore();
  
  // Select the first scene if one is available and none is currently selected
  useEffect(() => {
    if (scenes.length > 0 && !selectedSceneId) {
      setSelectedSceneId(scenes[0].id);
      setCurrentFrame(0); // Reset to first frame
      if (debug) console.log("Auto-selected first scene:", scenes[0].id);
    }
  }, [scenes, selectedSceneId, setSelectedSceneId, setCurrentFrame, debug]);

  const handleSceneClick = (scene: Scene) => {
    // Update selected scene in the global store
    setSelectedSceneId(scene.id);
    
    // Calculate the starting frame for this scene
    let frameOffset = 0;
    for (const s of scenes) {
      if (s.id === scene.id) {
        break;
      }
      frameOffset += s.durationInFrames;
    }
    
    // Update the current frame to the beginning of this scene
    setCurrentFrame(frameOffset);
    
    if (debug) {
      console.log(`Selected scene: ${scene.desc || 'Unnamed scene'}`);
      console.log(`Starting at frame: ${frameOffset}`);
      console.log(`Scene has ${scene.children.length} children`);
    }
    
    // Also call the onSelectItem prop for backward compatibility
    if (onSelectItem) {
      // Find the first image in the scene's children to use as thumbnail
      const imageChild = scene.children.find(child => child.type === "image");
      
      onSelectItem({
        id: scene.id,
        title: scene.desc || 'Unnamed scene',
        thumbnail: imageChild?.src || "/file.svg"
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 flex items-center">
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 h-6 w-1 rounded-full mr-2"></span>
        Timeline
      </h2>
      {scenes.length === 0 ? (
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-lg border border-indigo-100 shadow-sm">
          <p className="text-indigo-600">No scenes available</p>
          <p className="text-indigo-400 text-sm mt-2">
            Chat with the AI to generate scenes
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scenes.map((scene, index) => (
            <motion.div
              key={scene.id || `scene-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-all border",
                selectedSceneId === scene.id
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 shadow-md"
                  : "bg-white/90 border-indigo-100 hover:bg-indigo-50/80 hover:border-indigo-200"
              )}
              onClick={() => handleSceneClick(scene)}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-lg transition-all flex-shrink-0",
                  selectedSceneId === scene.id 
                    ? "bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200" 
                    : "bg-indigo-50 border border-indigo-100"
                )}>
                  {scene.children.find(child => child.type === "image")?.src ? (
                    <img 
                      src={scene.children.find(child => child.type === "image")?.src} 
                      alt="" 
                      className="w-6 h-6 object-cover rounded" 
                    />
                  ) : (
                    <span className="text-xl">🎬</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium transition-colors",
                    selectedSceneId === scene.id ? "text-indigo-700" : "text-indigo-600"
                  )}>
                    {scene.desc || `Scene ${index + 1}`}
                  </h3>
                  <div className="flex justify-between">
                    <p className="text-sm text-indigo-400">
                      {scene.durationInFrames} frames
                    </p>
                    <p className="text-sm text-indigo-400">
                      {scene.children.length} elements
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
