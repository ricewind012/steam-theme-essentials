import { CEssentialEvent } from "@/essentials/event";

type ClientTabSetting_t =
	| "store"
	| "news"
	| "library"
	| "community"
	| "friendactivity"
	| "profile"
	| "console";

export enum ESuperNavTab {
	Store,
	Library,
	Community,
	Profile,
	Console,
	Max,
}

export interface GameListChangeEvent {
	appid: number;
}

export interface TabChangeEvent {
	tab: ESuperNavTab;
}

export const Events = {
	GameList: new CEssentialEvent<GameListChangeEvent>(
		window,
		"game-list-change",
	),
	Tab: new CEssentialEvent<TabChangeEvent>(window, "tab-change"),
};

export function GetESuperNavTabFromSetting(tab: ClientTabSetting_t) {
	switch (tab) {
		case "store":
		case "news":
			return ESuperNavTab.Store;
		case "library":
			return ESuperNavTab.Library;
		case "community":
		case "friendactivity":
			return ESuperNavTab.Community;
		case "profile":
			return ESuperNavTab.Profile;
		case "console":
			return ESuperNavTab.Console;
	}
}
