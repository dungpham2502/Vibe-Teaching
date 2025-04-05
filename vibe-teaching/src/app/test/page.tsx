import { convertJsonToRemotionTypes } from "@/lib/json-parser";
import { convertXML } from "simple-xml-to-json";

export default function Test() {
	const xml = `
<content>
  <scene class="w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900" durationInFrames="150" desc="Introduction">
    <title class="max-w-[1536px] text-8xl md:text-9xl font-bold text-center text-blue-600 dark:text-blue-400 animate-fade-in" durationInFrames="150">Learning About Shapes</title>
  </scene>
  <scene class="w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900" durationInFrames="300" desc="Definition">
    <heading class="max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6" durationInFrames="150">What is a Shape?</heading>
    <paragraph class="max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed" durationInFrames="150">A shape is an area with a specific boundary. It can be found in everyday objects like circles, squares, and triangles.</paragraph>
  </scene>
  <scene class="w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900" durationInFrames="450" desc="Examples">
    <heading class="max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6" durationInFrames="150">Examples of Shapes</heading>
    <image class="max-w-[1536px] h-[864px] object-contain rounded-lg shadow-lg mx-auto my-4" durationInFrames="300" src="[insert image URL]">
      A picture of a circle, square, and triangle
    </image>
    <paragraph class="max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed mx-4" durationInFrames="150">These are just a few examples of the many shapes you can find in the world around you.</paragraph>
  </scene>
  <scene class="w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900" durationInFrames="600" desc="Conclusion">
    <heading class="max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6" durationInFrames="150">Conclusion</heading>
    <paragraph class="max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed" durationInFrames="150">Learning about shapes is an important part of math and art. Remember to observe the world around you and find examples of different shapes.</paragraph>
  </scene>
</content>
  `;
	return (
		<div>{JSON.stringify(convertJsonToRemotionTypes(convertXML(xml)))}</div>
	);
}
