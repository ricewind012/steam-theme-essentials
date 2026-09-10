import {
	definePlugin,
	EUIMode,
	IconsModule,
	Millennium,
	sleep,
} from "@steambrew/client";

import { SettingsPanel } from "@/components/settingspanel";
import { PLUGIN_PATH } from "@/consts";
import { pEssentialController } from "@/essentials/controller";
import { FindStringInObject } from "@/exposed";
import { CLogger } from "@/utils/log";

const g_pLogger = new CLogger("index");

Millennium.exposeObj({ FindStringInObject });

/**
 * Replacement function to avoid JSON modules because of localization - it's
 * easier to just create 1 file instead of doing the same thing, then typing an
 * import somewhere here, checking if it works, and so on.
 */
const ImportJSON = async (path: string) =>
	(await fetch(`${PLUGIN_PATH}/${path}`)).json();

async function InitLocalization() {
	const lang = await SteamClient.Settings.GetCurrentLanguage();
	const tokens = await ImportJSON(`locales/${lang}.json`).catch(() => {
		g_pLogger.Warn("No %o locale, reverting to English", lang);
		return ImportJSON(`locales/english.json`);
	});

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
