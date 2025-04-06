import { Player, PlayerRef } from "@remotion/player";
import { RemotionObject, Scene } from "@/types/remotion-types";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useScenesStore } from "@/store/useScenesStore";

interface RemotionPreviewProps {
  scenes: Scene[];
  selectedSceneId?: string | null;
}

export function RemotionPreview({ scenes, selectedSceneId }: RemotionPreviewProps) {
  const { debug, setCurrentFrame: setGlobalCurrentFrame } = useScenesStore();
  const [currentFrame, setCurrentFrame] = useState(0);
  const playerRef = useRef<PlayerRef>(null);
  
  // Always render all scenes
  const scenesToRender = scenes;
  
  // Calculate the start frame based on selected scene
  let startFrame = 0;
  if (selectedSceneId && scenes.length > 0) {
    let frameCount = 0;
    for (const scene of scenes) {
      if (scene.id === selectedSceneId) {
        startFrame = frameCount;
        break;
      }
      frameCount += scene.durationInFrames;
    }
  }
  
  // Calculate total duration of scenes
  const totalDuration = scenesToRender.reduce((sum, scene) => sum + scene.durationInFrames, 0) || 3600;
  
  // Important: Use this effect to seek to the correct frame when selectedSceneId changes
  useEffect(() => {
    if (playerRef.current && selectedSceneId) {
      if (debug) {
        console.log('Seeking to frame:', startFrame);
      }
      
      // Pause first to make sure the seeking works correctly
      playerRef.current.pause();
      
      // This is crucial - use setTimeout to ensure the seek happens after the player has initialized
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.seekTo(startFrame);
          setCurrentFrame(startFrame);
          setGlobalCurrentFrame(startFrame);
        }
      }, 50);
    }
  }, [selectedSceneId, startFrame, debug, setGlobalCurrentFrame]);
  
  // Debug: Log the selected scene and start frame
  useEffect(() => {
    if (debug) {
      console.log('Selected scene ID:', selectedSceneId);
      console.log('Total scenes to render:', scenesToRender.length);
      console.log('Start frame for selected scene:', startFrame);
      
      // Check what text content we have in the scenes
      scenesToRender.forEach((scene, index) => {
        console.log(`Scene ${index} (${scene.desc}):`, {
          childCount: scene.children.length,
          textItems: scene.children.filter(child => 'text' in child).length,
          firstTextItem: scene.children.find(child => 'text' in child)?.text || 'none'
        });
      });
    }
  }, [selectedSceneId, scenesToRender, startFrame, debug]);
  
  return (
    <div className="bg-white w-full">
      <div className="w-full aspect-video flex flex-col justify-center items-center border-red border-[1px] rounded">
        <Player
          ref={playerRef}
          fps={30}
          component={VideoComponent}
          inputProps={{ scenes: scenesToRender }}
          durationInFrames={totalDuration || 3600}
          compositionHeight={1080}
          compositionWidth={1920}
          loop
          style={{
            width: "100%",
          }}
          controls
          initialFrame={0}
          acknowledgeRemotionLicense
        />
      </div>
    </div>
  );
}

// TODO: Handle Video, Audio;

export function VideoComponent({ scenes }: { scenes: Scene[] }) {
	const frame = useCurrentFrame();
	const { setCurrentFrame, debug } = useScenesStore();
	
	// Calculate which scene should be displayed based on the current frame
	let currentSceneIndex = 0;
	let frameOffset = 0;
	
	for (let i = 0; i < scenes.length; i++) {
		if (frame < frameOffset + scenes[i].durationInFrames) {
			currentSceneIndex = i;
			break;
		}
		frameOffset += scenes[i].durationInFrames;
	}
	
	// Calculate the relative frame within the current scene
	const relativeFrame = frame - frameOffset;
	const currentScene = scenes[currentSceneIndex];
	
	// Update the global store with the current frame
	useEffect(() => {
		setCurrentFrame(frame);
		if (debug) {
			console.log(`Current frame: ${frame}, Scene: ${currentSceneIndex}, Relative frame: ${relativeFrame}`);
		}
	}, [frame, currentSceneIndex, relativeFrame, setCurrentFrame, debug]);
	
	return (
		<Series>
			{scenes.map((scene: Scene, sceneIndex: number) => (
				<Series.Sequence key={scene.id || `scene-${scene.desc}-${sceneIndex}`} durationInFrames={scene.durationInFrames}>
					<AbsoluteFill className={cn("flex flex-col items-center justify-center p-20", scene.class)}>
						{/* Visual debug overlay */}
						{debug && (
							<div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded-md text-sm font-mono z-50 flex flex-col items-start">
								<div>Scene: {sceneIndex} - {scene.desc}</div>
								<div>Children: {scene.children.length}</div>
								<div>Frame: {frame} (Relative: {relativeFrame})</div>
								<div className={sceneIndex === currentSceneIndex ? "text-green-400" : ""}>
									{sceneIndex === currentSceneIndex ? "► ACTIVE" : ""}
								</div>
							</div>
						)}
					
						{scene.children.map((item: RemotionObject, itemIndex) => {
							// For debugging: Add visual indicator for each child element
							const ItemComponent = () => {
								switch (item.type) {
									case "title":
										return (
											<h1 
												key={item.id || `title-${itemIndex}`} 
												className={cn(
													"text-9xl font-bold mb-8 text-center", 
													item.class
												)}
											>
												{item.text}
												{debug && <span className="text-xs text-red-500"> (title)</span>}
											</h1>
										);
									case "subtitle":
										return (
											<h2 
												key={item.id || `subtitle-${itemIndex}`} 
												className={cn(
													"text-6xl font-semibold my-4 text-center", 
													item.class
												)}
											>
												{item.text}
												{debug && <span className="text-xs text-red-500"> (subtitle)</span>}
											</h2>
										);
									case "heading":
										return (
											<h3 
												key={item.id || `heading-${itemIndex}`} 
												className={cn(
													"text-7xl font-medium my-6 text-center", 
													item.class
												)}
											>
												{item.text}
												{debug && <span className="text-xs text-red-500"> (heading)</span>}
											</h3>
										);
									case "paragraph":
										return (
											<p 
												key={item.id || `paragraph-${itemIndex}`} 
												className={cn(
													"text-4xl my-4 text-center max-w-4xl",
													item.class
												)}
											>
												{item.text}
												{debug && <span className="text-xs text-red-500"> (paragraph)</span>}
											</p>
										);
									case "image":
										return (
											<div 
												key={item.id || `image-${itemIndex}`} 
												className={cn(
													"my-6 flex justify-center items-center",
													item.class
												)}
											>
												<img 
													src={item.src} 
													alt="" 
													className="max-w-2xl max-h-[40vh] object-contain" 
												/>
												{debug && <div className="absolute bottom-0 text-xs text-red-500">Image: {item.src}</div>}
											</div>
										);
									default:
										return (
											<div key={item.id || `item-${itemIndex}`}>
												Item not supported
												{debug && <span className="text-xs text-red-500"> (unknown: {item.type})</span>}
											</div>
										);
								}
							};
							
							return (
								<div key={`${scene.id}-${itemIndex}`} className="relative">
									{debug && (
										<div className="absolute top-0 left-0 bg-blue-500/50 text-white text-xs p-1 z-40">
											Item {itemIndex}: {item.type}
										</div>
									)}
									<ItemComponent />
								</div>
							);
						})}
					</AbsoluteFill>
				</Series.Sequence>
			))}
		</Series>
	);
}
