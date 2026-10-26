import { useCallback, useEffect, useState } from "react";

import {
	Ribbon,
	type RibbonGameSectionButtonProps,
} from "../../components/ribbon";

// TODO: its text doesn't update... but ActionButton does
export function FavoriteButton(props: RibbonGameSectionButtonProps) {
	const { appid } = props;
	const [text, setText] = useState("");

	const BIsFavorite = useCallback(() => {
		return collectionStore.BIsFavorite(appid);
	}, [appid]);

	const ToggleAppFavorite = useCallback(() => {
		const favorite = BIsFavorite();
		collectionStore.SetAppsAsFavorite([appid], !favorite);
	}, [BIsFavorite, appid]);

	const SetFavorite = useCallback(() => {
		const favorite = BIsFavorite();
		const text = favorite
			? "#GameAction_RemoveFromFavorites"
			: "#GameAction_AddToFavorites";
		setText(text);
	}, [BIsFavorite]);

	function onClick() {
		ToggleAppFavorite();
		SetFavorite();
	}

	useEffect(() => {
		SetFavorite();
	}, [SetFavorite]);

	return <Ribbon.Button text={text} onClick={() => onClick()} />;
}
