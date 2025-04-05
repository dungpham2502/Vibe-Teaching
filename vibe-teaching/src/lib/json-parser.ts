import {
	Heading,
	Image,
	Paragraph,
	RemotionObject,
	Scene,
	SubTitle,
	Title,
} from "@/types/remotion-types";

export function convertJsonToRemotionTypes(jsonData: any): Scene[] {
	if (!jsonData?.content?.children) {
		throw new Error("Invalid JSON structure: Expected video.children array");
	}

	const scenes: Scene[] = [];

	for (const sceneObj of jsonData.content.children) {
		if (!sceneObj.scene) continue;

		const sceneData = sceneObj.scene;
		const children: RemotionObject[] = [];

		// Process scene's children
		if (Array.isArray(sceneData.children)) {
			for (const child of sceneData.children) {
				if (child.title) {
					children.push({
						type: "title",
						class: child.title.class,
						durationInFrames: parseInt(child.title.durationInFrames, 10),
						text: child.title.content,
					} as Title);
				} else if (child.subtitle) {
					children.push({
						type: "subtitle",
						class: child.subtitle.class,
						durationInFrames: parseInt(child.subtitle.durationInFrames, 10),
						text: child.subtitle.content,
					} as SubTitle);
				} else if (child.heading) {
					children.push({
						type: "heading",
						class: child.heading.class,
						durationInFrames: parseInt(child.heading.durationInFrames, 10),
						text: child.heading.content,
					} as Heading);
				} else if (child.paragraph) {
					children.push({
						type: "paragraph",
						class: child.paragraph.class,
						durationInFrames: parseInt(child.paragraph.durationInFrames, 10),
						text: child.paragraph.content,
					} as Paragraph);
				} else if (child.image) {
					children.push({
						type: "image",
						class: child.image.class,
						durationInFrames: parseInt(child.image.durationInFrames, 10),
						src: child.image.src,
					} as Image);
				}
			}
		}

		// Create the scene object
		scenes.push({
			type: "scene",
			class: sceneData.class,
			durationInFrames: parseInt(sceneData.durationInFrames, 10),
			desc: sceneData.desc,
			children,
		} as Scene);
	}

	return scenes;
}
