import type { SteamAppOverview } from "millennium";
import type { FC } from "react";

import { FindModuleExportByString } from "@/utils/shared";

interface AppGameInfoProps {
	collapsible?: boolean;
	expand?: boolean;
	suppressTransition?: boolean;

	// content component props
	/** Compact info. */
	concise?: boolean;
	delayLoad?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: idk the type
	details: any;
	overview: SteamAppOverview;
}

export const AppGameInfo: FC<AppGameInfoProps> =
	FindModuleExportByString("gameInfoHeight");
