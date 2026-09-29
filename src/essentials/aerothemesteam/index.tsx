import { CThemeEssentialBase } from "@/essentials/base";
import { bind } from "@/utils/bind";
import { AddPopupCreatedCallback, type Unsubscribable } from "@/utils/popup";
import { classes, WaitForElement } from "@/utils/shared";
import type { SteamPopup_t } from "@/utils/steamtypes";

import { Events } from "./events";
import * as parts from "./parts";

const k_strCSSPropIcon = "--library_game-icon";
const k_strCSSPropName = "--library_game-name";

const g_strMainWindowTitle = LocalizationManager.LocalizeString(
	"#WindowName_SteamDesktop",
);

export class CAeroThemeEssential extends CThemeEssentialBase {
	private m_elThemeFieldsStyle: HTMLStyleElement;
	private m_pMainWindowPopup: SteamPopup_t;
	private m_pOrigSetGameListSelection: (
		section: string,
		appid: number,
	) => Promise<void>;
	private m_pSuperNavObserver: MutationObserver;
	private m_vecPopupCallbacks: Unsubscribable[] = [];

	constructor() {
		super({
			fnFilter: (popup) => {
				if (popup.m_strTitle !== g_strMainWindowTitle) {
					return false;
				}

				this.m_pMainWindowPopup = popup;
				return true;
			},
			strName: "aerothemesteam",
			vecParts: [
				{
					component: <parts.GameListBar />,
					componentClassName: "Container",
					steamComponent: "gamelistbar",
				},
				{
					component: <parts.SteamDesktop />,
					componentClassName: "OuterFrame",
					steamComponent: "steamdesktop",
				},
				{
					component: <parts.SuperNav />,
					componentClassName: "SuperNav",
					steamComponent: "supernav",
				},
				{
					component: <parts.TitleBarControls />,
					componentClassName: "TitleBarControls",
					steamComponent: "titlebarcontrols",
				},
			],
		});
	}

	OnDismount() {
		super.OnDismount();
		for (const handle of this.m_vecPopupCallbacks) {
			handle.Unregister();
		}

		// AddSuperNavEvents
		this.m_pSuperNavObserver.disconnect();

		// AddThemeFieldVars
		this.m_elThemeFieldsStyle.remove();

		// PatchUIStore
		uiStore.SetGameListSelection = this.m_pOrigSetGameListSelection;

		const doc: HTMLElement =
			this.m_pMainWindowPopup.m_popup.document.documentElement;
		doc.style.removeProperty(k_strCSSPropIcon);
		doc.style.removeProperty(k_strCSSPropName);
	}

	OnMount() {
		this.m_vecPopupCallbacks = [
			AddPopupCreatedCallback(this.m_fnFilter, super.RenderParts),
			AddPopupCreatedCallback(this.m_fnFilter, this.PatchUIStore),
			AddPopupCreatedCallback(this.m_fnFilter, this.AddSuperNavEvents),
			AddPopupCreatedCallback(this.m_fnFilter, this.AddThemeFieldVars),
		];
	}

	/**
	 * Watches for supernav's active tab changes.
	 */
	@bind
	async AddSuperNavEvents(popup: SteamPopup_t) {
		const doc = popup.m_popup.document;
		const container = await WaitForElement(
			`.${classes.supernav.SuperNav}`,
			doc,
		);
		const sel = classes.supernav.Selected;
		const observer = new MutationObserver(() => {
			const children = [...container.children];
			const tab = children.findIndex((e) => e.classList.contains(sel));

			// Account for the browser navigation arrows
			Events.Tab.Dispatch({ tab: tab - 2 });
		});

		this.m_pSuperNavObserver = observer;
		observer.observe(container, {
			attributeFilter: ["class"],
			attributes: true,
			subtree: true,
		});
	}

	/**
	 * Adds theme preview image vars for Millennium theme fields.
	 */
	@bind
	async AddThemeFieldVars(popup: SteamPopup_t) {
		// No API for finding themes yet? so use the internal API instead
		// biome-ignore lint/complexity/useLiteralKeys: required here
		const themes = await globalThis["Millennium"].callServerMethod(
			"core",
			"Core_FindAllThemes",
		);
		const css = [];
		for (const { data, native } of JSON.parse(themes)) {
			const img = data.splash_image;
			if (!img) {
				continue;
			}

			const match = img.match(
				/^https:\/\/raw\.githubusercontent\.com\/([\w-]+\/){3}/,
			);
			const url = (() => {
				// Use the local file instead
				if (match) {
					const [part] = match;
					const path = img.slice(part.length);
					return `https://millennium.host/v1/themes/${native}/${path}`;
				} else {
					return img;
				}
			})();
			css.push(`
				.MillenniumThemes_ThemeItem[data-theme-folder-name-on-disk="${native}"] {
					--img: url("${url}");
				}
			`);
		}

		const style = Object.assign(document.createElement("style"), {
			textContent: css.join("\n"),
		});
		this.m_elThemeFieldsStyle = style;
		popup.m_popup.document.head.appendChild(style);
	}

	/**
	 * Intercepts the function that's called upon a selected game change in the
	 * library.
	 */
	@bind
	PatchUIStore(popup: SteamPopup_t) {
		const store = uiStore;
		const orig = store.SetGameListSelection;
		const doc = popup.m_popup.document.documentElement;

		this.m_pOrigSetGameListSelection = orig;
		store.SetGameListSelection = async function (
			section: string,
			appid: number,
		) {
			if (!appid) {
				Events.GameList.Dispatch({ appid: -1 });
				return;
			}

			const app = appStore.GetAppOverviewByAppID(appid);
			const iconFilePath = urlStore.BuildCachedLibraryAssetURL(
				appid,
				`${app.icon_hash}.jpg`,
			);
			const url = app.icon_data
				? `data:image/${app.icon_data_format};base64,${app.icon_data}`
				: iconFilePath;

			Events.GameList.Dispatch({ appid });
			doc.style.setProperty(
				k_strCSSPropIcon,
				`url("https://steamloopback.host${url}")`,
			);
			doc.style.setProperty(k_strCSSPropName, `"${app.display_name}"`);

			return orig.call(this, section, appid);
		};
	}
}
