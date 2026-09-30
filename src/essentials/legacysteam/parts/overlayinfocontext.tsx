import type { BrowserContext } from "millennium";
import { createContext } from "react";

import type { SteamUIWindowInstance } from "@/utils/steamtypes";

export interface OverlayInfoContext {
	pBrowser: BrowserContext;
	pInstance: SteamUIWindowInstance;
}

export const OverlayInfoContext = createContext<OverlayInfoContext>(null);
