/** biome-ignore-all lint/suspicious/noExplicitAny: Intentional */
/** biome-ignore-all lint/style/useNamingConvention: Intentional */

import type {
	SteamAppOverview,
	SteamAppOverviewRemoteClientData,
} from "millennium";

import type { URL } from "../../.millennium/lsp/ts/sharedjscontext/globals/steam-client/URL";

export type CMsgHotkey = any;
export type ContentDescriptor = any;
export type CPlayer = any;
export type IAppOverview = SteamAppOverview & {
	BIsPerClientDataLocal(client: SteamAppOverviewRemoteClientData): boolean;
};
export type SteamPopup = any;
export type SteamUIWindowInstance = any;
// The def is broken lol
export const SteamClientURL = SteamClient.URL as URL;
export interface Unsubscribable {
	Unregister(): void;
}
