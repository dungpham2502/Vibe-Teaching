import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill } from "@remotion/renderer";
import { tmpdir } from "os";
import { join } from "path";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { composition, scenes } = body;

		// Create a temporary directory for the output
		const outputDir = tmpdir();
		const outputFile = join(outputDir, `${Date.now()}.mp4`);

		//  Server-side bundle location: For rendering video
		const bundleLocation = await bundle({
			entryPoint: path.resolve("./src/remotion/index.tsx"),
			webpackOverride: (config) => config,
		});

		// Render the video
		await renderMedia({
			composition,
			serveUrl: bundleLocation,
			codec: "h264",
			outputLocation: outputFile,
			inputProps: { scenes },
		});

		// Read the file as a buffer
		const fileBuffer = fs.readFileSync(outputFile);
		const base64Data = fileBuffer.toString("base64");

		// Clean up
		fs.unlinkSync(outputFile);

		return NextResponse.json({
			success: true,
			data: base64Data,
		});
	} catch (err) {
		console.error("Render error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
