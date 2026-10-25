import { type ClassModule, findClassModule, type Module } from "millennium";

function FindClassModuleWithoutResident(filter: (mod: Module) => boolean) {
	const mod = findClassModule(filter);
	if (!mod) {
		return;
	}

	const result: ClassModule = {};
	for (const [k, v] of Object.entries(mod)) {
		result[k] = GetClassNameWithoutResident(v);
	}

	return result;
}

/**
 * @returns `PP7LM0Ow1K5qkR8WElLpt contextMenu` -> `PP7LM0Ow1K5qkR8WElLpt`
 */
function GetClassNameWithoutResident(className: string) {
	const nSpaceIdx = className.indexOf(" ");
	const bHasResident = nSpaceIdx !== -1;
	return bHasResident ? className.slice(0, nSpaceIdx) : className;
}

export const classes = {
	appactionbutton: FindClassModuleWithoutResident(
		(e) => e.StreamingContextMenuItem,
	),
	gamelistbar: FindClassModuleWithoutResident((e) => e.GameListHomeAndSearch),
	gamelistdropdown: FindClassModuleWithoutResident((e) => e.ScrollToTop),
	jumplist: FindClassModuleWithoutResident((e) => e.JumpListItemText),
	keycapture: FindClassModuleWithoutResident(
		(e) => e.Capturing && !e.RecommendedNote,
	),
	menu: FindClassModuleWithoutResident((e) => e.MenuWrapper),
	steamdesktop: FindClassModuleWithoutResident((e) => e.FocusBar),
	steamdesktopoverlay: FindClassModuleWithoutResident(
		(e) => e.OverlayPopup && !e.BackgroundRecording,
	),
	supernav: FindClassModuleWithoutResident((e) => e.SuperNav),
	titlebarcontrols: FindClassModuleWithoutResident((e) => e.BranchBar),
};
