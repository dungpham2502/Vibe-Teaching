import {
    Div,
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
            title?: SceneElement | SceneElement[];
            subtitle?: SceneElement | SceneElement[];
            heading?: SceneElement | SceneElement[];
            paragraph?: SceneElement | SceneElement[];
            image?: SceneElement | SceneElement[];
            div?: SceneElement | SceneElement[];
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
        const children = parseElements(sceneObj);

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


function parseElements(elementObj: {
    $: {
        durationInFrames?: string;
        desc?: string;
        class?: string;
        [key: string]: string | undefined;
    };
    title?: SceneElement | SceneElement[];
    subtitle?: SceneElement | SceneElement[];
    heading?: SceneElement | SceneElement[];
    paragraph?: SceneElement | SceneElement[];
    image?: SceneElement | SceneElement[];
    div?: SceneElement | SceneElement[];
}): RemotionObject[] {
    const children: RemotionObject[] = [];

    // Handle title elements
    if (elementObj.title) {
        if (Array.isArray(elementObj.title)) {
            for (const title of elementObj.title) {
                if (title.$ && title._) {
                    children.push({
                        type: "title",
                        class: title.$.class || "",
                        durationInFrames: parseInt(title.$.durationInFrames || "150", 10),
                        text: title._.trim(),
                    } as Title);
                }
            }
        } else if (elementObj.title.$ && elementObj.title._) {
            children.push({
                type: "title",
                class: elementObj.title.$.class || "",
                durationInFrames: parseInt(elementObj.title.$.durationInFrames || "150", 10),
                text: elementObj.title._.trim(),
            } as Title);
        }
    }
    
    // Handle subtitle elements
    if (elementObj.subtitle) {
        if (Array.isArray(elementObj.subtitle)) {
            for (const subtitle of elementObj.subtitle) {
                if (subtitle.$ && subtitle._) {
                    children.push({
                        type: "subtitle",
                        class: subtitle.$.class || "",
                        durationInFrames: parseInt(subtitle.$.durationInFrames || "150", 10),
                        text: subtitle._.trim(),
                    } as SubTitle);
                }
            }
        } else if (elementObj.subtitle.$ && elementObj.subtitle._) {
            children.push({
                type: "subtitle",
                class: elementObj.subtitle.$.class || "",
                durationInFrames: parseInt(elementObj.subtitle.$.durationInFrames || "150", 10),
                text: elementObj.subtitle._.trim(),
            } as SubTitle);
        }
    }
    
    // Handle heading elements
    if (elementObj.heading) {
        if (Array.isArray(elementObj.heading)) {
            for (const heading of elementObj.heading) {
                if (heading.$ && heading._) {
                    children.push({
                        type: "heading",
                        class: heading.$.class || "",
                        durationInFrames: parseInt(heading.$.durationInFrames || "150", 10),
                        text: heading._.trim(),
                    } as Heading);
                }
            }
        } else if (elementObj.heading.$ && elementObj.heading._) {
            children.push({
                type: "heading",
                class: elementObj.heading.$.class || "",
                durationInFrames: parseInt(elementObj.heading.$.durationInFrames || "150", 10),
                text: elementObj.heading._.trim(),
            } as Heading);
        }
    }
    
    // Handle paragraph elements
    if (elementObj.paragraph) {
        if (Array.isArray(elementObj.paragraph)) {
            for (const paragraph of elementObj.paragraph) {
                if (paragraph._ !== undefined) {
                    children.push({
                        type: "paragraph",
                        class: paragraph.$ ? paragraph.$.class || "" : "",
                        durationInFrames: parseInt(paragraph.$.durationInFrames || "150", 10),
                        text: paragraph._.trim(),
                    } as Paragraph);
                }
            }
        } else if (elementObj.paragraph._ !== undefined) {
            children.push({
                type: "paragraph",
                class: elementObj.paragraph.$ ? elementObj.paragraph.$.class || "" : "",
                durationInFrames: parseInt(elementObj.paragraph.$.durationInFrames || "150", 10),
                text: elementObj.paragraph._.trim(),
            } as Paragraph);
        }
    }
    
    // Handle image elements
    if (elementObj.image) {
        if (Array.isArray(elementObj.image)) {
            for (const image of elementObj.image) {
                if (image.$) {
                    children.push({
                        type: "image",
                        class: image.$.class || "",
                        durationInFrames: parseInt(image.$.durationInFrames || "150", 10),
                        src: image.$.src || "",
                    } as Image);
                }
            }
        } else if (elementObj.image.$) {
            children.push({
                type: "image",
                class: elementObj.image.$.class || "",
                durationInFrames: parseInt(elementObj.image.$.durationInFrames || "150", 10),
                src: elementObj.image.$.src || "",
            } as Image);
        }
    }

    // Handle div elements which can have nested children
    if (elementObj.div) {
        if (Array.isArray(elementObj.div)) {
            for (const divObj of elementObj.div) {
                const divChildren = parseElements(divObj);
                children.push({
                    type: "div",
                    id: uuidv4(),
                    class: divObj.$ ? divObj.$.class || "" : "",
                    children: divChildren,
                } as Div);
            }
        } else {
            const divChildren = parseElements(elementObj.div);
            children.push({
                type: "div",
                id: uuidv4(),
                class: elementObj.div.$ ? elementObj.div.$.class || "" : "",
                children: divChildren,
            } as Div);
        }
    }

    return children;
}