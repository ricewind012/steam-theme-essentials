import { Component } from "react";

import { Localize } from "@/modules/localization";
import { GetMainPopupWindow } from "@/utils/popup";
import { classes, WaitForElement } from "@/utils/shared";

const k_strLocTokenPrefix = "#Essential_GameListBar";

interface GameListBarState {
	text: string;
}

export class GameListBar extends Component<{}, GameListBarState> {
	private observer: MutationObserver;

	state = {
		text: "NoFilters",
	};

	override async componentDidMount() {
		const wnd = GetMainPopupWindow();
		const filterButtonsContainer = await WaitForElement(
			`.${classes.gamelistdropdown.ViewFiltersBar}`,
			wnd.document,
		);
		const isButtonSelected = (button: Element) =>
			button?.classList.contains(classes.gamelistdropdown.Active);
		const getButton = (sel: string) =>
			filterButtonsContainer.querySelector(sel)?.parentElement;

		const mutationCallback = () => {
			const linuxButton = getButton(".SVGIcon_LinuxLogo2");
			const recentActivityButton = getButton(".SVGIcon_SortBy");
			const readyToPlayButton = getButton(".SVGIcon_ReadyToPlay");
			const linuxSelected = isButtonSelected(linuxButton);
			const readyToPlaySelected = isButtonSelected(readyToPlayButton);
			const recentActivitySelected = isButtonSelected(recentActivityButton);

			const text = (() => {
				switch (true) {
					case recentActivitySelected && linuxSelected && readyToPlaySelected:
						return "SortRecentActivityOnLinuxAndReadyToPlay";
					case recentActivitySelected && linuxSelected:
						return "SortRecentActivityOnLinux";
					case recentActivitySelected && readyToPlaySelected:
						return "SortRecentActivityReadyToPlay";
					case linuxSelected && readyToPlaySelected:
						return "OnlyLinuxAndInstalled";
					case recentActivitySelected:
						return "SortRecentActivity";
					case linuxSelected:
						return "OnlyLinux";
					case readyToPlaySelected:
						return "OnlyReadyToPlay";
					default:
						return "NoFilters";
				}
			})();
			this.setState({ text });
		};

		mutationCallback();
		this.observer = new MutationObserver(mutationCallback);
		this.observer.observe(filterButtonsContainer, {
			attributeFilter: ["class"],
			attributes: true,
			subtree: true,
		});
	}

	override componentWillUnmount() {
		this.observer.disconnect();
	}

	override render() {
		const text = Localize(`${k_strLocTokenPrefix}_${this.state.text}`);

		return <div className="GameListFilterStatus">{text}</div>;
	}
}
