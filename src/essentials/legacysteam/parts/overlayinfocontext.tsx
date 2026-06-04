import type { BrowserContext } from "@steambrew/client";
import { createContext } from "react";

export interface OverlayInfoContext {
	pBrowser: BrowserContext;
	pInstance: any;
}

export const OverlayInfoContext = createContext<OverlayInfoContext>(null);
