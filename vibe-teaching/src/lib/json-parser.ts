import {
	Heading,
	Image,
	Paragraph,
	RemotionObject,
	Scene,
	SubTitle,
	Title,
} from "@/types/remotion-types";
import { v4 as uuidv4 } from "uuid";

export function convertJsonToRemotionTypes(jsonData: any): Scene[] {
	if (!jsonData?.content) {
		console.error(jsonData);
		throw new Error("Invalid JSON structure: Expected video.content array");
	}

	const scenes: Scene[] = [];

	for (const sceneObj of jsonData.content.scene) {
		const children: RemotionObject[] = [];
		if (sceneObj.title) {
			children.push({
				type: "title",
				class: sceneObj.title.$,
				durationInFrames: parseInt(sceneObj.title.$.durationInFrames|| "150", 10),
				text: sceneObj.title._,
			} as Title);
		}
		if (sceneObj.subtitle) {
			children.push({
				type: "subtitle",
				class: sceneObj.subtitle.$,
				durationInFrames: parseInt(sceneObj.subtitle.$.durationInFrames|| "150", 10),
				text: sceneObj.subtitle._,
			} as SubTitle);
		}
		if (sceneObj.heading) {
			children.push({
				type: "heading",
				class: sceneObj.heading.$,
				durationInFrames: parseInt(sceneObj.heading.$.durationInFrames|| "150", 10),
				text: sceneObj.heading._,
			} as Heading);
		}
		if (sceneObj.paragraph) {
			children.push({
				type: "paragraph",
				class: sceneObj.paragraph.$,
				durationInFrames: parseInt(sceneObj.paragraph.$.durationInFrames || "150", 10),
				text: sceneObj.paragraph._,
			} as Paragraph);
		}


		scenes.push({
			type: "scene",
			id: uuidv4(),
			class: sceneObj.$,
			durationInFrames: parseInt(sceneObj.$.durationInFrames|| "150", 10),
			desc: sceneObj.$.desc,
			children: children,
		});
	}
	console.log(scenes);
	return scenes;
}
