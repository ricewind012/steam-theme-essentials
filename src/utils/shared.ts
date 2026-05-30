import {
	type ClassModule,
	findClassModule,
	findModuleExport,
	Millennium,
} from "@steambrew/client";

export type SteamPopup_t = any;

export const classes = {
	appactionbutton: findClassModule(
		(e) => e.StreamingContextMenuItem,
	) as ClassModule,
	gamelistbar: findClassModule((e) => e.GameListHomeAndSearch) as ClassModule,
	gamelistdropdown: findClassModule((e) => e.ScrollToTop) as ClassModule,
	jumplist: findClassModule((e) => e.JumpListItemText) as ClassModule,
	menu: findClassModule((e) => e.MenuWrapper) as ClassModule,
	steamdesktop: findClassModule((e) => e.FocusBar) as ClassModule,
	supernav: findClassModule((e) => e.SuperNav) as ClassModule,
	titlebarcontrols: findClassModule((e) => e.BranchBar) as ClassModule,
};

export const FindModuleExportByString = (s: string) =>
	findModuleExport((e) => e.toString?.().includes(s));

export const WaitForElement = async (sel: string, parent = document) =>
	[...(await Millennium.findElement(parent, sel))][0];
