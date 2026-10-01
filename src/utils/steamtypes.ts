/** biome-ignore-all lint/suspicious/noExplicitAny: Intentional */
/** biome-ignore-all lint/style/useNamingConvention: Intentional */

import type {
	SteamAppOverview,
	SteamAppOverviewRemoteClientData,
} from "millennium";

export type CMsgHotkey = any;
export type ContentDescriptor = any;
export type CPlayer = any;
export type IAppOverview = SteamAppOverview & {
	BIsPerClientDataLocal(client: SteamAppOverviewRemoteClientData): boolean;
};
export type SteamPopup = any;
export type SteamUIWindowInstance = any;
// The def is broken lol
export const SteamClientURL = SteamClient.URL as {
	ExecuteSteamURL(url: string): void;
};
