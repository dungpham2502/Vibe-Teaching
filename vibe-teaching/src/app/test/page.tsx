import { convertJsonToRemotionTypes } from "@/lib/json-parser";
import { convertXML } from "simple-xml-to-json";

export default function Test() {
	const xml = `
<content>
  <!-- Introduction Scene -->
  <scene class="w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px] py-[1080px] bg-gray-50 dark:bg-gray-900" durationInFrames="150" desc="Introduction to Shapes">
    <title class="max-w-[1536px] text-8xl md:text-9xl font-bold text-center text-blue-600 dark:text-blue-400 animate-fade-in" durationInFrames="150">Understanding Shapes</title>
  </scene>

  <!-- Shapes Scene -->
  <scene class="w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px] py-[1080px] bg-gray-50 dark:bg-gray-900" durationInFrames="300" desc="Learning about Shapes">
    <heading class="max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-[54px]" durationInFrames="150">What are Shapes?</heading>
    <paragraph class="max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed" durationInFrames="150">Shapes are all around us! They can be found in nature, art, and even in our daily lives.</paragraph>
    <image class="max-w-[1536px] max-h-[864px] object-contain rounded-lg shadow-lg" durationInFrames="150" src="shapes-nature.jpg"> <!-- Image of shapes in nature -->
    <paragraph class="max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed" durationInFrames="150">Some common shapes include circles, triangles, squares, and rectangles.</paragraph>
    <image class="max-w-[1536px] max-h-[864px] object-contain rounded-lg shadow-lg" durationInFrames="150" src="shapes-geometric.jpg"> <!-- Image of geometric shapes -->
  </scene>

  <!-- Applications Scene -->
  <scene class="w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px] py-[1080px] bg-gray-50 dark:bg-gray-900" durationInFrames="300" desc="Applying Shapes">
    <heading class="max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-[54px]" durationInFrames="150">Why are Shapes Important?</heading>
    <paragraph class="max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed" durationInFrames="150">Shapes are used in architecture, art, engineering, and even in design.</paragraph>
  </scene>

  <!-- Conclusion Scene -->
  <scene class="w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px] py-[1080px] bg-gray-50 dark:bg-gray-900" durationInFrames="150" desc="Conclusion">
    <title class="max-w-[1536px] text-8xl md:text-9xl font-bold text-center text-blue-600 dark:text-blue-400 animate-fade-in" durationInFrames="150">Thanks for Learning!</title>
  </scene>
</content>
  `;
	return (
		<div>{JSON.stringify(convertJsonToRemotionTypes(convertXML(xml)))}</div>
	);
}
