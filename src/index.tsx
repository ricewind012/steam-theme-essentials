import { definePlugin, EUIMode, IconsModule, sleep } from "millennium";

import { SettingsPanel } from "@/components/settingspanel";
import { PLUGIN_PATH } from "@/consts";
import { pEssentialController } from "@/essentials/controller";
import { CLogger } from "@/utils/log";

const g_pLogger = new CLogger("index");

/**
 * Replacement function to avoid JSON modules because of localization - it's
 * easier to just create 1 file instead of doing the same thing, then typing an
 * import somewhere here, checking if it works, and so on.
 */
const ImportJSON = async (path: string) =>
	(await fetch(`${PLUGIN_PATH}/${path}`)).json();

async function InitLocalization() {
	const lang = await SteamClient.Settings.GetCurrentLanguage();
	// const tokens = await ImportJSON(`locales/${lang}.json`).catch(() => {
	// 	g_pLogger.Warn("No %o locale, reverting to English", lang);
	// 	return ImportJSON(`locales/english.json`);
	// });

	LocalizationManager.AddTokens({
		Essential_GameListBar_NoFilters: "No filters",
		Essential_GameListBar_OnlyLinux: "Showing only Linux-ready games",
		Essential_GameListBar_OnlyLinuxAndInstalled:
			"Showing installed Linux-ready games",
		Essential_GameListBar_OnlyReadyToPlay: "Showing only Ready to Play games",
		Essential_GameListBar_SortRecentActivity:
			"Sorting games by recent activity",
		Essential_GameListBar_SortRecentActivityOnLinux:
			"Sorting games by recent activity that run on Linux",
		Essential_GameListBar_SortRecentActivityOnLinuxAndReadyToPlay:
			"Sorting games by recent activity that run on Linux and are Ready to Play",
		Essential_GameListBar_SortRecentActivityReadyToPlay:
			"Sorting games by recent activity that are Ready to Play",

		Essential_OverlayPanel_Achievements_Description:
			"You've earned %1$s out of %2$s achievements <1>(%1$s%)</1>",
		Essential_OverlayPanel_Achievements_FooterButton: "View all achievements",
		Essential_OverlayPanel_Achievements_Header: "Achievements",

		Essential_OverlayPanel_Friends_Description: "You have %1$s friends online",
		Essential_OverlayPanel_Friends_Description_SignedOut:
			"Signed out of Friends & Chat",
		Essential_OverlayPanel_Friends_FooterButton: "View all friends",
		Essential_OverlayPanel_Friends_Header: "Friends",

		Essential_OverlayPanel_Guides_Description: "%1$s guide savailable",
		Essential_OverlayPanel_Guides_FooterButton: "View all guides",
		Essential_OverlayPanel_Guides_Header: "Guides",

		Essential_OverlayPanel_News_Description: "News and updates for %1$s",
		Essential_OverlayPanel_News_FooterButton: "View all news",
		Essential_OverlayPanel_News_Header: "News",

		Essential_OverlayPanel_Notes_Description: "%1$s notes taken",
		Essential_OverlayPanel_Notes_FooterButton: "View all notes",
		Essential_OverlayPanel_Notes_FooterButton_2: "New note",
		Essential_OverlayPanel_Notes_Header: "Notes",

		Essential_OverlayPanel_OfflineModeInfo:
			"This feature is not available in offline mode",

		Essential_OverlayPanel_Screenshots_Description:
			"Press %1$s while in-game to take a screenshot",
		Essential_OverlayPanel_Screenshots_FooterButton: "View all screenshots",
		Essential_OverlayPanel_Screenshots_FooterButton_2: "Set shortcut",
		Essential_OverlayPanel_Screenshots_Header: "Screenshots",

		Essential_RibbonButton_NavBack: "Go back",
		Essential_RibbonButton_NavForward: "Go forward",
		Essential_RibbonButton_Reload: "Reload",
		Essential_RibbonSection_Account: "Account",
		Essential_RibbonSection_Browser: "Browser",
		Essential_RibbonSection_Game: "Game",
		Essential_RibbonSection_Links: "Links",

		Essential_TimeStats_CurrentSession: "%1$s - current session",
		Essential_TimeStats_PlaytimeForever: "%1$s - total",
		Essential_TimeStats_PlaytimeLastTwoWeeks: "%1$s - past two weeks",

		EssentialSettings_aerothemesteam: "MS Office 2007 Theme",
		EssentialSettings_aerothemesteam_bEnabled: "Enable",

		EssentialSettings_legacysteam: "Legacy Steam",
		EssentialSettings_legacysteam_bEnabled: "Enable",
	});
}

function OnUIModeChange(mode: EUIMode) {
	if (mode === EUIMode.GamePad) {
		g_pLogger.Log("Running in gamepad mode, bye");
		return;
	}

	for (const handle of pEssentialController.GetActive()) {
		handle.OnMount();
	}
}

export default definePlugin(async () => {
	await InitLocalization();
	// Wait until services load to prevent early access to modal manager
	await App.WaitForServicesInitialized();
	// TODO: shitty workaround for millennium ui rerender
	await sleep(1_000);

	const vecRegistrars = [
		SteamClient.UI.RegisterForUIModeChanged(OnUIModeChange),
	];

	function onDismount() {
		for (const handle of vecRegistrars) {
			handle.unregister();
		}

		for (const handle of pEssentialController.GetActive()) {
			handle.OnDismount();
		}
	}

	return {
		content: <SettingsPanel />,
		icon: <IconsModule.SingleWindowToggle />,
		onDismount,
		title: "Theme Essentials",
	};
});
