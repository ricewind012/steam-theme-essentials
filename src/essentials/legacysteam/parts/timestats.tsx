import type { Playtime } from "@steambrew/client";
import { useEffect, useState } from "react";

import { Localize } from "@/modules/localization";
import { GetUnixTime } from "@/utils/shared";

import { Events } from "../events";

interface TimeStatsProps {
	nPlaytime: number;
	strTokenPart: string;
}

function TimeStat(props: TimeStatsProps) {
	const { nPlaytime, strTokenPart } = props;
	const strToken = `#Essential_TimeStats_${strTokenPart}`;

	const flTime = nPlaytime / 60;
	const strTime =
		flTime >= 1
			? Localize("#Played_Hours", flTime.toFixed(1))
			: Localize("#Played_Minutes", nPlaytime.toFixed(1));

	return (
		<div className="TimeStats" data-type={strTokenPart}>
			{Localize(strToken, strTime)}
		</div>
	);
}

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
	const nCurrentSession = (GetUnixTime() - rtLastTimePlayed) / 60;

	return (
		<>
			<TimeStat nPlaytime={nCurrentSession} strTokenPart="CurrentSession" />
			<TimeStat
				nPlaytime={nPlaytimeLastTwoWeeks}
				strTokenPart="PlaytimeLastTwoWeeks"
			/>
			<TimeStat nPlaytime={nPlaytimeForever} strTokenPart="PlaytimeForever" />
		</>
	);
}
