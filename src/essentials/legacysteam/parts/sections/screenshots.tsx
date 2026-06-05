import {
	DialogButton,
	ModalPosition,
	ModalRoot,
	type Screenshot,
	type ScreenshotNotification,
	type ShowModalProps,
	type ShowModalResult,
	showModal,
} from "@steambrew/client";
import { type ReactNode, useContext, useEffect, useState } from "react";

import {
	ClickableScreenshot,
	ToClickableScreenshot,
} from "@/modules/clickablescreenshot";
import { Config, ConfigContext } from "@/modules/config";
import { Localize } from "@/modules/localization";
import type { CMsgHotkey_t } from "@/utils/steamtypes";

import { KeyCaptureDialog } from "../../components/keycapturedialog";
import {
	k_nPanelEntriesCount,
	OverlayPanel,
} from "../../components/overlaypanel";
import { OverlayInfoContext } from "../overlayinfocontext";

/**
 * Cool wrapper for {@link showModal} that only needs a SteamUI window instance.
 */
function ShowModalForOverlay(
	modal: ReactNode,
	instance: any,
	props?: ShowModalProps,
) {
	return showModal(modal, instance.BrowserWindow, {
		...props,
		browserContext: instance.m_params.browserInfo,
	});
}

export function Screenshots() {
	const [pKey, setKey] = settingsStore.GetClientSetting("screenshot_key");
	const { pBrowser, pInstance } = useContext(OverlayInfoContext);
	const [strKeyName, setKeyName] = useState(pKey.display_name);

	const [vecScreenshots, setScreenshots] = useState<Screenshot[]>([]);

	const onSetKey = (key: CMsgHotkey_t) => {
		setKey(key);
		setKeyName(key.display_name);
	};
	const onSetShortcutClick = () => {
		// WTF
		let pModal: ShowModalResult;
		const Close = () => pModal.Close();
		pModal = ShowModalForOverlay(
			<ModalPosition>
				<ModalRoot>
					<KeyCaptureDialog
						currentKey={pKey}
						fnClose={Close}
						onSetKey={onSetKey}
						strTitle={Localize("#Settings_Hotkey_TakeScreenshot")}
					/>
				</ModalRoot>
			</ModalPosition>,
			pInstance,
		);
	};

	useEffect(() => {
		SteamClient.Screenshots.GetAllLocalScreenshots().then((e) => {
			setScreenshots(e.filter((e) => e.nAppID === pBrowser.m_unAppID));
		});

		const handler = ({ strOperation, unAppID }: ScreenshotNotification) => {
			// No idea what "started" is but it only has unAppID... useless
			// @ts-expect-error: Wrong type
			if (unAppID !== pBrowser.m_unAppID || strOperation === "started") {
				return;
			}

			// TODO:
			// I don't care enough for now to be managing screenshots myself
			// here, so just redo this shit
			SteamClient.Screenshots.GetAllLocalScreenshots().then((e) => {
				setScreenshots(e.filter((e) => e.nAppID === pBrowser.m_unAppID));
			});
		};
		const { unregister } =
			SteamClient.GameSessions.RegisterForScreenshotNotification(handler);
		return () => {
			unregister();
		};
	}, []);

	return (
		<OverlayPanel.Container strName="screenshots">
			<OverlayPanel.Header>
				{Localize("#Essential_OverlayPanel_Screenshots_Header")}
			</OverlayPanel.Header>
			<OverlayPanel.Description>
				{Localize(
					"#Essential_OverlayPanel_Screenshots_Description",
					strKeyName,
				)}
			</OverlayPanel.Description>
			<OverlayPanel.Body>
				<ConfigContext value={Config}>
					{vecScreenshots.slice(0, k_nPanelEntriesCount).map((e) => (
						<ClickableScreenshot screenshot={ToClickableScreenshot(e)} />
					))}
				</ConfigContext>
			</OverlayPanel.Body>
			<OverlayPanel.Footer>
				<DialogButton onClick={() => pInstance.Navigator.Media.Grid()}>
					{Localize("#Essential_OverlayPanel_Screenshots_FooterButton")}
				</DialogButton>
				<DialogButton onClick={onSetShortcutClick}>
					{Localize("#Essential_OverlayPanel_Screenshots_FooterButton_2")}
				</DialogButton>
			</OverlayPanel.Footer>
		</OverlayPanel.Container>
	);
}
