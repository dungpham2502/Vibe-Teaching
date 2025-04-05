// In your frontend component with the export button
import { useState } from "react";

function ExportVideoButton({ scenes }: { scenes: any }) {
	const [isExporting, setIsExporting] = useState<boolean>(false);
	const [exportedVideoUrl, setExportedVideoUrl] = useState<any>(null);

	const handleExport = async () => {
		try {
			setIsExporting(true);

			// Call your API route with the scenes data
			const response = await fetch("/api/remotion", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					composition: "VideoComponent", // This matches the id in your index.tsx
					scenes: scenes, // Your scenes data
				}),
			});

			const result: any = await response.json();

			if (result.success) {
				// Convert base64 data to a URL that can be used to download the video
				const videoData = `data:video/mp4;base64,${result.data}`;
				setExportedVideoUrl(videoData);
			} else {
				console.error("Export failed:", result.error);
				alert("Failed to export video");
			}
		} catch (error: any) {
			console.error("Export error:", error);
			alert("Error exporting video");
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div>
			<button
				onClick={handleExport}
				disabled={isExporting}
				className="px-4 py-2 bg-blue-500 text-white rounded"
			>
				{isExporting ? "Exporting..." : "Export Video"}
			</button>

			{exportedVideoUrl && (
				<div className="mt-4">
					<p>Your video is ready!</p>
					<a
						href={exportedVideoUrl}
						download="my-video.mp4"
						className="px-4 py-2 bg-green-500 text-white rounded"
					>
						Download Video
					</a>
				</div>
			)}
		</div>
	);
}

export default function Remotion() {
	return <div>Hello World</div>;
}
