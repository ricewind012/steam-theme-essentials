import { ErrorBoundary } from "@steambrew/client";
import type { ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

import { type EssentialName_t, GetSettings } from "@/settings";
import { bind } from "@/utils/bind";
import { CLogger } from "@/utils/log";
import { classes, type SteamPopup_t, WaitForElement } from "@/utils/shared";

import { pLoadedEssentials } from "./loadedtracker";

interface HTMLEssentialPartElement extends HTMLDivElement {
	dataset: {
		name: EssentialName_t;
		part: keyof typeof classes;
	};
}

interface EssentialConstructor {
	/**
	 * Filter for whether to use this popup or not.
	 */
	fnFilter: (popup: SteamPopup_t) => boolean;

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
}

const g_pLogger = new CLogger("essentials/base");

export abstract class CThemeEssentialBase {
	private readonly m_bEnabled: boolean;
	protected readonly m_fnFilter: (popup: SteamPopup_t) => boolean;
	private readonly m_setPartHandles = new Set<EssentialPartHandle>();
	private readonly m_strName: EssentialName_t;
	private readonly m_vecParts: EssentialPart[];

	constructor({ fnFilter, strName, vecParts }: EssentialConstructor) {
		const pSettings = GetSettings();
		this.m_bEnabled = pSettings[strName].bEnabled;

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
		for (const handle of this.m_setPartHandles) {
			this.m_setPartHandles.delete(handle);
			const { div, root } = handle;
			div.remove();
			root.unmount();

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
	protected RenderParts(popup: SteamPopup_t) {
		const doc: Document = popup.window.document;
		for (const part of this.m_vecParts) {
			const { steamComponent, componentClassName, component } = part;
			const className = classes[steamComponent][componentClassName];
			WaitForElement(`.${className}`, doc).then((el) => {
				const div = doc.createElement("div") as HTMLEssentialPartElement;
				div.className = "ThemeEssentialPart";
				div.dataset.name = this.m_strName;
				div.dataset.part = steamComponent;
				// Initially hidden if not themed by anything
				div.style.display = "none";
				el.appendChild(div);

				pLoadedEssentials.Add(doc, this.m_strName);
				const root = createRoot(div, {
					// ..but let the errors be seen
					onCaughtError() {
						div.style.display = "block";
						pLoadedEssentials.StopTracking(doc);
					},
				});
				root.render(<ErrorBoundary>{component}</ErrorBoundary>);
				this.m_setPartHandles.add({ div, root });

				g_pLogger.Log("%s(%s): rendered", this.m_strName, steamComponent);
			});
		}
	}
}
