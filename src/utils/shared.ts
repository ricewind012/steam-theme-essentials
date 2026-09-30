import {
	type ClassModule,
	findClassModule,
	findModuleExport,
	Millennium,
	type Module,
} from "millennium";

/**
 * @returns `PP7LM0Ow1K5qkR8WElLpt contextMenu` -> `PP7LM0Ow1K5qkR8WElLpt`
 */
function GetClassNameWithoutResident(className: string) {
	const nSpaceIdx = className.indexOf(" ");
	const bHasResident = nSpaceIdx !== -1;
	return bHasResident ? className.slice(0, nSpaceIdx) : className;
}

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

export const FindModuleExportByString = (s: string) =>
	findModuleExport((e) => e.toString?.().includes(s));

export const GetUnixTime = () => Math.floor(Date.now() / 1_000);

export const LocalizeRtime32ToShortDate = (dt: number) =>
	new Date(dt * 1000).toLocaleDateString();

export const RandomArrayElement = <T>(vec: T[]) =>
	vec[Math.floor(Math.random() * vec.length)];

export const WaitForElement = async (sel: string, parent = document) =>
	[...(await Millennium.findElement(parent, sel))][0];
