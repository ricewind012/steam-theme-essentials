import type { Screenshot } from "@steambrew/client";
import type { FC } from "react";

import { FindModuleExportByString } from "@/utils/shared";

export function ToClickableScreenshot(scr: Screenshot) {
	return {
		bUploaded: scr.bUploaded,
		id: GetScreenshotID(scr),
		local: scr,
		nHeight: scr.nHeight,
		nWidth: scr.nWidth,
		rtCreated: scr.nCreated,
		strGameID: scr.strGameID,
		strShortcutName: scr.strShortcutName,
		strUrl: ToAbsoluteURL(scr.strUrl),
		type: "screenshot",
	};
}

function ToAbsoluteURL(url: string) {
	if (url.startsWith("https://")) {
		return url;
	} else {
		return `https://steamloopback.host/${url}`;
	}
}

function GetScreenshotID(scr: Screenshot) {
	if (scr.bUploaded && scr.ugcHandle) {
		return scr.ugcHandle;
	} else {
		return MakeScreenshotID(scr);
	}
}

function MakeScreenshotID(e: Screenshot) {
	return `${e.strGameID}_${e.hHandle}`;
}

interface ClickableScreenshotProps {
	className?: string;
	onClick?: () => void;
	screenshot: ReturnType<typeof ToClickableScreenshot>;
	sizeAxis?: "width";
}

export const ClickableScreenshot: FC<ClickableScreenshotProps> =
	FindModuleExportByString("ClickableScreenshotImg");
