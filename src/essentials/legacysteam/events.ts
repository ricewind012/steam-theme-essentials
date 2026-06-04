import type { Playtime } from "@steambrew/client";

import { CEssentialEvent } from "@/essentials/event";

interface AppPlaytimeEvent {
	pPlaytime: Playtime;
}

export const Events = {
	AppPlaytime: new CEssentialEvent<AppPlaytimeEvent>(window, "app-playtime"),
};
