import { findModuleExport } from "@steambrew/client";
import type { Context } from "react";

import { FindModuleExportByString } from "@/utils/shared";

/**
 * Global configuration constants.
 * Populated by GetWebUIConfig on websites.
 * Library fills most fields: some in the URL passed from newlibrarypage.cpp, some in CURLStore.Init,
 * and some in SteamLibrary.InitConfig directly. Some it skips - be sure to test.
 */
export const Config = findModuleExport((e) => typeof e.PLATFORM === "string");

/**
 * Makes some Steam components shut the fuck up in console
 */
export const ConfigContext: Context<typeof Config> = FindModuleExportByString(
	"useMemo(()=>({IN_GAMEPADUI",
);

enum ELauncherType {
	Default,
	PerfectWorld,
	Nexon,
	CmdLine,
	CSGO,
	ClientUI,
	Headless,
	SteamChina,
	SingleApp,
	Max,
}

//
// Returns whether the specified launchr type is a "china launcher" for the purposes of
// features like anti addiction. This includes steam china, the steam china government review
// launcher, and the pw csgo and pw dota2 launchers.
//
export function BIsChinaLauncher(eLauncherType: ELauncherType) {
	switch (eLauncherType) {
		case ELauncherType.CSGO:
		case ELauncherType.PerfectWorld:
		case ELauncherType.SteamChina:
		case ELauncherType.SingleApp:
			return true;
		default:
			return false;
	}
}
