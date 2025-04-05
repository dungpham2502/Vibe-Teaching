import { create } from "zustand";
import { Scene } from "@/types/remotion-types";

interface ScenesState {
	scenes: Scene[];
	selectedSceneId: string | null;
	debug: boolean;

	setScenes: (scenes: Scene[]) => void;
	addScene: (scene: Scene) => void;
	removeScene: (id: string) => void;
	setSelectedSceneId: (id: string | null) => void;
	toggleDebug: () => void;
	logState: () => void;
}

export const useScenesStore = create<ScenesState>((set, get) => ({
	scenes: [],
	selectedSceneId: null,
	debug: false,

	setScenes: (scenes) => {
		const state = get();
		if (state.debug) console.log("Setting scenes:", scenes);
		set({ scenes });
	},

	addScene: (scene) => {
		const state = get();
		if (state.debug) console.log("Adding scene:", scene);
		set((state) => ({ scenes: [...state.scenes, scene] }));
	},

	removeScene: (id) => {
		const state = get();
		if (state.debug) console.log("Removing scene with ID:", id);
		set((state) => ({
			scenes: state.scenes.filter((scene) => scene.class !== id),
			// If the selected scene is removed, deselect it
			selectedSceneId:
				state.selectedSceneId === id ? null : state.selectedSceneId,
		}));
	},

	setSelectedSceneId: (id) => {
		const state = get();
		if (state.debug) console.log("Setting selected scene ID:", id);
		set({ selectedSceneId: id });
	},

	toggleDebug: () => set((state) => ({ debug: !state.debug })),

	logState: () => {
		const state = get();
		console.log("Current scenes state:", {
			scenes: state.scenes,
			selectedSceneId: state.selectedSceneId,
			totalScenes: state.scenes.length,
		});
	},
}));
