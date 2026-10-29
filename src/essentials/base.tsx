import {
	afterPatch,
	ErrorBoundary,
	type Patch,
	pluginConfig,
} from "millennium";
import { Component, type PropsWithChildren, type ReactNode } from "react";

import { Config } from "@/modules/config";
import type { EssentialName_t } from "@/settings";
import { bind } from "@/utils/bind";
import { classes } from "@/utils/css";
import { CLogger } from "@/utils/log";
import { FindInReactTree, type ReactFiber } from "@/utils/reacttree";
import type { SteamPopup } from "@/utils/steamtypes";

import { pLoadedEssentials } from "./loadedtracker";

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
	componentClassName: string;
	doc: Document;
	strName: EssentialName_t;
	patch: Patch;
	style: HTMLStyleElement;
}

const g_pLogger = new CLogger("essentials/base");

interface ContainedProps extends PropsWithChildren {
	/**
	 * The document to render to.
	 */
	doc: Document;

	/**
	 * The essential's name.
	 */
	strName: EssentialName_t;

	/**
	 * The part's name.
	 */
	part: string;
}

class Contained extends Component<ContainedProps> {
	componentDidCatch() {
		pLoadedEssentials.StopTracking(this.props.doc);
	}

	render() {
		const { strName, part, children } = this.props;
		return (
			<div className="ThemeEssentialPart" data-name={strName} data-part={part}>
				{children}
			</div>
		);
	}
}

export abstract class CThemeEssentialBase {
	private m_bEnabled: boolean;
	protected readonly m_fnFilter: (popup: SteamPopup) => boolean;
	private readonly m_setPartHandles = new Set<EssentialPartHandle>();
	private readonly m_strName: EssentialName_t;
	private readonly m_vecParts: EssentialPart[];

	constructor({ fnFilter, strName, vecParts }: EssentialConstructor) {
		if (Config.DEV_MODE) {
			this.m_bEnabled = true;
		} else {
			pluginConfig.get<boolean>(`${strName}-bEnabled`).then((bEnabled) => {
				this.m_bEnabled = bEnabled;
			});
		}
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
			const { componentClassName, doc, patch, strName, style } = handle;
			patch.unpatch();
			style.remove();

			pLoadedEssentials.Remove(doc, strName);
			g_pLogger.Log("%s(%s): goodbye", strName, componentClassName);
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
		/*
		backend.read_style(this.m_strName).then((e) => {
			style.id = `theme-essentials-${this.m_strName}`;
			style.textContent = e;
			doc.head.appendChild(style);
		});
*/

		for (const part of this.m_vecParts) {
			const { steamComponent, componentClassName, component } = part;
			const className = classes[steamComponent][componentClassName];
			const strName = this.m_strName;

			pLoadedEssentials.Add(doc, strName);
			let children = (
				<Contained doc={doc} strName={strName} part={componentClassName}>
					{component}
				</Contained>
			);
			if (Config.DEV_MODE) {
				children = <ErrorBoundary>{children}</ErrorBoundary>;
			}

			interface shit {
				patchFn: (ret: any) => void;
				treeFilter: (node: ReactFiber) => boolean;
			}
			const map: Partial<Record<keyof typeof classes, Record<string, shit>>> = {
				library: {
					LeftListSizableContainer: {
						patchFn: (ret) => {
							// Skip collections button tooltip, no idea why it's there lol
							if (!ret?.props?.children || ret.props.toolTipContent) {
								return ret;
							}

							ret.props.children = [ret?.props?.children, <div>asdf</div>];
						},
						treeFilter: (x) => {
							const classNameProp: string = x?.child?.pendingProps?.className;
							return classNameProp?.includes(className);
						},
					},
				},
				steamdesktopoverlay: {
					ToolbarMaxWidthContainer: {
						patchFn: (ret) => {
							g_pLogger.Log("ToolbarMaxWidthContainer", ret);
							const elContainer = ret?.props?.children?.props?.children;
							elContainer?.props?.children.push(children);
						},
						treeFilter: (x) => {
							const classNameProp: string = x?.pendingProps?.className;
							return classNameProp?.includes(className);
						},
					},
				},
			};

			const { patchFn, treeFilter } =
				map[steamComponent]?.[componentClassName] ?? {};
			if (!treeFilter || !patchFn) {
				g_pLogger.Warn("%s(%s): failed to find node", strName, steamComponent);
				continue;
			}

			const pNode = FindInReactTree(treeFilter);
			g_pLogger.Log("%s(%s): found node %o", strName, steamComponent, pNode);
			const patch = afterPatch(pNode, "type", (_args, ret) => {
				patchFn(ret);
				return ret;
			});

			this.m_setPartHandles.add({
				componentClassName,
				doc,
				patch,
				strName,
				style,
			});
			g_pLogger.Log("%s(%s): rendered", strName, steamComponent);
		}
	}
}
