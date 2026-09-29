import { DialogButton } from "millennium";
import { useContext, useEffect, useState } from "react";

import { EPersonaState, FriendsListEntry } from "@/modules/friends";
import { Localize } from "@/modules/localization";
import { useOfflineMode } from "@/utils/reacthooks";

import {
	k_nPanelEntriesCount,
	OverlayPanel,
} from "../../components/overlaypanel";
import { OverlayInfoContext } from "../overlayinfocontext";

enum EFriendsPanelStatus {
	OfflineMode,
	SignedOut,
	OK,
}

function GetOnlineFriends() {
	return friendStore.allFriends.filter((e) => e.persona.is_online);
}

function GetPersonaStatus(pPlayer) {
	return pPlayer.persona.m_ePersonaState;
}

export function Friends() {
	// Prevent errors, as it may not be ready yet
	const FriendsUIFriendStore = friendStore.m_FriendsUIFriendStore;
	const self = FriendsUIFriendStore.self || { persona: {} };

	const { pBrowser, pInstance } = useContext(OverlayInfoContext);
	const [bIsOfflineMode, setOfflineMode] = useState(App.BIsOfflineMode());
	// TODO: this is useless, since, IIRC, Steam fetches shit even if you signed
	// out of friends for some reason? Doesn't fire when going offline either
	const [ePersonaState, setPersonaState] = useState(GetPersonaStatus(self));
	const [vecFriends, setFriends] = useState(GetOnlineFriends());

	const onPersonaStateChange = (pPlayer) => {
		const ePersonaState = GetPersonaStatus(pPlayer);
		if (pPlayer === self) {
			setPersonaState(ePersonaState);
		}

		// TODO: make a map, screenshots also
		if (ePersonaState !== EPersonaState.Offline && !bIsOfflineMode) {
			setFriends(GetOnlineFriends());
		}
	};

	useOfflineMode((bIsOfflineMode) => setOfflineMode(bIsOfflineMode));
	useEffect(() => {
		const handle =
			FriendsUIFriendStore.AddPersonaStateChangedCallback(onPersonaStateChange);

		return () => {
			handle.Unregister();
		};
	}, []);

	const vecHeaders = [
		Localize("#Essential_OverlayPanel_OfflineModeInfo"),
		Localize("#Essential_OverlayPanel_Friends_Description_SignedOut"),
		Localize("#Essential_OverlayPanel_Friends_Description", vecFriends.length),
	];
	const nHeaderIdx: EFriendsPanelStatus = [
		bIsOfflineMode,
		ePersonaState === EPersonaState.Offline,
		true,
	].findIndex(Boolean);

	// TODO: use SetWindowVisibility to be able into players dialog
	return (
		<OverlayPanel.Container strName="friends">
			<OverlayPanel.Header>
				{Localize("#Essential_OverlayPanel_Friends_Header")}
			</OverlayPanel.Header>
			<OverlayPanel.Description>
				{vecHeaders[nHeaderIdx]}
			</OverlayPanel.Description>
			<OverlayPanel.Body>
				{vecFriends.slice(0, k_nPanelEntriesCount).map((e) => (
					<FriendsListEntry browserContext={pBrowser} friend={e} notDraggable />
				))}
			</OverlayPanel.Body>
			<OverlayPanel.Footer>
				<DialogButton onClick={() => pInstance.Navigator.Chat()}>
					{Localize("#Essential_OverlayPanel_Friends_FooterButton")}
				</DialogButton>
			</OverlayPanel.Footer>
		</OverlayPanel.Container>
	);
}
