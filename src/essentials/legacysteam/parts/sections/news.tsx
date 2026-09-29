import { DialogButton, EResult } from "millennium";
import { useContext, useEffect, useState } from "react";

import { Config } from "@/modules/config";
import { Localize } from "@/modules/localization";
import { useOfflineMode } from "@/utils/reacthooks";
import { LocalizeRtime32ToShortDate } from "@/utils/shared";

import {
	type AjaxResult_t,
	AjaxURLs,
	GetAjaxResponse,
} from "../../ajax/response";
import type { AjaxGetPartnerEventsPageableResult } from "../../ajax/types";
import { OverlayPanel } from "../../components/overlaypanel";
import { OverlayInfoContext } from "../overlayinfocontext";

export function News() {
	const { pBrowser, pInstance } = useContext(OverlayInfoContext);
	const [bIsOfflineMode, setOfflineMode] = useState(App.BIsOfflineMode());
	const [data, setData] = useState<
		AjaxResult_t<AjaxGetPartnerEventsPageableResult>
	>({ events: [], success: EResult.Fail });

	const onLatestNewsClick = () => {
		const strNewsURL = urlStore.ResolveURL("GameHubNews", pBrowser.m_gameID);
		pInstance.m_Navigator.SteamWeb(strNewsURL);
	};

	useOfflineMode((bIsOfflineMode) => setOfflineMode(bIsOfflineMode));
	useEffect(() => {
		if (bIsOfflineMode) {
			return;
		}

		GetAjaxResponse<AjaxGetPartnerEventsPageableResult>(
			AjaxURLs.PartnerEventsPageable,
			{
				appid: pBrowser.m_unAppID,
				count: 3,
				l: Config.LANGUAGE,
			},
		).then((e) => setData(e));
	}, []);

	return (
		<OverlayPanel.Container strName="news">
			<OverlayPanel.Header>
				{Localize("#Essential_OverlayPanel_News_Header")}
			</OverlayPanel.Header>
			<OverlayPanel.Description>
				{bIsOfflineMode
					? Localize("#Essential_OverlayPanel_OfflineModeInfo")
					: Localize("#Essential_OverlayPanel_News_Description")}
			</OverlayPanel.Description>
			<OverlayPanel.Body>
				{data.events.map(({ announcement_body: body }) => {
					const strURL = urlStore.ResolveURL(
						"EventAnnouncementPage",
						pBrowser.m_gameID,
						body.gid,
					);
					const onClick = () => {
						pInstance.Navigator.SteamWebTab(strURL);
					};

					return (
						<OverlayPanel.ListItem
							onClick={onClick}
							strPrimaryText={body.headline}
							strSecondaryText={LocalizeRtime32ToShortDate(body.posttime)}
						/>
					);
				})}
			</OverlayPanel.Body>
			<OverlayPanel.Footer>
				<DialogButton onClick={onLatestNewsClick}>
					{Localize("#Essential_OverlayPanel_News_FooterButton")}
				</DialogButton>
			</OverlayPanel.Footer>
		</OverlayPanel.Container>
	);
}
