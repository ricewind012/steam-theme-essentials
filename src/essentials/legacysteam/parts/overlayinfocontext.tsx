import type { BrowserContext } from "millennium";
import { createContext } from "react";

export interface OverlayInfoContext {
	pBrowser: BrowserContext;
	pInstance: any;
}

export const OverlayInfoContext = createContext<OverlayInfoContext>(null);
