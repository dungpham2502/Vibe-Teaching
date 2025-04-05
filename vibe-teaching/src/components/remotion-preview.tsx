import { Player } from "@remotion/player";
import { RemotionObject, Scene } from "@/types/remotion-types";
import { AbsoluteFill, Series } from "remotion";
import { cn } from "@/lib/utils";

export function RemotionPreview({ scenes }: { scenes: Scene[] }) {
	return (
		<div className="bg-white w-full">
			<div className="w-full aspect-video flex flex-col justify-center items-center border-red border-[1px] rounded">
				<Player
					fps={30}
					component={VideoComponent}
					inputProps={{ scenes }}
					durationInFrames={240}
					compositionHeight={1080}
					compositionWidth={1920}
					loop
					style={{
						width: "100%",
					}}
					controls
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
				<Series.Sequence key={scene.id || `scene-${scene.desc}-${Math.random()}`} durationInFrames={scene.durationInFrames}>
					<AbsoluteFill className={cn("flex flex-col items-center justify-center p-20", scene.class)}>
						{scene.children.map((item: RemotionObject) => {
							switch (item.type) {
								case "title":
									return (
										<h1 
											key={item.id || `title-${Math.random()}`} 
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
											key={item.id || `subtitle-${Math.random()}`} 
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
											key={item.id || `heading-${Math.random()}`} 
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
											key={item.id || `paragraph-${Math.random()}`} 
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
											key={item.id || `image-${Math.random()}`} 
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
									return <div key={item.id || `item-${Math.random()}`}>Item not supported</div>;
							}
						})}
					</AbsoluteFill>
				</Series.Sequence>
			))}
		</Series>
	);
}
