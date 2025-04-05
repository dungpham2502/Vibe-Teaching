// // This file contains mock scene data for testing purposes
// import { Scene, Title, Heading, Paragraph, Image } from "@/types/remotion-types";

// // Mock scene elements
// const mockTitle1: Title = {
//   class: "intro-title animated-fade-in",
//   type: "title",
//   text: "Welcome to Vibe Teaching",
//   durationInFrames: 60
// };

// const mockHeading1: Heading = {
//   class: "intro-heading text-gradient slide-from-left",
//   type: "heading",
//   text: "Interactive Learning Experience",
//   durationInFrames: 45
// };

// const mockParagraph1: Paragraph = {
//   class: "intro-paragraph fade-in-delay",
//   type: "paragraph",
//   text: "This tutorial will guide you through the core concepts of our educational platform.",
//   durationInFrames: 90
// };

// const mockImage1: Image = {
//   class: "concept-image floating-animation",
//   type: "image",
//   src: "/globe.svg",
//   durationInFrames: 120
// };

// // Array of mock scenes for testing
// export const MOCK_SCENES: Scene[] = [{"type":"scene","class":"w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900","durationInFrames":150,"desc":"Introduction","children":[{"type":"title","class":"max-w-[1536px] text-8xl md:text-9xl font-bold text-center text-blue-600 dark:text-blue-400 animate-fade-in","durationInFrames":150,"text":"Learning About Shapes"}]},{"type":"scene","class":"w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900","durationInFrames":300,"desc":"Definition","children":[{"type":"heading","class":"max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6","durationInFrames":150,"text":"What is a Shape?"},{"type":"paragraph","class":"max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed","durationInFrames":150,"text":"A shape is an area with a specific boundary. It can be found in everyday objects like circles, squares, and triangles."}]},{"type":"scene","class":"w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900","durationInFrames":450,"desc":"Examples","children":[{"type":"heading","class":"max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6","durationInFrames":150,"text":"Examples of Shapes"},{"type":"image","class":"max-w-[1536px] h-[864px] object-contain rounded-lg shadow-lg mx-auto my-4","durationInFrames":300,"src":"[insert image URL]"},{"type":"paragraph","class":"max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed mx-4","durationInFrames":150,"text":"These are just a few examples of the many shapes you can find in the world around you."}]},{"type":"scene","class":"w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900","durationInFrames":600,"desc":"Conclusion","children":[{"type":"heading","class":"max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6","durationInFrames":150,"text":"Conclusion"},{"type":"paragraph","class":"max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed","durationInFrames":150,"text":"Learning about shapes is an important part of math and art. Remember to observe the world around you and find examples of different shapes."}]}];

// // Function to initialize the scenes store
// export function initializeMockScenes(setScenes: (scenes: Scene[]) => void, setSelectedSceneId: (id: string | null) => void) {
//   setScenes(MOCK_SCENES);
//   setSelectedSceneId(MOCK_SCENES[0].class); // Select the first scene by default
// }