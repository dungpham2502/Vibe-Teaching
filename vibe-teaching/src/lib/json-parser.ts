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

// Define a more specific type for the input JSON structure
interface SceneElement {
	$: {
		durationInFrames?: string;
		desc?: string;
		class?: string;
		[key: string]: string | undefined;
	};
	_?: string;
}

interface JsonContent {
	content?: {
		scene?: Array<{
			$: {
				durationInFrames?: string;
				desc?: string;
				class?: string;
				[key: string]: string | undefined;
			};
			title?: SceneElement;
			subtitle?: SceneElement;
			heading?: SceneElement;
			paragraph?: SceneElement;
		}>;
	};
}

export function convertJsonToRemotionTypes(jsonData: JsonContent): Scene[] {
	if (!jsonData) {
		console.error("Invalid JSON: Input data is null or undefined");
		return [];
	}

	if (!jsonData.content) {
		console.error("Invalid JSON structure: Missing 'content' property", jsonData);
		return [];
	}

	if (!jsonData.content.scene || !Array.isArray(jsonData.content.scene)) {
		console.error("Invalid JSON structure: Expected 'content.scene' array", jsonData);
		return [];
	}

	const scenes: Scene[] = [];

	for (const sceneObj of jsonData.content.scene) {
		const children: RemotionObject[] = [];
		if (sceneObj.title && sceneObj.title.$ && sceneObj.title._) {
			children.push({
				type: "title",
				class: sceneObj.title.$ ? sceneObj.title.$.class || "" : "",
				durationInFrames: parseInt(sceneObj.title.$?.durationInFrames || "150", 10),
				text: sceneObj.title._,
			} as Title);
		}
		if (sceneObj.subtitle && sceneObj.subtitle.$ && sceneObj.subtitle._) {
			children.push({
				type: "subtitle",
				class: sceneObj.subtitle.$ ? sceneObj.subtitle.$.class || "" : "",
				durationInFrames: parseInt(sceneObj.subtitle.$?.durationInFrames || "150", 10),
				text: sceneObj.subtitle._,
			} as SubTitle);
		}
		if (sceneObj.heading && sceneObj.heading.$ && sceneObj.heading._) {
			children.push({
				type: "heading",
				class: sceneObj.heading.$ ? sceneObj.heading.$.class || "" : "",
				durationInFrames: parseInt(sceneObj.heading.$?.durationInFrames || "150", 10),
				text: sceneObj.heading._,
			} as Heading);
		}
		if (sceneObj.paragraph && sceneObj.paragraph._ !== undefined) {
			children.push({
				type: "paragraph",
				class: sceneObj.paragraph.$ ? sceneObj.paragraph.$.class || "" : "",
				durationInFrames: parseInt(sceneObj.paragraph.$?.durationInFrames || "150", 10),
				text: sceneObj.paragraph._,
			} as Paragraph);
		}

		scenes.push({
			type: "scene",
			id: uuidv4(),
			class: sceneObj.$ ? sceneObj.$.class || "" : "",
			durationInFrames: parseInt(sceneObj.$?.durationInFrames || "150", 10),
			desc: sceneObj.$?.desc || "",
			children: children,
		});
	}
	
	if (scenes.length === 0) {
		console.warn("No valid scenes found in the input JSON");
	} else {
		console.log(`Successfully parsed ${scenes.length} scenes`);
	}
	
	return scenes;
}
