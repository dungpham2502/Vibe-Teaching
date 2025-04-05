import { Player } from "@remotion/player";
import { RemotionObject, Scene } from "@/types/remotion-types";
import { AbsoluteFill, Series } from "remotion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RemotionPreviewProps {
  scenes: Scene[];
  selectedSceneId?: string | null;
}

export function RemotionPreview({ scenes, selectedSceneId }: RemotionPreviewProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // Find the selected scene and its start frame
  useEffect(() => {
    if (selectedSceneId && scenes.length > 0) {
      let frameOffset = 0;
      
      // Find the selected scene and calculate its start frame
      for (const scene of scenes) {
        if (scene.class === selectedSceneId) {
          setCurrentFrame(frameOffset);
          break;
        }
        frameOffset += scene.durationInFrames;
      }
    }
  }, [selectedSceneId, scenes]);

  // Calculate total duration of all scenes
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);
  
  return (
    <div className="bg-white w-full">
      <div className="w-full aspect-video flex flex-col justify-center items-center border-red border-[1px] rounded">
        <Player
          fps={30}
          component={VideoComponent}
          inputProps={{ scenes }}
          durationInFrames={totalDuration || 3600}
          compositionHeight={1080}
          compositionWidth={1920}
          loop
          style={{
            width: "100%",
          }}
          controls
          initialFrame={currentFrame}
          acknowledgeRemotionLicense
        />
      </div>
    </div>
  );
}

// TODO: Handle Video, Audio;

export function VideoComponent({ scenes }: { scenes: Scene[] }) {
  return (
    <Series>
      {scenes.map((scene: Scene) => (
        <Series.Sequence key={scene.class} durationInFrames={scene.durationInFrames}>
          <AbsoluteFill className={cn("flex flex-col items-center justify-center p-20", scene.class)}>
            {scene.children.map((item: RemotionObject) => {
              switch (item.type) {
                case "title":
                  return (
                    <h1 
                      key={item.class} 
                      className={cn(
                        "text-9xl font-bold mb-8 text-center", 
                        item.class
                      )}
                    >
                      {item.text}
                    </h1>
                  );
                case "subtitle":
                  return (
                    <h2 
                      key={item.class} 
                      className={cn(
                        "text-6xl font-semibold my-4 text-center", 
                        item.class
                      )}
                    >
                      {item.text}
                    </h2>
                  );
                case "heading":
                  return (
                    <h3 
                      key={item.class} 
                      className={cn(
                        "text-7xl font-medium my-6 text-center", 
                        item.class
                      )}
                    >
                      {item.text}
                    </h3>
                  );
                case "paragraph":
                  return (
                    <p 
                      key={item.class} 
                      className={cn(
                        "text-4xl my-4 text-center max-w-4xl",
                        item.class
                      )}
                    >
                      {item.text}
                    </p>
                  );
                case "image":
                  return (
                    <div 
                      key={item.class} 
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
                    </div>
                  );
                default:
                  return <div key={item.id || item.class}>Item not supported</div>;
              }
            })}
          </AbsoluteFill>
        </Series.Sequence>
      ))}
    </Series>
  );
}
