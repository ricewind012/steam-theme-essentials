/** biome-ignore-all lint/suspicious/noExplicitAny: Intentional */
/** biome-ignore-all lint/style/useNamingConvention: Intentional */

export type CMsgHotkey = any;
export type CPlayer = any;
export type SteamPopup = any;
export type SteamUIWindowInstance = any;
// The def is broken lol
export const SteamClientURL = SteamClient.URL as {
	ExecuteSteamURL(url: string): void;
};
