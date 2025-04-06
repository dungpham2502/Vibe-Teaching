# Vibe Teaching

An AI-powered educational platform for creating engaging video lessons using Remotion.

## Overview

Vibe Teaching transforms how educators create content by combining the power of AI with dynamic video rendering. The platform enables teachers to generate educational videos through natural conversation, with real-time previews and an intuitive timeline interface.

## Features

- **AI-Generated Content**: Create lesson content through conversation with an AI assistant
- **Real-time Preview**: See your video content as it's being generated
- **Interactive Timeline**: Organize and navigate through your video segments
- **Focus Mode**: Immersive viewing experience with background blur
- **Responsive Design**: Clean, modern UI that works across devices
- **Dynamic Animations**: Engaging visual elements powered by Remotion

## Tech Stack

- **Framework**: Next.js 15 with App Router and TypeScript
- **UI**: React 19, Tailwind CSS 4, Radix UI components
- **State Management**: Zustand
- **Video Rendering**: Remotion 4
- **AI Integration**: Groq API
- **Styling**: Tailwind CSS with animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or another package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vibe-teaching.git
   cd vibe-teaching
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with required API keys:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Start a Conversation**: Begin by describing the educational content you want to create
2. **Generate Videos**: The AI will process your request and generate video content
3. **Preview and Edit**: View the generated content in real-time and make adjustments
4. **Navigate Timeline**: Use the timeline to switch between different segments
5. **Focus Mode**: Toggle focus mode for distraction-free viewing

## Project Structure

- `src/app` - Next.js app router pages and layouts
- `src/components` - UI components including chat interface, preview and timeline
- `src/store` - Zustand state management
- `src/lib` - Utility functions and shared libraries
- `src/hooks` - Custom React hooks
- `src/types` - TypeScript type definitions

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## License

[MIT License](LICENSE)

## Acknowledgments

- [Remotion](https://www.remotion.dev/) for the video rendering framework
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Groq](https://groq.com/) for AI capabilities
