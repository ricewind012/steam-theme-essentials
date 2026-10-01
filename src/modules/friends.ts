/** biome-ignore-all lint/suspicious/noExplicitAny: Intentional */

import { type BrowserContext, findModuleByExport } from "millennium";
import type {
	FC,
	HTMLAttributes,
	ReactElement,
	ReactNode,
	RefObject,
} from "react";

import type { CPlayer } from "@/utils/steamtypes";

export enum EPersonaState {
	Offline,
	Online,
	Busy,
	Away,
	Snooze,
	LookingToTrade,
	LookingToPlay,
	Invisible,
	Max,
}

const mod = findModuleByExport((e) =>
	e.toString().includes('className:"VoiceIconCtn"'),
);

interface FriendsListEntryProps {
	action?: <T extends Event>(friend: CPlayer, ev: T) => void;
	avatarSize?:
		| "X-Small"
		| "Small"
		| "Medium"
		| "MediumLarge"
		| "Large"
		| "X-Large"
		| "FillArea";
	browserContext?: BrowserContext;
	bForcePersonaNameDisplay?: boolean;
	bFriendsListEntry?: boolean;
	bHideEnhancedRichPresenceLabel?: boolean;
	bHideGameName?: boolean;
	bHidePersona?: boolean;
	bHideSnooze?: boolean;
	bHideStatus?: boolean;
	bHideStatusInfo?: boolean;
	bInGameIcon?: boolean;
	bInGroup?: boolean;
	bInOverlay?: boolean;
	bInVoiceList?: boolean;
	bSingleClickActivate?: boolean;
	children?: ReactNode;
	className?: string;
	context?: any;
	disableContextMenu?: boolean;
	divRef?: RefObject<HTMLElement>;
	friend: CPlayer;
	gamepadEventOverrides?: HTMLAttributes<HTMLElement>;
	lastChat?: any;
	listStatusIndicator?: any;
	listStatusIndicatorLeft?: any;
	noActions?: any;
	notDraggable?: boolean;
	showVoiceLevel?: boolean;
	statusPosition?: any;
	video?: any;
}

// mobx-react's @observer memoizes components, but it's the only one here
export const FriendsListEntry = Object.values<ReactElement>(mod).find(
	(e) => e.type,
) as unknown as FC<FriendsListEntryProps>;
