import { Player } from "@remotion/player";
import { RemotionObject, Scene } from "@/types/remotion-types";
import { AbsoluteFill, Series } from "remotion";

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

// TODO: Handle Video, Image, Audio;

export function VideoComponent({ scenes }: { scenes: Scene[] }) {
	return (
		<Series>
			{scenes.map((scene: Scene) => (
				<Series.Sequence durationInFrames={scene.durationInFrames}>
					<AbsoluteFill>
						{scene.children.map((item: RemotionObject) => {
							switch (item.type) {
								case "title":
									return <p className="text-9xl">{item.text}</p>;
								case "subtitle":
									return <p className="text-2xl">{item.text}</p>;
								case "heading":
									return <p className="text-7xl">{item.text}</p>;
								case "paragraph":
									return <p className="text-2xl">{item.text}</p>;
								default:
									return <div>Item not supported</div>;
							}
						})}
					</AbsoluteFill>
				</Series.Sequence>
			))}
		</Series>
	);
}
