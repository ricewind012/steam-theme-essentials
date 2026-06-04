import type { Playtime } from "@steambrew/client";
import { useEffect, useState } from "react";

import { Localize } from "@/modules/localization";
import { GetUnixTime } from "@/utils/shared";

import { Events } from "../events";

export function TimeStats() {
	const [pPlaytime, setPlaytime] = useState<Playtime>(null);

	useEffect(() => {
		Events.AppPlaytime.Register((ev) => {
			const { pPlaytime } = ev.detail;
			setPlaytime(pPlaytime);
		});
	}, []);

	if (!pPlaytime) {
		return null;
	}
	const { rtLastTimePlayed, nPlaytimeForever, nPlaytimeLastTwoWeeks } =
		pPlaytime;
	const rtCurrentSession = GetUnixTime() - rtLastTimePlayed / 60;

	return (
		<>
			<div className="TimeStats" data-type="current">
				{Localize(
					"#AppOverlay_Playtime_ThisSession",
					Localize("#Played_Minutes", rtCurrentSession),
				)}
			</div>
			<div className="TimeStats" data-type="twoweeks">
				{Localize("#AppOverlay_Playtime_ThisSession", nPlaytimeLastTwoWeeks)}
			</div>
			<div className="TimeStats" data-type="total">
				{Localize("#AppOverlay_Playtime_ThisSession", nPlaytimeForever)}
			</div>
		</>
	);
}
