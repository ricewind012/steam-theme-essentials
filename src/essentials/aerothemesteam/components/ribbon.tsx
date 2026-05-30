import { Component, type FC, type PropsWithChildren } from "react";

import { Localize } from "@/modules/localization";

import { IconButton } from "./iconbutton";

interface RibbonButtonProps {
	/** Arguments for localization. */
	args?: string[];
	disabled?: boolean;
	/** Icon name for {@link IconButton}. */
	icon: string;
	/** Localization token. */
	text: string;
	/** Vertical layout? */
	vertical?: boolean;
	onArrowClick?: () => void;
	onClick: () => void;
}

export function RibbonButton(props: RibbonButtonProps) {
	const { args, disabled, icon, text, vertical, onClick, onArrowClick } = props;

	return (
		<div
			className="RibbonButtonContainer"
			id={text.replace("#", "")}
			data-disabled={disabled}
			data-vertical={vertical}
		>
			<button
				className="RibbonButton"
				type="button"
				onClick={onClick}
				onContextMenu={onArrowClick}
			>
				<IconButton name={icon} />
				{Localize(text, ...(args || []))}
			</button>
			{onArrowClick && (
				<button
					className="RibbonButtonArrow"
					type="button"
					onClick={onArrowClick}
				/>
			)}
		</div>
	);
}

interface RibbonSectionProps extends PropsWithChildren {
	title: string;
}

export const RibbonSection: FC<RibbonSectionProps> = ({ children, title }) => (
	<div className="RibbonSection">
		<div className="RibbonSectionBody">{children}</div>
		<div className="RibbonSectionTitle">{Localize(title)}</div>
	</div>
);

interface RibbonContainerProps extends PropsWithChildren {}

export const RibbonContainer: FC<RibbonContainerProps> = ({ children }) => (
	<div className="RibbonContainer">{children}</div>
);

interface RibbonGameSectionButtonProps {
	appid: number;
}

export class RibbonGameSectionButton<S = {}> extends Component<
	RibbonGameSectionButtonProps,
	S
> {}
