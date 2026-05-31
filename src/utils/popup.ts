import type { SteamPopup_t } from "@/utils/shared";

export interface Unsubscribable {
	Unregister(): void;
}

/** Internal main window name. */
export const MAIN_WINDOW_NAME = "SP Desktop_uid0";

export function GetMainPopupWindow() {
	return g_PopupManager.GetExistingPopup(MAIN_WINDOW_NAME).window;
}

/**
 * Like `CPopupManager.AddPopupCreatedCallback`, but account for existing popups
 * and is specifically for popups that pass the given filter.
 */
export function AddPopupCreatedCallback(
	popupFilter: (popup: SteamPopup_t) => boolean,
	onCreated: (popup: SteamPopup_t) => void,
): Unsubscribable {
	for (const popup of g_PopupManager.GetPopups()) {
		if (popupFilter(popup)) {
			onCreated(popup);
			return { Unregister() {} };
		}
	}

	return g_PopupManager.AddPopupCreatedCallback((popup) => {
		if (!popupFilter(popup)) {
			return;
		}

		onCreated(popup);
	});
}
