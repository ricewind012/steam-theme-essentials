import {
	type ClassModule,
	findClassModule,
	findModuleExport,
	Millennium,
} from "@steambrew/client";

export type CMsgHotkey_t = any;
export type SteamPopup_t = any;

export const classes = {
	appactionbutton: findClassModule(
		(e) => e.StreamingContextMenuItem,
	) as ClassModule,
	gamelistbar: findClassModule((e) => e.GameListHomeAndSearch) as ClassModule,
	gamelistdropdown: findClassModule((e) => e.ScrollToTop) as ClassModule,
	jumplist: findClassModule((e) => e.JumpListItemText) as ClassModule,
	keycapture: findClassModule(
		(e) => e.Capturing && !e.RecommendedNote,
	) as ClassModule,
	menu: findClassModule((e) => e.MenuWrapper) as ClassModule,
	steamdesktop: findClassModule((e) => e.FocusBar) as ClassModule,
	steamdesktopoverlay: findClassModule(
		(e) => e.OverlayPopup && !e.BackgroundRecording,
	) as ClassModule,
	supernav: findClassModule((e) => e.SuperNav) as ClassModule,
	titlebarcontrols: findClassModule((e) => e.BranchBar) as ClassModule,
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
