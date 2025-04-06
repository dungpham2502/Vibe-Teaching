import { Scene } from "./remotion-types";
import { 
	makeTransform, 
	scale, 
	translateY, 
	rotate,
	translate,
	translateX,
	translateZ,
	scale3d,
	perspective,
	rotateX,
	rotateY,
	skew,
	interpolateStyles 
  } from "@remotion/animation-utils";


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

export const animationProfiles = [
  {
    name: "calm",
    styles: (progress: number) => interpolateStyles(
    progress,
    [0, 0.1, 0.3, 0.7, 1],
    [
      { 
      opacity: 0.6, 
      transform: makeTransform([scale(0.95), translateY(5), rotate(0.2)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([scale(1.02), translateY(-2), rotate(0)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([scale(1), translateY(0), rotate(0.1)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([scale(1.01), translateY(-1), rotate(0)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([scale(1), translateY(0), rotate(0)]) 
      }
    ]
    )
  },
  {
    name: "moderate",
    styles: (progress: number) => interpolateStyles(
    progress,
    [0, 0.1, 0.3, 0.7, 1],
    [
      { 
      opacity: 0.5, 
      transform: makeTransform([translateX(-10), scale(0.92), rotateY(5)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([translateX(5), scale(1.04), rotateY(-2)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([translateX(0), scale(1), rotateY(0)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([translateX(3), scale(1.02), rotateY(1)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([translateX(0), scale(1), rotateY(0)]) 
      }
    ]
    )
  },
  {
    name: "energetic",
    styles: (progress: number) => interpolateStyles(
    progress,
    [0, 0.1, 0.3, 0.7, 1],
    [
      { 
      opacity: 0.4, 
      transform: makeTransform([perspective(800), translateZ(-50), rotateX(10)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([perspective(800), translateZ(30), rotateX(-5)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([perspective(800), translateZ(0), rotateX(0)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([perspective(800), translateZ(20), rotateX(3)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([perspective(800), translateZ(0), rotateX(0)]) 
      }
    ]
    )
  },
  {
    name: "explosive",
    styles: (progress: number) => interpolateStyles(
    progress,
    [0, 0.1, 0.3, 0.7, 1],
    [
      { 
      opacity: 0.3, 
      transform: makeTransform([scale3d(0.7, 0.7, 1), translate(-30, 20), skew(5)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([scale3d(1.2, 1.1, 1), translate(15, -15), skew(-3)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([scale3d(1.05, 1.05, 1), translate(0, 0), skew(0)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([scale3d(1.1, 1.05, 1), translate(10, -5), skew(2)]) 
      },
      { 
      opacity: 1, 
      transform: makeTransform([scale3d(1, 1, 1), translate(0, 0), skew(0)]) 
      }
    ]
    )
  }
  ];
