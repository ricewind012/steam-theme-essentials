import { ModalPosition, showModal } from "millennium";
import { useCallback, useEffect, useRef, useState } from "react";

import { AppGameInfo } from "@/modules/appgameinfo";
import { BIsChinaLauncher, Config } from "@/modules/config";
import { CKioskModeManager } from "@/modules/kioskmodemgr";
import { Localize } from "@/modules/localization";
import {
	CParentalFeaturesManager,
	EParentalFeature,
} from "@/modules/parentalfeatures";
import { GetMainPopupWindow } from "@/utils/popup";
import { SteamClientURL, type Unsubscribable } from "@/utils/steamtypes";

import { Ribbon } from "../../components/ribbon";
import {
	ESuperNavTab,
	Events,
	type GameListChangeEvent,
	GetESuperNavTabFromSetting,
	type TabChangeEvent,
} from "../../events";
import { ActionButton } from "./actionbutton";
import { FavoriteButton } from "./favoritebutton";

const k_EAppType_Demo = 8;

interface LibraryLink {
	label: string;
	link?: string;
	url?: string;
}

/**
 * Gets available links (ones below the game image) for an app.
 *
 * Stolen from `appdetailsprimarylinkssection`, since the original returns a
 * React component.
 */
function GetAppLinks(appid: number) {
	const overview = appStore.GetAppOverviewByAppID(appid);
	const { details } = appDetailsStore.GetAppData(appid);

	const bIsModOrShortcut = overview.BIsModOrShortcut();
	if (bIsModOrShortcut) {
		return [];
	}

	// ty valve
	const bAvailableContentOnStore = details?.bAvailableContentOnStore;
	const bCommunityMarketPresence = details?.bCommunityMarketPresence;
	const bWorkshopVisible = details?.bWorkshopVisible;

	const { app_type: eAppType, optional_parent_app_id: unParentAppID } =
		overview;
	const bIsDemo = eAppType === k_EAppType_Demo;
	const actual_appid =
		bIsDemo && unParentAppID ? unParentAppID : overview.appid;

	const badge = badgeStore.GetBadgeData(actual_appid);
	const store_item = StoreItemCache.GetApp(actual_appid);
	const unDemoAppID =
		bIsDemo && store_item?.HasDemoStandaloneStorePage()
			? overview.appid
			: actual_appid;
	const bIsChinaLauncher = BIsChinaLauncher(Config.LAUNCHER_TYPE);
	const bPointsShopAvailable = !bIsChinaLauncher && badge.rgCards; //?.length > 0;

	const vecLinks: LibraryLink[] = [
		{
			label: "#AppDetails_Links_Store",
			url: urlStore.BuildStoreAppURL(unDemoAppID, "primarylinks"),
		},
		bAvailableContentOnStore && {
			label: "#AppDetails_Links_DLC",
			url: urlStore.BuildStoreAppDlcURL(actual_appid, "primarylinks"),
		},
		!bIsChinaLauncher && {
			label: "#AppDetails_Links_Community",
			link: "GameHub",
		},
		bPointsShopAvailable && {
			label: "#AppDetails_Links_PointsShop",
			url: urlStore.BuildAppPointsShopURL(actual_appid),
		},
		!bIsChinaLauncher && {
			label: "#AppDetails_Link_Discussions",
			link: "GameHubDiscussions",
		},
		!bIsChinaLauncher && {
			label: "#AppDetails_Link_Guides",
			link: "GameHubGuides",
		},
		bWorkshopVisible && {
			label: "#AppDetails_Link_Workshop",
			link: "SteamWorkshopPage",
		},
		bCommunityMarketPresence && {
			label: "#AppDetails_Link_Market",
			link: "CommunityMarketApp",
		},
		!CKioskModeManager.BKioskModeLocked() && {
			label: "#AppDetails_Link_Support",
			link: "HelpAppPage",
		},
	];

	return vecLinks.filter(Boolean);
}

function GetAccountEntries() {
	const { strAccountBalance, strAccountName } = App.GetCurrentUser();
	const { secureComputer } = loginStore;

	return [
		{
			feature: EParentalFeature.Profile,
			text: "#Menu_ViewMyProfile",
			url: "steam://url/SteamIDMyProfile",
		},
		{
			args: [strAccountName],
			feature: EParentalFeature.Max,
			text: "#Menu_ViewMyAccount",
			url: "steam://url/StoreAccount",
		},
		{
			feature: EParentalFeature.Max,
			text: "#Menu_StorePreferences",
			url: "steam://url/SteamPreferences",
		},
		{
			args: [strAccountBalance],
			feature: EParentalFeature.Store,
			text: "#Menu_ViewMyWallet",
			url: "steam://url/StoreAddFundsPage",
		},
		{
			disabled: !secureComputer,
			text: "#Menu_ChangeAccount",
			url: "steam://changeuser",
		},
		{ text: "#Menu_Logout", url: "steam://signout" },
	];
}

function GetDefaltTabState() {
	const [eDefaultTab] = settingsStore.GetClientSetting("start_page");
	return GetESuperNavTabFromSetting(eDefaultTab);
}

export function SteamDesktop() {
	const [appid, setAppID] = useState(-1);
	const [tab, setTab] = useState(GetDefaltTabState());

	const vecEventRegistrars = useRef<Unsubscribable[]>([]);

	function OnManageButtonClick() {
		SteamClient.Apps.OpenAppSettingsDialog(appid, "");
	}

	function OnDetailsButtonClick() {
		const overview = appStore.GetAppOverviewByAppID(appid);
		const { details } = appDetailsStore.GetAppData(appid);
		const wnd = GetMainPopupWindow();

		showModal(
			<ModalPosition>
				<AppGameInfo expand={true} overview={overview} details={details} />
			</ModalPosition>,
			wnd,
			{
				popupHeight: 500,
				popupWidth: 800,
				strTitle: Localize("#AppDetails_Tab_GameInfo"),
			},
		);
	}

	function OnGoBackButtonClick() {
		MainWindowBrowserManager.m_browser.GoBack();
	}

	function OnGoForwardButtonClick() {
		MainWindowBrowserManager.m_browser.GoForward();
	}

	function OnReloadButtonClick() {
		MainWindowBrowserManager.m_browser.Reload();
	}

	const OnWindowEvent = useCallback(
		(ev: CustomEventInit<GameListChangeEvent | TabChangeEvent>) => {
			const nextAppID = "appid" in ev.detail ? ev.detail.appid : appid;
			const nextTab = "tab" in ev.detail ? ev.detail.tab : tab;
			if (appid === nextAppID && tab === nextTab) {
				return;
			}

			setAppID(nextAppID);
			setTab(nextTab);
		},
		[appid, tab],
	);

	useEffect(() => {
		vecEventRegistrars.current.push(
			Events.GameList.Register(OnWindowEvent),
			Events.Tab.Register(OnWindowEvent),
		);

		return () => {
			for (const handle of vecEventRegistrars.current) {
				handle.Unregister();
			}
		};
	}, [OnWindowEvent]);

	if (tab === ESuperNavTab.Library && appid === -1) {
		return <Ribbon.Container />;
	}

	const accountSection = GetAccountEntries().map((e) => {
		const { args, feature, text, url } = e;
		const onClick = () => {
			SteamClientURL.ExecuteSteamURL(url);
		};
		const disabled =
			e.disabled || CParentalFeaturesManager.BIsFeatureBlocked(feature);

		return (
			<Ribbon.Button
				key={text}
				args={args}
				disabled={disabled}
				text={text}
				onClick={onClick}
			/>
		);
	});
	const browserSection = (
		<Ribbon.Section title="#Essential_RibbonSection_Browser">
			<Ribbon.Button
				text="#Essential_RibbonButton_NavBack"
				onClick={OnGoBackButtonClick}
			/>
			<Ribbon.Button
				text="#Essential_RibbonButton_NavForward"
				onClick={OnGoForwardButtonClick}
			/>
			<Ribbon.Button
				text="#Essential_RibbonButton_Reload"
				onClick={OnReloadButtonClick}
			/>
		</Ribbon.Section>
	);

	switch (tab) {
		case ESuperNavTab.Library: {
			const links = GetAppLinks(appid).map((e) => {
				const { label, link, url } = e;
				const dest = link ? urlStore.ResolveURL(link, appid) : url;
				const onClick = () => {
					MainWindowBrowserManager.ShowURL(dest);
				};

				return <Ribbon.Button key={label} text={label} onClick={onClick} />;
			});

			return (
				<Ribbon.Container>
					<Ribbon.Section title="#Essential_RibbonSection_Game">
						<ActionButton appid={appid} />
						<Ribbon.Button
							text="#GameAction_Manage"
							onClick={() => OnManageButtonClick()}
						/>
						<Ribbon.Button
							text="#GameAction_ViewDetails"
							onClick={() => OnDetailsButtonClick()}
						/>
						<FavoriteButton appid={appid} />
					</Ribbon.Section>
					{links.length > 0 && (
						<Ribbon.Section title="#Essential_RibbonSection_Links">
							{links}
						</Ribbon.Section>
					)}
				</Ribbon.Container>
			);
		}

		case ESuperNavTab.Console:
			return <Ribbon.Container />;

		// Browser
		default:
			return (
				<Ribbon.Container>
					{browserSection}
					{tab === ESuperNavTab.Profile && (
						<Ribbon.Section title="#Essential_RibbonSection_Account">
							{accountSection}
						</Ribbon.Section>
					)}
				</Ribbon.Container>
			);
	}
}
