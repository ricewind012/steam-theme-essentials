import { findModuleExport } from "millennium";
import type { FC, PropsWithChildren } from "react";

interface MenuGroupProps extends PropsWithChildren {
	label: string;
	disabled?: boolean;
}

export const MenuGroup: FC<MenuGroupProps> = findModuleExport((e) =>
	e.toString().match(/...[\w$]+,bInGamepadUI:/),
);
