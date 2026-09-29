import { definePlugin, EUIMode, IconsModule, sleep } from "millennium";

import { SettingsPanel } from "@/components/settingspanel";
import { pEssentialController } from "@/essentials/controller";
import { CLogger } from "@/utils/log";

const g_pLogger = new CLogger("index");

async function InitLocalization() {
	const lang = await SteamClient.Settings.GetCurrentLanguage();
	let tokens = await backend.read_locale(lang);
	if (!tokens) {
		g_pLogger.Warn("No %o locale, reverting to English", lang);
		tokens = await backend.read_locale("english");
	}

	LocalizationManager.AddTokens(tokens);
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
