"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScenesStore } from "@/store/useScenesStore";
import type { Scene } from "@/types/remotion-types";

interface TimelineProps {
  onSelectItem?: (item: {
    id: string;
    title: string;
    videoUrl?: string;
    thumbnail?: string;
  }) => void;
}

export default function Timeline({ onSelectItem }: TimelineProps) {
  const { scenes, selectedSceneId, setSelectedSceneId, debug } = useScenesStore();
  
  // Select the first scene if one is available and none is currently selected
  useEffect(() => {
    if (scenes.length > 0 && !selectedSceneId) {
      setSelectedSceneId(scenes[0].class);
      if (debug) console.log("Auto-selected first scene:", scenes[0].class);
    }
  }, [scenes, selectedSceneId, setSelectedSceneId, debug]);

  const handleSceneClick = (scene: Scene) => {
    // Update selected scene in the global store
    setSelectedSceneId(scene.class);
    
    // Also call the onSelectItem prop for backward compatibility
    if (onSelectItem) {
      // Find the first image in the scene's children to use as thumbnail
      const imageChild = scene.children.find(child => child.type === "image");
      
      onSelectItem({
        id: scene.class,
        title: scene.desc,
        thumbnail: imageChild?.src || "/file.svg"
      });
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Timeline</h2>
      {scenes.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No scenes available</p>
          <p className="text-gray-400 text-sm mt-2">
            Chat with the AI to generate scenes
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scenes.map((scene) => (
            <div
              key={scene.class}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-all border",
                selectedSceneId === scene.class
                  ? "bg-blue-50 border-blue-400 shadow"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              )}
              onClick={() => handleSceneClick(scene)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  {scene.children.find(child => child.type === "image")?.src ? (
                    <img 
                      src={scene.children.find(child => child.type === "image")?.src} 
                      alt="" 
                      className="w-6 h-6" 
                    />
                  ) : (
                    <span className="text-xl">🎬</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{scene.desc}</h3>
                  <p className="text-sm text-gray-500">
                    {scene.durationInFrames} frames
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
