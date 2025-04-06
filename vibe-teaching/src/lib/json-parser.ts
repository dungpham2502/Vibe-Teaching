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
			image?: SceneElement;
		}>;
	};
}


async function processImageWithPexels(src: string): Promise<string> {
	// Check if the path matches the pattern "/assets/images/keyword.png"
	const keywordMatch = src.match(/\/assets\/images\/([^\/\s]+)\.png$/);
	
	if (!keywordMatch || !keywordMatch[1]) {
		return src; // Return original source if not matching the pattern
	}
	
	const keyword = keywordMatch[1];
	
	try {
		// Call Pexels API to get a random image by keyword
		const pexelsApiKey = process.env.PEXELS_API_KEY;
		
		if (!pexelsApiKey) {
			console.error("Pexels API key not found in environment variables");
			return src;
		}
		
		const response = await fetch(
			`https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1&page=${Math.floor(Math.random() * 10) + 1}`,
			{
				headers: {
					Authorization: `${pexelsApiKey}`
				}
			}
		);
		
		if (!response.ok) {
			console.error(`Pexels API error: ${response.statusText}`);
			return src;
		}
		
		const data = await response.json();
		
		if (data.photos && data.photos.length > 0) {
			return data.photos[0].src.large;
		}
	} catch (error) {
		console.error(`Error processing image with keyword "${keyword}":`, error);
	}
	
	return src; // Return the original source if any error occurs
}

export async function convertJsonToRemotionTypes(jsonData: JsonContent): Promise<Scene[]> {
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
		if (sceneObj.image && sceneObj.image.$ !== undefined) {
			// Get the original src from the $ property (attributes) instead of _ (content)
			const originalSrc = sceneObj.image.$.src || "";
			
			// Process the image with Pexels API if it matches the pattern
			const processedSrc = await processImageWithPexels(originalSrc);
			
			children.push({
				type: "image",
				class: sceneObj.image.$ ? sceneObj.image.$.class || "" : "",
				durationInFrames: parseInt(sceneObj.image.$?.durationInFrames || "150", 10),
				src: processedSrc,
			} as Image);
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
