export type EssentialName_t = keyof Settings_t;
export type Settings_t = typeof DEFAULT_SETTINGS;

export const DEFAULT_SETTINGS = {
	aerothemesteam: {
		bEnabled: true,
	},
	legacysteam: {
		bEnabled: true,
	},
};
