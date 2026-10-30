import { afterPatch } from "millennium";
import type { ReactNode } from "react";

import type { classes } from "@/utils/css";
import type { ReactFiber } from "@/utils/reacttree";

interface ComponentInfo {
	bClassComponent: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: stfu
	patchFn: (ret: any) => void;
	treeFilter: (node: ReactFiber) => boolean;
}

export const map: (
	className: string,
	component: ReactNode,
) => Partial<Record<keyof typeof classes, Record<string, ComponentInfo>>> = (
	className,
	component,
) => ({
	library: {
		LeftListSizableContainer: {
			bClassComponent: true,
			patchFn: (ret) => {
				// Skip collections button tooltip and "What's New" section
				const { bHeaderClickScrollToFirst, children, toolTipContent } =
					ret?.props ?? {};
				if (bHeaderClickScrollToFirst || !children || toolTipContent) {
					return ret;
				}

				const elGameListBarContainer = children[0];
				if (!elGameListBarContainer) {
					return ret;
				}

				if (typeof elGameListBarContainer.type === "string") {
					console["warn"]({ ret });
					return ret;
				}

				afterPatch(elGameListBarContainer, "type", (_args, ret) => {
					ret.props.children.splice(3, 0, component);
					return ret;
				});

				return ret;
			},
			treeFilter: (x) => {
				const classNameProp: string = x?.child?.pendingProps?.className;
				return classNameProp?.includes(className);
			},
		},
	},
	steamdesktopoverlay: {
		ToolbarMaxWidthContainer: {
			bClassComponent: false,
			patchFn: (ret) => {
				const elContainer = ret?.props?.children?.props?.children;
				console["warn"]({ elContainer, ret });
				elContainer?.props?.children.push(component);
				return ret;
			},
			treeFilter: (x) => {
				const classNameProp: string = x?.pendingProps?.className ?? "";
				return classNameProp.includes(className);
			},
		},
	},
});
