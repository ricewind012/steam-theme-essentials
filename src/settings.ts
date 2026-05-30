import { PLUGIN_NAME } from "@/consts";

export type EssentialName_t = keyof Settings_t;
export type Settings_t = typeof DEFAULT_SETTINGS;

const SETTINGS_KEY = `${PLUGIN_NAME}-settings`;
const DEFAULT_SETTINGS = {
	aerothemesteam: {
		bEnabled: true,
	},
};

let g_pSettings: Settings_t = null;

export function GetSettings() {
	if (!g_pSettings) {
		SaveToGlobal();
	}

	return Object.assign(DEFAULT_SETTINGS, g_pSettings);
}

export function ResetSettings() {
	localStorage.removeItem(SETTINGS_KEY);
}

/**
 * Cache settings to a global so I don't read localStorage all the time.
 */
function SaveToGlobal() {
	g_pSettings =
		JSON.parse(localStorage.getItem(SETTINGS_KEY)) || DEFAULT_SETTINGS;
}

export function SetSettingsKey<
	F extends keyof Settings_t,
	K extends keyof Settings_t[F],
>(field: F, key: K, value: Settings_t[F][K]) {
	const pSettings = GetSettings();
	pSettings[field][key] = value;
	g_pSettings = pSettings;

	localStorage.setItem(SETTINGS_KEY, JSON.stringify(pSettings));
}

export function RemoveSettingsKey<F extends keyof Settings_t>(
	field: F,
	key: keyof Settings_t[F],
) {
	const pSettings = GetSettings();
	delete pSettings[field][key];
	g_pSettings = pSettings;

	localStorage.setItem(SETTINGS_KEY, JSON.stringify(pSettings));
}
