import type { FC } from "react";

import { FindModuleExportByString } from "@/utils/shared";

interface AchievementIconBaseProps {
	alt: string;
	className?: string;
	glow: boolean;
	hidden?: boolean;
	imgURL: string;
	pauseAnimation: boolean;
}

export const AchievementIconBase: FC<AchievementIconBaseProps> =
	FindModuleExportByString("AchievementIconWrapper");
