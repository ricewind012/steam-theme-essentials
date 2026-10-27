import { ErrorBoundary, pluginConfig } from "millennium";
import type { ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

import { Config } from "@/modules/config";
import type { EssentialName_t } from "@/settings";
import { bind } from "@/utils/bind";
import { classes } from "@/utils/css";
import { CLogger } from "@/utils/log";
import { WaitForElement } from "@/utils/shared";
import type { SteamPopup } from "@/utils/steamtypes";

import { pLoadedEssentials } from "./loadedtracker";

interface HTMLEssentialPartElement extends HTMLDivElement {
	dataset: {
		name: EssentialName_t;
		part: string;
	};
}

interface EssentialConstructor {
	/**
	 * Filter for whether to use this popup or not.
	 */
	fnFilter: (popup: SteamPopup) => boolean;

	/**
	 * The essential's name.
	 */
	strName: EssentialName_t;

	/**
	 * The parts to render.
	 */
	vecParts: EssentialPart[];
}

interface EssentialPart {
	/**
	 * Steam component name whose class names are found in {@link classes}.
	 */
	steamComponent: keyof typeof classes;

	/**
	 * Steam component's class name to use for rendering the part.
	 */
	componentClassName: string;

	/**
	 * The component to render.
	 */
	component: ReactNode;
}

interface EssentialPartHandle {
	div: HTMLEssentialPartElement;
	root: Root;
	style: HTMLStyleElement;
}

const g_pLogger = new CLogger("essentials/base");

export abstract class CThemeEssentialBase {
	private m_bEnabled: boolean;
	protected readonly m_fnFilter: (popup: SteamPopup) => boolean;
	private readonly m_setPartHandles = new Set<EssentialPartHandle>();
	private readonly m_strName: EssentialName_t;
	private readonly m_vecParts: EssentialPart[];

	constructor({ fnFilter, strName, vecParts }: EssentialConstructor) {
		pluginConfig.get<boolean>(`${strName}-bEnabled`).then((bEnabled) => {
			this.m_bEnabled = bEnabled;
		});
		this.m_fnFilter = fnFilter;
		this.m_strName = strName;
		this.m_vecParts = vecParts;
	}

	IsEnabled() {
		return this.m_bEnabled;
	}

	/**
	 * Dispatched when it's disabled.
	 */
	OnDismount() {
		this.m_bEnabled = false;
		for (const handle of this.m_setPartHandles) {
			this.m_setPartHandles.delete(handle);
			const { div, root, style } = handle;
			div.remove();
			root.unmount();
			style.remove();

			const { name, part } = div.dataset;
			pLoadedEssentials.Remove(div.ownerDocument, name);
			g_pLogger.Log("%s(%s): goodbye", name, part);
		}
	}

	/**
	 * Dispatched when it's enabled.
	 */
	abstract OnMount(): void;

	/**
	 * @param popup The popup to render to.
	 */
	@bind
	protected RenderParts(popup: SteamPopup) {
		const doc: Document = popup.window.document;
		const style = doc.createElement("style");
		backend.read_style(this.m_strName).then((e) => {
			style.id = `theme-essentials-${this.m_strName}`;
			style.textContent = e;
			doc.head.appendChild(style);
		});

		for (const part of this.m_vecParts) {
			const { steamComponent, componentClassName, component } = part;
			const className = classes[steamComponent][componentClassName];
			WaitForElement(`.${className}`, doc).then((el) => {
				const div = doc.createElement("div") as HTMLEssentialPartElement;
				div.className = "ThemeEssentialPart";
				div.dataset.name = this.m_strName;
				div.dataset.part = componentClassName;
				el.appendChild(div);

				pLoadedEssentials.Add(doc, this.m_strName);
				const root = createRoot(div, {
					onCaughtError() {
						pLoadedEssentials.StopTracking(doc);
					},
				});
				const children = Config.DEV_MODE ? (
					component
				) : (
					<ErrorBoundary>{component}</ErrorBoundary>
				);
				root.render(children);
				this.m_setPartHandles.add({ div, root, style });

				g_pLogger.Log("%s(%s): rendered", this.m_strName, steamComponent);
			});
		}
	}
}
