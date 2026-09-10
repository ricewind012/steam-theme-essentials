import { definePlugin, EUIMode, IconsModule, sleep } from "@steambrew/client";

import { SettingsPanel } from "@/components/settingspanel";
import { pEssentialController } from "@/essentials/controller";
import { CLogger } from "@/utils/log";

const g_pLogger = new CLogger("index");

window.a = backend;

async function InitLocalization() {
	const lang = await SteamClient.Settings.GetCurrentLanguage();
	/*
	const tokens = await ImportJSON(`locales/${lang}.json`).catch(() => {
		g_pLogger.Warn("No %o locale, reverting to English", lang);
		return ImportJSON(`locales/english.json`);
	});
	*/

	LocalizationManager.AddTokens({});
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
