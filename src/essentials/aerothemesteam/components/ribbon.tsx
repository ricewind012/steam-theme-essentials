import { DialogButton, IconsModule } from "millennium";
import { Component, type FC, type PropsWithChildren } from "react";

import { Localize } from "@/modules/localization";

interface RibbonButtonProps {
	/** Arguments for localization. */
	args?: string[];
	disabled?: boolean;
	/** Localization token. */
	text: string;
	onArrowClick?: () => void;
	onClick: () => void;
}

export function RibbonButton(props: RibbonButtonProps) {
	const { args, disabled, text, onClick, onArrowClick } = props;

	return (
		<div
			className="RibbonButtonContainer"
			data-disabled={disabled}
			data-icon={text.slice(text.lastIndexOf("_") + 1, text.length)}
		>
			<DialogButton
				className="RibbonButton"
				disabled={disabled}
				onClick={onClick}
				onContextMenu={onArrowClick}
			>
				{Localize(text, ...(args || []))}
			</DialogButton>
			{onArrowClick && (
				<DialogButton
					className="RibbonButtonArrow"
					disabled={disabled}
					onClick={onArrowClick}
				>
					<IconsModule.KaratDown />
				</DialogButton>
			)}
		</div>
	);
}

interface RibbonSectionProps extends PropsWithChildren {
	title: string;
}

export const RibbonSection: FC<RibbonSectionProps> = ({ children, title }) => (
	<div className="RibbonSection">
		<div className="RibbonSectionTitle">{Localize(title)}</div>
		<div className="RibbonSectionBody">{children}</div>
	</div>
);

interface RibbonContainerProps extends PropsWithChildren {}

export const RibbonContainer: FC<RibbonContainerProps> = ({ children }) => (
	<div className="RibbonContainer">{children}</div>
);

interface RibbonGameSectionButtonProps {
	appid: number;
}

export class RibbonGameSectionButton<S = unknown> extends Component<
	RibbonGameSectionButtonProps,
	S
> {}
