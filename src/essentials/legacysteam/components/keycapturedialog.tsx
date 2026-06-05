import {
	DialogButton,
	DialogHeader,
	Focusable,
	TextField,
} from "@steambrew/client";
import { type KeyboardEventHandler, useRef, useState } from "react";

import { XLineIcon } from "@/modules/icons";
import { Localize } from "@/modules/localization";
import { ToolTip } from "@/modules/tooltip";
import { classes } from "@/utils/shared";
import { type CMsgHotkey_t } from "@/utils/steamtypes";

function BuildClassNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

interface KeyCaptureDialogProps {
	currentKey: CMsgHotkey_t;
	disabled?: boolean;
	fnClose: () => void;
	onSetKey: (key: CMsgHotkey_t) => void;
	// Key, not dialog title
	strTitle: string;
}

/**
 * A dialog for setting key binds.
 *
 * Originally from webpack module 13277, recreated because it's not exported.
 */
export function KeyCaptureDialog(props: KeyCaptureDialogProps) {
	const { fnClose, onSetKey, strTitle } = props;
	const [key, setKey] = useState(props.currentKey);
	const refTextField = useRef(undefined);

	const onActivate = () => {
		setKey({
			alt_key: false,
			ctrl_key: false,
			display_name: "None",
			key_code: 0,
			meta_key: false,
			shift_key: false,
		});
		refTextField.current?.Focus();
	};
	const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (ev) => {
		if (props.disabled) {
			return;
		}

		ev.stopPropagation();
		ev.preventDefault();

		if (
			ev.key === "Shift" ||
			ev.key === "Control" ||
			ev.key === "Alt" ||
			ev.key === "Meta"
		) {
			return;
		}

		const key = {
			alt_key: ev.altKey,
			ctrl_key: ev.ctrlKey,
			display_name: "",
			key_code: ev.keyCode,
			meta_key: ev.metaKey,
			shift_key: ev.shiftKey,
		};
		SteamClient.Settings.RenderHotkey(key).then((e) => {
			key.display_name = e;
			setKey(key);
		});
	};

	return (
		<div className={classes.keycapture.KeyCaptureModal}>
			<div className={classes.keycapture.KeyCaptureHeader}>
				<DialogHeader className={classes.keycapture.Header}>
					{Localize("#Hotkey_Modal_Header")}
				</DialogHeader>
				<div className={classes.keycapture.Subhead}>
					{Localize("#Hotkey_Modal_Subhead")}
				</div>
			</div>
			<div className={classes.keycapture.KeyCaptureCenter}>
				<div className={classes.keycapture.Explainer}>{strTitle ?? ""}</div>
				<div className={classes.keycapture.KeyCaptureContainer}>
					<TextField
						focusOnMount
						spellCheck={false}
						// @ts-expect-error: Wrong type
						ref={refTextField}
						className={BuildClassNames(
							classes.keycapture.KeyCapture,
							props.disabled && classes.keycapture.Disabled,
						)}
						onKeyDown={onKeyDown}
						value={key?.display_name ?? ""}
					/>
					<Focusable
						className={classes.keycapture.UnbindButton}
						onActivate={onActivate}
					>
						<ToolTip toolTipContent={Localize("#Hotkey_Modal_Unbind")}>
							<XLineIcon color="#8b929a" />
						</ToolTip>
					</Focusable>
				</div>
			</div>
			<div className={classes.keycapture.KeyCaptureBottomRow}>
				<DialogButton
					onClick={() => {
						onSetKey(key);
						fnClose();
					}}
				>
					{Localize("#Button_Confirm")}
				</DialogButton>
				<DialogButton onClick={fnClose}>
					{Localize("#Button_Cancel")}
				</DialogButton>
			</div>
		</div>
	);
}
