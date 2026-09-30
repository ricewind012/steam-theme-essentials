import {
	type ELaunchSource,
	findModuleByExport,
	type Module,
	type SteamAppOverview,
} from "millennium";

import type { SteamUIWindowInstance } from "@/utils/steamtypes";

const exports = Object.values<Module>(
	findModuleByExport((e) => {
		const str = e.toString();
		return str.includes("BIsAppBlocked()") && str.includes("GetPerClientData");
	}),
);

/**
 * There are more, but these are the ones {@link GetAppAction} uses.
 */
export type AppAction_t =
	| "BorrowApp"
	| "Cancel"
	| "Connect"
	| "Download"
	| "Install"
	| "Launch"
	| "Pause"
	| "Play"
	| "PlayMusic"
	| "PreLoad"
	| "PurchaseApp"
	| "Resume"
	| "ResumeGameInProgress"
	| "Stop"
	| "Stream"
	| "Uninstall"
	| "Update";

type PerClientData_t = "local" | "mostavailable" | "selected";

export const GetAppAction: (
	pWindowInstance: SteamUIWindowInstance,
	pOverview: SteamAppOverview,
	ePerClientData?: PerClientData_t,
) => AppAction_t | null = exports.find((e) =>
	e.toString().includes("BIsAppBlocked()"),
);

export const GetCallbackForAppAction: (
	eAction: AppAction_t,
	pOverview: SteamAppOverview,
	ePerClientData: PerClientData_t,
	eLaunchSource: ELaunchSource,
	wnd?: Window,
) => () => void = exports.find((e) => e.toString().includes("Local-only app"));
