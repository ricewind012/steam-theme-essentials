import { useEffect, useState } from "react";

import { Localize } from "@/modules/localization";
import { classes } from "@/utils/css";
import { GetMainPopupWindow } from "@/utils/popup";
import { WaitForElement } from "@/utils/shared";

const k_strLocTokenPrefix = "#Essential_GameListBar";

export function GameListBar() {
	const [text, setText] = useState("NoFilters");

	useEffect(() => {
		let observer: MutationObserver;
		let bCancelled = false;

		const init = async () => {
			const wnd = GetMainPopupWindow();
			const filterButtonsContainer = await WaitForElement(
				`.${classes.gamelistdropdown.ViewFiltersBar}`,
				wnd.document,
			);
			if (bCancelled) {
				return;
			}

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
				setText(text);
			};

			mutationCallback();
			observer = new MutationObserver(mutationCallback);
			observer.observe(filterButtonsContainer, {
				attributeFilter: ["class"],
				attributes: true,
				subtree: true,
			});
		};

		init();
		return () => {
			bCancelled = true;
			observer.disconnect();
		};
	}, []);

	const strLocalized = Localize(`${k_strLocTokenPrefix}_${text}`);

	return <div className="GameListFilterStatus">{strLocalized}</div>;
}
