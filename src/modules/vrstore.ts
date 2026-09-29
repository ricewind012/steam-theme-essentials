import { findModuleExport } from "millennium";

interface VRStore {
	get IsSteamVRRunning(): boolean;
	get IsVRHMDPresent(): boolean;
}

export const CVRStore: VRStore = findModuleExport((e) => e.OnVRModeChanged);
