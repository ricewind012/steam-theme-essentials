import { DialogButton, type Note } from "@steambrew/client";
import { useContext, useEffect, useState } from "react";

import {
	GameNotesCloudStore,
	GameNotesPopupStore,
} from "@/modules/gamenotesstore";
import { Localize } from "@/modules/localization";

import {
	k_nPanelEntriesCount,
	OverlayPanel,
} from "../../components/overlaypanel";
import { OverlayInfoContext } from "../overlayinfocontext";

function GameNote(props: { pNote: Note }) {
	const { pNote } = props;
	const onClick = () => {
		const pOverview = appStore.GetAppOverviewByAppID(pNote.appid);
		GameNotesPopupStore.ShowGameNotesPopup(
			pOverview,
			pOverview.display_name,
			pNote.id,
		);
	};

	return <DialogButton onClick={onClick}>{pNote.title}</DialogButton>;
}

export function Notes() {
	const { pBrowser } = useContext(OverlayInfoContext);
	const [vecNotes, setNotes] = useState<Note[]>([]);

	const pOverview = appStore.GetAppOverviewByAppID(pBrowser.m_unAppID);
	const onOpenNotesPopupClick = () => {
		GameNotesPopupStore.ShowGameNotesPopup(pOverview, pOverview.display_name);
	};
	const onNewNoteClick = () => {
		const strTitle = Localize("#UserGameNotes_UntitledNote_Title");
		const pNote = GameNotesCloudStore.NewNote(pOverview, strTitle);

		setNotes([...vecNotes, pNote]);
		GameNotesPopupStore.ShowGameNotesPopup(
			pOverview,
			pOverview.display_name,
			pNote.id,
		);
	};

	useEffect(() => {
		GameNotesCloudStore.GetGameNotesList(pOverview).then((e) => setNotes(e));
	}, []);

	return (
		<OverlayPanel.Container strName="notes">
			<OverlayPanel.Header>
				{Localize("#Essential_OverlayPanel_Notes_Header")}
			</OverlayPanel.Header>
			<OverlayPanel.Description>
				{Localize("#Essential_OverlayPanel_Notes_Description", vecNotes.length)}
			</OverlayPanel.Description>
			<OverlayPanel.Body>
				{vecNotes.slice(0, k_nPanelEntriesCount).map((e) => (
					<GameNote key={e.id} pNote={e} />
				))}
			</OverlayPanel.Body>
			<OverlayPanel.Footer>
				<DialogButton onClick={onOpenNotesPopupClick}>
					{Localize("#Essential_OverlayPanel_Notes_FooterButton")}
				</DialogButton>
				<DialogButton onClick={onNewNoteClick}>
					{Localize("#Essential_OverlayPanel_Notes_FooterButton_2")}
				</DialogButton>
			</OverlayPanel.Footer>
		</OverlayPanel.Container>
	);
}
