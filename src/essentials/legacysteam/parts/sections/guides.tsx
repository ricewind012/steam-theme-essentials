import { DialogButton } from "millennium";
import { useContext, useEffect, useState } from "react";

import { Localize } from "@/modules/localization";
import {
	FetchPopularGuides,
	type PublishedFile,
} from "@/modules/protomsgs_publishedfile";
import { useOfflineMode } from "@/utils/reacthooks";
import { LocalizeRtime32ToShortDate, RandomArrayElement } from "@/utils/shared";

import {
	k_nPanelEntriesCount,
	OverlayPanel,
} from "../../components/overlaypanel";
import { OverlayInfoContext } from "../overlayinfocontext";

export function Guides() {
	const { pBrowser, pInstance } = useContext(OverlayInfoContext);
	const [bIsOfflineMode, setOfflineMode] = useState(App.BIsOfflineMode());
	const [vecGuides, setGuides] = useState<PublishedFile[]>([]);

	const strGameName = appStore.GetAppOverviewByAppID(
		pBrowser.m_unAppID,
	).display_name;
	// FetchPopularGuides gets 10 for the purpose of getting them randomly here
	const vecRandomGuides = Array.from(Array(k_nPanelEntriesCount), () =>
		RandomArrayElement(vecGuides),
	);
	const vecRealGuides = vecGuides.length === 0 ? vecGuides : vecRandomGuides;

	const onAllGuidesClick = () => {
		const strGuidesURL = urlStore.ResolveURL(
			"GameHubGuides",
			pBrowser.m_gameID,
		);
		pInstance.m_Navigator.SteamWeb(strGuidesURL);
	};

	useOfflineMode((bIsOfflineMode) => setOfflineMode(bIsOfflineMode));
	useEffect(() => {
		if (!bIsOfflineMode) {
			FetchPopularGuides(pBrowser.m_unAppID).then((e) => setGuides(e));
		}
	}, []);

	return (
		<OverlayPanel.Container strName="guides">
			<OverlayPanel.Header>
				{Localize("#Essential_OverlayPanel_Guides_Header")}
			</OverlayPanel.Header>
			<OverlayPanel.Description>
				{bIsOfflineMode
					? Localize("#Essential_OverlayPanel_OfflineModeInfo")
					: Localize("#Essential_OverlayPanel_Guides_Description", strGameName)}
			</OverlayPanel.Description>
			<OverlayPanel.Body>
				{vecRealGuides.map((e) => {
					const strURL = urlStore.ResolveURL(
						"CommunityFilePage",
						e.publishedfileid,
					);
					const onClick = () => {
						pInstance.Navigator.SteamWeb(strURL);
					};

					return (
						<OverlayPanel.ListItem
							onClick={onClick}
							strImage={e.file_url}
							strPrimaryText={e.title}
							strSecondaryText={LocalizeRtime32ToShortDate(e.time_created)}
						/>
					);
				})}
			</OverlayPanel.Body>
			<OverlayPanel.Footer>
				<DialogButton onClick={onAllGuidesClick}>
					{Localize("#Essential_OverlayPanel_Guides_FooterButton")}
				</DialogButton>
			</OverlayPanel.Footer>
		</OverlayPanel.Container>
	);
}
