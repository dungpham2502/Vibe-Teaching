"use client";

import { useEffect, useState } from "react";
import { spring, useCurrentFrame, interpolate } from "remotion";

// Enhanced animated logo component
const AnimatedLogo = () => {
	const frame = useCurrentFrame();

	// Initial entrance animation
	const entranceScale = spring({
		frame,
		fps: 30,
		config: { damping: 12, mass: 0.8 },
		durationInFrames: 45,
	});

	// Continuous subtle floating animation
	const floatY = Math.sin(frame / 15) * 10;

	// Glow effect timing
	const glowIntensity = interpolate(frame % 90, [0, 45, 90], [0, 1, 0], {
		extrapolateRight: "clamp",
	});

	return (
		<div className="relative">
			<div
				className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
				style={{
					transform: `scale(${entranceScale}) translateY(${floatY}px)`,
					opacity: entranceScale,
					filter: `drop-shadow(0 0 ${
						glowIntensity * 15
					}px rgba(167, 139, 250, 0.8))`,
				}}
			>
				VIBE
			</div>
		</div>
	);
};

// Animated subtitle with typewriter effect
const AnimatedSubtitle = () => {
	const frame = useCurrentFrame();
	const text = "The Ultimate Teaching Platform";

	// Start typing after logo animation (30 frames delay)
	const visibleCharacters = Math.floor(
		interpolate(frame - 30, [0, 60], [0, text.length], {
			extrapolateRight: "clamp",
		})
	);

	return (
		<div className="text-2xl text-gray-300 mt-4 mb-12 h-8 font-light tracking-wide">
			{text.substring(0, visibleCharacters)}
			{visibleCharacters < text.length && (
				<span className="animate-pulse">|</span>
			)}
		</div>
	);
};

// Enhanced animated feature cards
const AnimatedCards = () => {
	const frame = useCurrentFrame();

	const cards = [
		{
			title: "Interactive Lessons",
			icon: "🎓",
			color: "bg-gradient-to-br from-blue-500 to-blue-700",
		},
		{
			title: "Real-time Feedback",
			icon: "⚡",
			color: "bg-gradient-to-br from-emerald-500 to-green-700",
		},
		{
			title: "AI Assistance",
			icon: "🤖",
			color: "bg-gradient-to-br from-amber-500 to-yellow-700",
		},
		{
			title: "Collaborative Tools",
			icon: "👥",
			color: "bg-gradient-to-br from-fuchsia-500 to-purple-700",
		},
	];

	// Start cards animation after subtitle (delay of 90 frames from start)
	const cardsStartFrame = 90;

	return (
		<div className="flex gap-6 mt-6">
			{cards.map((card, i) => {
				const delay = i * 10;

				// Entrance animation
				const y = interpolate(
					frame - cardsStartFrame - delay,
					[0, 30],
					[500, 0],
					{ extrapolateRight: "clamp" }
				);

				// Opacity fade in
				const opacity = interpolate(
					frame - cardsStartFrame - delay,
					[0, 20],
					[0, 1],
					{ extrapolateRight: "clamp" }
				);

				// Scale up slightly on entrance
				const scale = interpolate(
					frame - cardsStartFrame - delay,
					[0, 30],
					[0.8, 1],
					{ extrapolateRight: "clamp" }
				);

				// Subtle continuous hover effect
				const hover = Math.sin((frame - cardsStartFrame - delay) / 20) * 5;

				return (
					<div
						key={i}
						className={`${card.color} rounded-xl p-5 shadow-lg w-52 h-44 flex flex-col items-center justify-center backdrop-blur-md`}
						style={{
							transform: `translateY(${y + hover}px) scale(${scale})`,
							opacity,
							boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
						}}
					>
						<div className="text-4xl mb-3">{card.icon}</div>
						<span className="text-white font-medium text-center">
							{card.title}
						</span>
					</div>
				);
			})}
		</div>
	);
};

// Animated background particles
const BackgroundParticles = () => {
	const frame = useCurrentFrame();
	const particleCount = 25;

	// Generate particles with different speeds, sizes and starting positions
	const particles = Array.from({ length: particleCount }, (_, i) => {
		const speed = 0.5 + Math.random() * 1.5;
		const size = 3 + Math.random() * 8;
		const startX = Math.random() * 100;
		const startY = Math.random() * 100;
		const opacity = 0.1 + Math.random() * 0.4;

		return { speed, size, startX, startY, opacity };
	});

	return (
		<div className="absolute inset-0 overflow-hidden">
			{particles.map((particle, i) => {
				const y = (particle.startY + frame * particle.speed) % 100;

				return (
					<div
						key={i}
						className="absolute rounded-full bg-white"
						style={{
							width: `${particle.size}px`,
							height: `${particle.size}px`,
							left: `${particle.startX}%`,
							top: `${y}%`,
							opacity: particle.opacity,
							filter: "blur(1px)",
						}}
					/>
				);
			})}
		</div>
	);
};

export default function Demo() {
	const frame = useCurrentFrame();

	// Main content fade in
	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: "clamp",
	});

	return (
		<div
			className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black relative overflow-hidden"
			style={{ opacity }}
		>
			<BackgroundParticles />
			<div className="z-10 flex flex-col items-center">
				<AnimatedLogo />
				<AnimatedSubtitle />
				<AnimatedCards />
			</div>
		</div>
	);
}
