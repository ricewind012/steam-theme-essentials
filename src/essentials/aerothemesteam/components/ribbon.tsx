import { DialogButton, IconsModule } from "millennium";
import { Component, type FC, type PropsWithChildren } from "react";

import { Localize } from "@/modules/localization";
import { ClassNameFactory } from "@/utils/css";

const cl = ClassNameFactory("Ribbon");

interface ButtonProps {
	/** Arguments for localization. */
	args?: string[];
	disabled?: boolean;
	/** Localization token. */
	text: string;
	onArrowClick?: () => void;
	onClick: () => void;
}

function Button(props: ButtonProps) {
	const { args, disabled, text, onClick, onArrowClick } = props;

	return (
		<div
			className={cl("ButtonContainer")}
			data-disabled={disabled}
			data-icon={text.slice(text.lastIndexOf("_") + 1, text.length)}
		>
			<DialogButton
				className={cl("Button")}
				disabled={disabled}
				onClick={onClick}
				onContextMenu={onArrowClick}
			>
				{Localize(text, ...(args || []))}
			</DialogButton>
			{onArrowClick && (
				<DialogButton
					className={cl("ButtonArrow")}
					disabled={disabled}
					onClick={onArrowClick}
				>
					<IconsModule.KaratDown />
				</DialogButton>
			)}
		</div>
	);
}

interface SectionProps extends PropsWithChildren {
	title: string;
}

const Section: FC<SectionProps> = ({ children, title }) => (
	<div className={cl("Section")}>
		<div className={cl("SectionTitle")}>{Localize(title)}</div>
		<div className={cl("SectionBody")}>{children}</div>
	</div>
);

interface ContainerProps extends PropsWithChildren {}

const Container: FC<ContainerProps> = ({ children }) => (
	<div className={cl("Container")}>{children}</div>
);

interface GameSectionButtonProps {
	appid: number;
}

class GameSectionButton<S = unknown> extends Component<
	GameSectionButtonProps,
	S
> {}

export const Ribbon = {
	Button,
	Container,
	GameSectionButton,
	Section,
};
