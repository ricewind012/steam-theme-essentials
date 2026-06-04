import { OverlayPanel } from "../components/overlaypanel";
import { OverlayInfoContext } from "./overlayinfocontext";
import {
	Achievements,
	Friends,
	Guides,
	News,
	Notes,
	Screenshots,
} from "./sections";

export function OverlayInfo() {
	// TODO: currently only one overlay supported
	const pInstance = SteamUIStore.WindowStore.OverlayWindows.at(-1);
	const ctx: OverlayInfoContext = {
		pBrowser: pInstance.m_params.browserInfo,
		pInstance,
	};

	return (
		<OverlayInfoContext value={ctx}>
			<OverlayPanel.GridContainer>
				<Friends />
				<Achievements />
				<Guides />
				<News />
				<Screenshots />
				<Notes />
			</OverlayPanel.GridContainer>
		</OverlayInfoContext>
	);
}
