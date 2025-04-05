import { Scene } from "./remotion-types";

export const sampleRemotionXml: string = `
<content>
  <scene class="intro-scene" durationInFrames="150" desc="Introduction Scene">
    <title class="main-title" durationInFrames="150">Learning Web Development</title>
    <paragraph class="subtitle" durationInFrames="150">A comprehensive guide for beginners</paragraph>
  </scene>
  
  <scene class="content-scene" durationInFrames="240" desc="HTML Basics Section">
    <heading class="section-heading" durationInFrames="240">HTML Fundamentals</heading>
    <paragraph class="content-paragraph" durationInFrames="240">HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.</paragraph>
    <image class="illustration" durationInFrames="180" src="/assets/images/html-structure.png" />
  </scene>
  
  <scene class="content-scene" durationInFrames="210" desc="CSS Introduction">
    <heading class="section-heading" durationInFrames="210">Styling with CSS</heading>
    <paragraph class="content-paragraph" durationInFrames="210">CSS (Cascading Style Sheets) is used to style and layout web pages — for example, to alter the font, color, size, and spacing of your content.</paragraph>
    <paragraph class="content-paragraph" durationInFrames="180">It allows you to adapt the presentation to different types of devices, such as large screens, small screens, or printers.</paragraph>
  </scene>
  
  <scene class="content-scene" durationInFrames="300" desc="JavaScript Overview">
    <heading class="section-heading" durationInFrames="300">Interactive Web with JavaScript</heading>
    <paragraph class="content-paragraph" durationInFrames="300">JavaScript is a programming language that allows you to implement complex features on web pages.</paragraph>
    <paragraph class="content-paragraph" durationInFrames="270">Every time a web page does more than just sit there and display static information, JavaScript is probably involved.</paragraph>
    <image class="code-example" durationInFrames="240" src="/assets/images/js-example.png" />
  </scene>
  
  <scene class="outro-scene" durationInFrames="180" desc="Conclusion">
    <title class="closing-title" durationInFrames="180">Start Your Coding Journey Today!</title>
    <paragraph class="contact-info" durationInFrames="180">Visit our website at example.com for more tutorials</paragraph>
  </scene>
</content>
`;

// export const sampleRemotionJson: Scene[] = [
// 	{
// 		type: "scene",
// 		class: "intro-scene",
// 		durationInFrames: 150,
// 		desc: "Introduction Scene",
// 		children: [
// 			{
// 				type: "title",
// 				class: "main-title",
// 				durationInFrames: 150,
// 				text: "Learning Web Development",
// 			},
// 			{
// 				type: "paragraph",
// 				class: "subtitle",
// 				durationInFrames: 150,
// 				text: "A comprehensive guide for beginners",
// 			},
// 		],
// 	},
// 	{
// 		type: "scene",
// 		class: "content-scene",
// 		durationInFrames: 240,
// 		desc: "HTML Basics Section",
// 		children: [
// 			{
// 				type: "heading",
// 				class: "section-heading",
// 				durationInFrames: 240,
// 				text: "HTML Fundamentals",
// 			},
// 			{
// 				type: "paragraph",
// 				class: "content-paragraph",
// 				durationInFrames: 240,
// 				text: "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.",
// 			},
// 			{
// 				type: "image",
// 				class: "illustration",
// 				durationInFrames: 180,
// 				src: "/assets/images/html-structure.png",
// 			},
// 		],
// 	},
// 	{
// 		type: "scene",
// 		class: "content-scene",
// 		durationInFrames: 210,
// 		desc: "CSS Introduction",
// 		children: [
// 			{
// 				type: "heading",
// 				class: "section-heading",
// 				durationInFrames: 210,
// 				text: "Styling with CSS",
// 			},
// 			{
// 				type: "paragraph",
// 				class: "content-paragraph",
// 				durationInFrames: 210,
// 				text: "CSS (Cascading Style Sheets) is used to style and layout web pages — for example, to alter the font, color, size, and spacing of your content.",
// 			},
// 			{
// 				type: "paragraph",
// 				class: "content-paragraph",
// 				durationInFrames: 180,
// 				text: "It allows you to adapt the presentation to different types of devices, such as large screens, small screens, or printers.",
// 			},
// 		],
// 	},
// 	{
// 		type: "scene",
// 		class: "content-scene",
// 		durationInFrames: 300,
// 		desc: "JavaScript Overview",
// 		children: [
// 			{
// 				type: "heading",
// 				class: "section-heading",
// 				durationInFrames: 300,
// 				text: "Interactive Web with JavaScript",
// 			},
// 			{
// 				type: "paragraph",
// 				class: "content-paragraph",
// 				durationInFrames: 300,
// 				text: "JavaScript is a programming language that allows you to implement complex features on web pages.",
// 			},
// 			{
// 				type: "paragraph",
// 				class: "content-paragraph",
// 				durationInFrames: 270,
// 				text: "Every time a web page does more than just sit there and display static information, JavaScript is probably involved.",
// 			},
// 			{
// 				type: "image",
// 				class: "code-example",
// 				durationInFrames: 240,
// 				src: "/assets/images/js-example.png",
// 			},
// 		],
// 	},
// 	{
// 		type: "scene",
// 		class: "outro-scene",
// 		durationInFrames: 180,
// 		desc: "Conclusion",
// 		children: [
// 			{
// 				type: "title",
// 				class: "closing-title",
// 				durationInFrames: 180,
// 				text: "Start Your Coding Journey Today!",
// 			},
// 			{
// 				type: "paragraph",
// 				class: "contact-info",
// 				durationInFrames: 180,
// 				text: "Visit our website at example.com for more tutorials",
// 			},
// 		],
// 	},
// ];
