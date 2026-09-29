import {
	type EResult,
	findModuleExport,
	type Note,
	type SteamAppOverview,
} from "millennium";

import { FindModuleExportByString } from "@/utils/shared";

interface GameNotesCloudStore {
	DirectoryForNoteImages(overview: SteamAppOverview): string;
	GetGameNotesList(overview: SteamAppOverview): Promise<Note[]>;
	NewNote(overview: SteamAppOverview, title: string): Note;
	QueueNotesSync(): void;
	ResolveImageURL(param0: string): string;
	SaveGameNotes(overview: SteamAppOverview, json: string): Promise<EResult>;
	SyncFromServer(): Promise<void>;
	UploadImage(e: string, t: any): any;
	WriteNotesFile(filenameForNotes: string, notes: string): Promise<EResult>;
}

const CGameNotesCloudStore = FindModuleExportByString("InternalLoadNotes");

export const GameNotesCloudStore: GameNotesCloudStore =
	CGameNotesCloudStore.Get();

// lmao
interface GameNotesPopupStore {
	/**
	 * Opens the game notes popup.
	 * @param noteid Use to open a specific note.
	 */
	ShowGameNotesPopup(
		overview: SteamAppOverview,
		display_name: string,
		noteid?: string,
	): void;
}

export const GameNotesPopupStore: GameNotesPopupStore = findModuleExport(
	(e) => e.ShowGameNotesPopup,
);
