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

// TODO: unused after the styling, maybe use after the achievement rework?
export const AchievementIconBase: FC<AchievementIconBaseProps> =
	FindModuleExportByString(".AchievementIconWrapper");
