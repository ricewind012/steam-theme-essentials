import {
	ELaunchSource,
	Menu,
	MenuItem,
	type MenuItemProps,
	MenuSeparator,
	type SteamAppOverview,
	type SteamAppOverviewRemoteClientData,
	showContextMenu,
} from "millennium";
import { useCallback, useEffect, useRef, useState } from "react";

import { GetAppAction, GetCallbackForAppAction } from "@/modules/appactions";
import { Config } from "@/modules/config";
import { CheckIcon } from "@/modules/icons";
import { Localize } from "@/modules/localization";
import { GetAppMobileCategories } from "@/modules/remoteplay";
import { classes } from "@/utils/css";
import { GetMainPopupWindow } from "@/utils/popup";
import type { IAppOverview } from "@/utils/steamtypes";

import {
	Ribbon,
	type RibbonGameSectionButtonProps,
} from "../../components/ribbon";

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
					bIsLocalClient={overview.BIsPerClientDataLocal(e)}
					bSelected={overview.selected_clientid === e.clientid}
					onSelected={(ev) => onStreamingTargetSelected(e, ev)}
					pClient={e}
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
	const { onSelected, overview } = props;
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

export function ActionButton(props: RibbonGameSectionButtonProps) {
	const { appid } = props;
	const elButton = useRef<HTMLElement>(null);

	const overview = appStore.GetAppOverviewByAppID(appid);
	const GetAppActionWrap = useCallback(() => {
		return GetAppAction(
			SteamUIStore.ActiveWindowInstance,
			overview,
			"selected",
		);
	}, [overview]);

	const [eAction, setAction] = useState(GetAppActionWrap());
	const token = `#GameAction_${eAction}`;

	const onGameAction = useCallback(() => {
		setAction(GetAppActionWrap());
	}, [GetAppActionWrap]);

	function onStreamingTargetSelected(client: SteamAppOverviewRemoteClientData) {
		SteamClient.Apps.SetStreamingClientForApp(appid, client.clientid);
	}

	function onArrowClick() {
		if (!elButton.current) {
			const wnd = GetMainPopupWindow();
			const strIcon = token.slice(token.lastIndexOf("_") + 1, token.length);
			const elButton = wnd.document.querySelector(
				`.Ribbon_ButtonContainer[data-icon="${strIcon}"]`,
			);
			elButton.current = elButton;
		}

		showContextMenu(
			<StreamingContextMenu
				overview={overview}
				onStreamingTargetSelected={(e) => onStreamingTargetSelected(e)}
			/>,
			elButton.current,
			{
				bOverlapHorizontal: true,
			},
		);
	}

	function onClick() {
		const callback = GetCallbackForAppAction(
			eAction,
			overview,
			"selected",
			ELaunchSource._2ftLibraryDetails,
		);

		callback();
		setAction(GetAppActionWrap());
	}

	useEffect(() => {
		const vecRegistrars = [
			SteamClient.Apps.RegisterForGameActionStart(onGameAction),
			SteamClient.Apps.RegisterForGameActionEnd(onGameAction),
		];

		return () => {
			for (const handle of vecRegistrars) {
				handle.unregister();
			}
		};
	}, [onGameAction]);

	return (
		<Ribbon.Button
			disabled={!eAction}
			text={token}
			onClick={onClick}
			onArrowClick={onArrowClick}
		/>
	);
}
