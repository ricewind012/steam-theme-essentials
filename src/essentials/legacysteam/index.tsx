import { CThemeEssentialBase } from "@/essentials/base";
import { bind } from "@/utils/bind";
import { AddPopupCreatedCallback, type Unsubscribable } from "@/utils/popup";
import type { SteamPopup_t } from "@/utils/shared";

import { Events } from "./events";
import * as parts from "./parts";

const k_strCSSPropName = "--steamdesktopoverlay--game-name";

export class CLegacySteamEssential extends CThemeEssentialBase {
	private m_hPlaytimeInterval: number;
	private m_pOverlayPopup: SteamPopup_t;
	private m_unAppID: number;
	private m_vecPopupCallbacks: Unsubscribable[] = [];

	constructor() {
		super({
			fnFilter: (popup) => {
				if (!popup.m_strName.startsWith("desktopoverlay_")) {
					return false;
				}

				this.m_pOverlayPopup = popup;
				this.m_unAppID = popup.browser_info.m_unAppID;
				return true;
			},
			strName: "legacysteam",
			vecParts: [
				{
					component: <parts.OverlayInfo />,
					// componentClassName: "Container",
					// steamComponent: "gamelistbar",
					componentClassName: "ToolbarContainer",
					steamComponent: "steamdesktopoverlay",
				},
				{
					component: <parts.TimeStats />,
					componentClassName: "TimeStats",
					steamComponent: "steamdesktopoverlay",
				},
			],
		});
	}

	OnDismount() {
		super.OnDismount();
		for (const handle of this.m_vecPopupCallbacks) {
			handle.Unregister();
		}

		const popup = this.m_pOverlayPopup;
		if (!popup) {
			return;
		}

		const doc = popup.window.document;
		doc.documentElement.style.removeProperty(k_strCSSPropName);

		// RegisterForAppPlaytime
		clearInterval(this.m_hPlaytimeInterval);
	}

	OnMount() {
		this.m_vecPopupCallbacks = [
			AddPopupCreatedCallback(this.m_fnFilter, super.RenderParts),
			AddPopupCreatedCallback(this.m_fnFilter, this.RegisterForAppPlaytime),
		];

		const popup = this.m_pOverlayPopup;
		if (!popup) {
			return;
		}

		const doc = popup.window.document;
		const overview = appStore.GetAppOverviewByAppID(this.m_unAppID);
		doc.documentElement.style.setProperty(
			k_strCSSPropName,
			`"${overview.display_name}"`,
		);
	}

	@bind
	private RegisterForAppPlaytime() {
		this.SetPlaytime();
		// It really doesn't have a registrar...
		this.m_hPlaytimeInterval = setInterval(this.SetPlaytime, 60_000);
	}

	@bind
	private async SetPlaytime() {
		const pPlaytime = await SteamClient.Apps.GetPlaytime(this.m_unAppID);
		Events.AppPlaytime.Dispatch({ pPlaytime });
	}
}
