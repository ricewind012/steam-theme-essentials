import {
	type AppAchievement,
	type AppAchievementResponse,
	DialogButton,
	EResult,
	ProgressBar,
} from "@steambrew/client";
import { useContext, useEffect, useState } from "react";

import { AchievementIconBase } from "@/modules/achievementiconbase";
import { Localize } from "@/modules/localization";
import { RandomArrayElement } from "@/utils/shared";

import { OverlayPanel } from "../../components/overlaypanel";
import { OverlayInfoContext } from "../overlayinfocontext";

const k_unRareAchievementThreshold = 10;

interface AchievementProps {
	pAchievement: AppAchievement;
}

/**
 * Separate component from OverlayPanel.ListItem to instead use
 * AchievementIconBase.
 */
function Achievement(props: AchievementProps) {
	const { pAchievement } = props;
	if (!pAchievement) {
		return null;
	}

	const { bAchieved, flAchieved, strDescription, strImage, strName } =
		pAchievement;
	return (
		<div className="AppAchievement">
			<AchievementIconBase
				alt={strName}
				className="AppAchievement_Image"
				glow={bAchieved && flAchieved < k_unRareAchievementThreshold}
				imgURL={strImage}
				pauseAnimation={window.matchMedia("(prefers-reduced-motion)").matches}
			/>
			<div>
				<div className="AppAchievement_Name">{strName}</div>
				<div className="AppAchievement_Description">{strDescription}</div>
			</div>
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
	const bAchievedAll = nAchieved === nTotal;
	const strDescToken = bAchievedAll
		? "#AppDetails_PlayerUnlockedPercentAll"
		: "#AppDetails_PlayerUnlockedPercent";

	function FetchAchievements() {
		const handler = ({ data, result }: AppAchievementResponse) => {
			if (result !== EResult.OK) {
				throw new Error(`GetMyAchievementsForApp got result ${result}`);
			}

			setAchievements(data.rgAchievements);
		};
		SteamClient.Apps.GetMyAchievementsForApp(pBrowser.m_gameID).then(handler);
	}

	useEffect(() => {
		FetchAchievements();

		// Don't use its protobuf message, contains only appid, therefore
		// useless... valve moment
		// Doesn't return an unregister function either, VAAAAALVE
		SteamClient.Apps.RegisterForAchievementChanges(() => FetchAchievements());
	}, []);

	return (
		<OverlayPanel.Container strName="achievements">
			<OverlayPanel.Header>
				{Localize("#AppOverlay_Achievements")}
			</OverlayPanel.Header>
			<OverlayPanel.Description>
				{Localize(strDescToken, nAchieved, nTotal)}
				{!bAchievedAll && (
					<span className="AppAchievements_ProgressPercentage">{`(${Math.floor(nProgress)}%)`}</span>
				)}
			</OverlayPanel.Description>
			<OverlayPanel.Body>
				<ProgressBar
					className="AppAchievements_ProgressBar"
					nProgress={nProgress}
				/>
				<div className="AppAchievements">
					<Achievement pAchievement={pLastAchieved} />
					<Achievement pAchievement={pRandomAchievement} />
				</div>
			</OverlayPanel.Body>
			<OverlayPanel.Footer>
				<DialogButton
					onClick={() => pInstance.Navigator.MyAchievements(pBrowser.m_unAppID)}
				>
					{Localize("#AppOverlay_GameOverview_YourAchievements")}
				</DialogButton>
			</OverlayPanel.Footer>
		</OverlayPanel.Container>
	);
}
