// This file contains mock scene data for testing purposes
import { Scene, Title, Heading, Paragraph, Image } from "@/types/remotion-types";

// Mock scene elements
const mockTitle1: Title = {
  class: "intro-title animated-fade-in",
  type: "title",
  text: "Welcome to Vibe Teaching",
  durationInFrames: 60
};

const mockHeading1: Heading = {
  class: "intro-heading text-gradient slide-from-left",
  type: "heading",
  text: "Interactive Learning Experience",
  durationInFrames: 45
};

const mockParagraph1: Paragraph = {
  class: "intro-paragraph fade-in-delay",
  type: "paragraph",
  text: "This tutorial will guide you through the core concepts of our educational platform.",
  durationInFrames: 90
};

const mockImage1: Image = {
  class: "concept-image floating-animation",
  type: "image",
  src: "/globe.svg",
  durationInFrames: 120
};

// Array of mock scenes for testing
export const MOCK_SCENES: Scene[] = [
  {
    class: "intro-scene bg-gradient-blue",
    type: "scene",
    desc: "Introduction",
    durationInFrames: 150,
    children: [
      mockTitle1,
      mockHeading1,
      mockParagraph1
    ]
  },
  {
    class: "concepts-scene bg-pattern-grid",
    type: "scene",
    desc: "Key Concepts",
    durationInFrames: 180,
    children: [
      {
        class: "concepts-title accent-text zoom-in",
        type: "title",
        text: "Understanding the Fundamentals",
        durationInFrames: 60
      },
      {
        class: "concepts-heading highlight-text slide-from-right",
        type: "heading",
        text: "Core Educational Principles",
        durationInFrames: 45
      },
      {
        class: "concepts-paragraph two-column-layout",
        type: "paragraph",
        text: "Let's explore the main ideas and how they apply to modern teaching methods.",
        durationInFrames: 90
      },
      mockImage1
    ]
  },
  {
    class: "examples-scene bg-pattern-dots",
    type: "scene",
    desc: "Examples",
    durationInFrames: 200,
    children: [
      {
        class: "examples-title accent-orange pop-in",
        type: "title",
        text: "Real-World Applications",
        durationInFrames: 60
      },
      {
        class: "examples-paragraph side-by-side-layout",
        type: "paragraph",
        text: "See how these concepts work in practical classroom scenarios.",
        durationInFrames: 90
      },
      {
        class: "examples-image rotate-in-animation",
        type: "image",
        src: "/window.svg",
        durationInFrames: 120
      }
    ]
  },
  {
    class: "conclusion-scene bg-gradient-dark",
    type: "scene",
    desc: "Conclusion",
    durationInFrames: 160,
    children: [
      {
        class: "conclusion-title text-glow bounce-in",
        type: "title",
        text: "Wrapping Up",
        durationInFrames: 60
      },
      {
        class: "conclusion-paragraph subtle-slide-up",
        type: "paragraph",
        text: "Let's review what we've learned and discuss next steps.",
        durationInFrames: 90
      },
      {
        class: "conclusion-image scale-in-animation",
        type: "image",
        src: "/next.svg",
        durationInFrames: 120
      }
    ]
  }
];

// Function to initialize the scenes store
export function initializeMockScenes(setScenes: (scenes: Scene[]) => void, setSelectedSceneId: (id: string | null) => void) {
  setScenes(MOCK_SCENES);
  setSelectedSceneId(MOCK_SCENES[0].class); // Select the first scene by default
}