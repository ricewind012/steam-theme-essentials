import {
	type AppAchievement,
	type AppAchievementResponse,
	EResult,
	ProgressBar,
} from "millennium";
import { useCallback, useContext, useEffect, useState } from "react";

import { Localize, LocalizeInlineReact } from "@/modules/localization";
import { RandomArrayElement } from "@/utils/shared";

import { OverlayPanel } from "../../components/overlaypanel";
import { OverlayInfoContext } from "../overlayinfocontext";

const k_unRareAchievementThreshold = 10;

interface AchievementProps {
	pAchievement: AppAchievement;
}

function Achievement(props: AchievementProps) {
	const { pAchievement } = props;
	if (!pAchievement) {
		return null;
	}

	const { bAchieved, strImage, strName, strDescription, flAchieved } =
		pAchievement;
	return (
		<div data-rare={bAchieved && flAchieved < k_unRareAchievementThreshold}>
			<OverlayPanel.ListItem
				onClick={() => {}}
				strImage={strImage}
				strPrimaryText={strName}
				strSecondaryText={strDescription}
			/>
		</div>
	);
}

export function Achievements() {
	const { pBrowser, pInstance } = useContext(OverlayInfoContext);

	const [vecAchievements, setAchievements] = useState<AppAchievement[]>([]);
	const [pLastAchieved] = vecAchievements.toSorted(
		(a, b) => b.rtUnlocked - a.rtUnlocked,
	);
	const pRandomAchievement = RandomArrayElement(
		vecAchievements.filter((e) => !e.bAchieved && !e.bHidden),
	);

	const nAchieved = vecAchievements.filter((e) => e.bAchieved).length;
	const nTotal = vecAchievements.length;
	const nProgress = (nAchieved / nTotal) * 100;

	const FetchAchievements = useCallback(() => {
		const handler = ({ data, result }: AppAchievementResponse) => {
			if (result !== EResult.OK) {
				throw new Error(`GetMyAchievementsForApp got result ${result}`);
			}

			setAchievements(data.rgAchievements);
		};
		SteamClient.Apps.GetMyAchievementsForApp(pBrowser.m_gameID).then(handler);
	}, [pBrowser.m_gameID]);

	useEffect(() => {
		FetchAchievements();

		// Don't use its protobuf message, contains only appid, therefore
		// useless... valve moment
		// Doesn't return an unregister function either, VAAAAALVE
		SteamClient.Apps.RegisterForAchievementChanges(() => FetchAchievements());
	}, [FetchAchievements]);

	return (
		<OverlayPanel.Container strName="achievements">
			<OverlayPanel.Header>
				{Localize("#Essential_OverlayPanel_Achievements_Header")}
			</OverlayPanel.Header>
			<OverlayPanel.Description>
				{LocalizeInlineReact(
					Localize(
						"#Essential_OverlayPanel_Achievements_Description",
						nAchieved,
						nTotal,
						Math.floor(nProgress),
					),
					<span className="AppAchievements_ProgressPercentage" />,
				)}
				<ProgressBar
					// @ts-expect-error: Wrong type
					className="AppAchievements_ProgressBar"
					nProgress={nProgress}
				/>
			</OverlayPanel.Description>
			<OverlayPanel.Body>
				<Achievement pAchievement={pLastAchieved} />
				<Achievement pAchievement={pRandomAchievement} />
			</OverlayPanel.Body>
			<OverlayPanel.Footer>
				<OverlayPanel.Button
					onClick={() => pInstance.Navigator.MyAchievements(pBrowser.m_unAppID)}
				>
					{Localize("#Essential_OverlayPanel_Achievements_FooterButton")}
				</OverlayPanel.Button>
			</OverlayPanel.Footer>
		</OverlayPanel.Container>
	);
}
