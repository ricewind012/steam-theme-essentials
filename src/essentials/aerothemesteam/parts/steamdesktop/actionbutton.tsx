import {
	ELaunchSource,
	Menu,
	MenuItem,
	type MenuItemProps,
	MenuSeparator,
	type SteamAppOverview,
	type SteamAppOverviewRemoteClientData,
	showContextMenu,
	sleep,
	type Unregisterable,
} from "millennium";

import {
	type AppAction_t,
	GetAppAction,
	GetCallbackForAppAction,
} from "@/modules/appactions";
import { Config } from "@/modules/config";
import { CheckIcon } from "@/modules/icons";
import { Localize } from "@/modules/localization";
import { GetAppMobileCategories } from "@/modules/remoteplay";
import { bind } from "@/utils/bind";
import { GetMainPopupWindow } from "@/utils/popup";
import { classes } from "@/utils/shared";
import type { IAppOverview } from "@/utils/steamtypes";

import { RibbonButton, RibbonGameSectionButton } from "../../components/ribbon";

// Most of this file is stolen from some webpack module

type MobileCategory_t = "generic" | "mobile" | "phone" | "tablet" | "tv";

const mapCategoryLocTokens: Record<MobileCategory_t, string[]> = {
	generic: [
		"#StreamingClient_AnotherDevice",
		"#StreamingClient_LinkDesc_Generic",
	],
	mobile: [
		"#StreamingClient_MobileDevice",
		"#StreamingClient_LinkDesc_Specific_Mobile",
	],
	phone: ["#StreamingClient_Phone", "#StreamingClient_LinkDesc_Specific_Phone"],
	tablet: [
		"#StreamingClient_TabletDevice",
		"#StreamingClient_LinkDesc_Specific_Tablet",
	],
	tv: ["#StreamingClient_TV", "#StreamingClient_LinkDesc_Specific_TV"],
};

interface StreamingContextMenuProps {
	onStreamingTargetSelected: (
		client: SteamAppOverviewRemoteClientData,
		ev: MouseEvent,
	) => void;
	overview: IAppOverview;
}

function StreamingContextMenu(props: StreamingContextMenuProps) {
	const { overview, onStreamingTargetSelected } = props;
	const bInGamepadUI = Config.IN_GAMEPADUI;
	const bHasMobileCategories =
		!bInGamepadUI && GetAppMobileCategories(overview).length > 0;
	const onRemotePlayItemSelected = () => {
		MainWindowBrowserManager.ShowURL(
			`${Config.STORE_BASE_URL}remoteplay#anywhere_how`,
		);
	};

	return (
		<Menu label={Localize("#AppDetails_Feature_RemotePlayTogether")}>
			{overview.per_client_data.map((e) => (
				<StreamingClientContextMenuItem
					key={e.clientid}
					pClient={e}
					bIsLocalClient={overview.BIsPerClientDataLocal(e)}
					bSelected={overview.selected_clientid === e.clientid}
					onSelected={(ev) => onStreamingTargetSelected(e, ev)}
				/>
			))}
			{bHasMobileCategories && (
				<div>
					<MenuSeparator />
					<RemotePlayAnywhereContextMenuItem
						overview={overview}
						onSelected={onRemotePlayItemSelected}
					/>
				</div>
			)}
		</Menu>
	);
}

interface StreamingContextMenuItemProps {
	bIsLocalClient: boolean;
	bSelected: boolean;
	onSelected: (event: MouseEvent) => void;
	pClient: SteamAppOverviewRemoteClientData;
}

function StreamingClientContextMenuItem(props: StreamingContextMenuItemProps) {
	const { bIsLocalClient, bSelected, onSelected, pClient } = props;
	let text = Localize("#StreamingClient_StreamFrom", pClient.client_name);
	if (bIsLocalClient) {
		text = Config.ON_DECK
			? Localize("#StreamingClient_Select_ThisSteamDeck")
			: Localize("#StreamingClient_Select_ThisMachine");
	}

	return (
		<StreamingContextMenuItem onSelected={onSelected}>
			{bSelected && <CheckIcon />}
			{text}
		</StreamingContextMenuItem>
	);
}

const StreamingContextMenuItem = (props: MenuItemProps) => (
	<MenuItem
		{...props}
		// @ts-expect-error: Wrong type
		className={classes.appactionbutton.StreamingContextMenuItem}
	/>
);

interface RemotePlayAnywhereContextMenuItemProps {
	onSelected: (event: MouseEvent) => void;
	overview: SteamAppOverview;
}

function RemotePlayAnywhereContextMenuItem(
	props: RemotePlayAnywhereContextMenuItemProps,
) {
	const { overview, onSelected } = props;
	const vecCategories = GetAppMobileCategories(overview);
	if (vecCategories.length === 0) {
		return null;
	}

	const eCategory: MobileCategory_t = (() => {
		switch (vecCategories.length) {
			case 1:
				return vecCategories[0];
			case 2:
				return "mobile";
			default:
				return "generic";
		}
	})();
	const [strDeviceToken, strLinkDescToken] = mapCategoryLocTokens[eCategory];
	const strDevice = Localize(strDeviceToken);
	const strLinkDesc = Localize(strLinkDescToken);

	return (
		<StreamingContextMenuItem onSelected={onSelected}>
			<div>
				<div>{strDevice}</div>
				<div className={classes.appactionbutton.RemotePlayAnywhereDescription}>
					{strLinkDesc}
				</div>
			</div>
		</StreamingContextMenuItem>
	);
}

interface ActionButtonState {
	action: AppAction_t;
}

export class ActionButton extends RibbonGameSectionButton<ActionButtonState> {
	/** ref */
	private m_elButton: HTMLElement;
	private m_vecRegistrars: Unregisterable[] = [];

	state: ActionButtonState = {
		action: "Play",
	};

	GetAppAction() {
		return GetAppAction(
			SteamUIStore.ActiveWindowInstance,
			this.GetAppOverview(),
			"selected",
		);
	}

	GetAppOverview() {
		const { appid } = this.props;
		return appStore.GetAppOverviewByAppID(appid);
	}

	GetLocToken() {
		const eAction = this.GetAppAction();
		return `#GameAction_${eAction}`;
	}

	SetState() {
		const action = this.GetAppAction();

		this.setState({ action });
	}

	/**
	 * @todo Need a better way, but this works well enough, fuck you
	 */
	@bind
	async OnGameAction() {
		await sleep(500);

		this.SetState();
	}

	OnStreamingTargetSelected(client: SteamAppOverviewRemoteClientData) {
		const { appid } = this.props;

		SteamClient.Apps.SetStreamingClientForApp(appid, client.clientid);
	}

	OnArrowClick() {
		const overview = this.GetAppOverview();

		if (!this.m_elButton) {
			const wnd = GetMainPopupWindow();
			const strElementID = this.GetLocToken().replace("#", "");

			this.m_elButton = wnd.document.getElementById(strElementID);
		}

		showContextMenu(
			<StreamingContextMenu
				overview={overview}
				onStreamingTargetSelected={(e) => this.OnStreamingTargetSelected(e)}
			/>,
			this.m_elButton,
			{
				bOverlapHorizontal: true,
			},
		);
	}

	OnClick() {
		const overview = this.GetAppOverview();
		const callback = GetCallbackForAppAction(
			this.GetAppAction(),
			overview,
			"selected",
			ELaunchSource._2ftLibraryDetails,
		);

		callback();
		this.SetState();
	}

	override componentDidMount() {
		this.SetState();
		this.m_vecRegistrars = [
			SteamClient.Apps.RegisterForGameActionStart(this.OnGameAction),
			SteamClient.Apps.RegisterForGameActionEnd(this.OnGameAction),
		];
	}

	override componentWillUnmount() {
		for (const handle of this.m_vecRegistrars) {
			handle.unregister();
		}
	}

	override render() {
		const eAction = this.GetAppAction();
		const strToken = this.GetLocToken();

		return (
			<RibbonButton
				disabled={!eAction}
				icon={eAction}
				text={strToken}
				vertical
				onClick={() => this.OnClick()}
				onArrowClick={() => this.OnArrowClick()}
			/>
		);
	}
}
