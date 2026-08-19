import { findModuleExport } from "@steambrew/client";

export enum EParentalFeature {
	Invalid,
	Store,
	Community,
	Profile,
	Friends,
	News,
	Trading,
	Settings,
	Console,
	Browser,
	ParentalSetup,
	Library,
	Test,
	SiteLicense,
	KioskMode,
	Max,
}

interface ParentalFeaturesManager {
	BIsFeatureBlocked(feature: EParentalFeature): boolean;
}

export const CParentalFeaturesManager: ParentalFeaturesManager =
	findModuleExport((e) => e.GetFeatureBlockReason);
