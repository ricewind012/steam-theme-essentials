import { DialogButton, type DialogButtonProps } from "millennium";
import type { FC, PropsWithChildren } from "react";

import { ClassNameFactory } from "@/utils/css";

export const k_nPanelEntriesCount = 4;

const cl = ClassNameFactory("OverlayPanel");

const Body: FC<PropsWithChildren> = ({ children }) => (
	<div className={cl("Body")}>{children}</div>
);

const Button: FC<Exclude<DialogButtonProps, "className">> = (props) => (
	<DialogButton className={cl("Button")} {...props} />
);

interface ContainerProps extends PropsWithChildren {
	/** Section name, for `data-name` attribute. */
	strName: string;
}

const Container: FC<ContainerProps> = ({ children, strName }) => (
	<div className={cl("Container")} data-name={strName}>
		{children}
	</div>
);

const Description: FC<PropsWithChildren> = ({ children }) => (
	<div className={cl("Description")}>{children}</div>
);

const Footer: FC<PropsWithChildren> = ({ children }) => (
	<div className={cl("Footer")}>{children}</div>
);

const GridContainer: FC<PropsWithChildren> = ({ children }) => (
	<div className={cl("GridContainer")}>{children}</div>
);

const Header: FC<PropsWithChildren> = ({ children }) => (
	<div className={cl("Header")}>{children}</div>
);

interface ListItemProps {
	onClick: () => void;
	strImage?: string;
	strPrimaryText: string;
	strSecondaryText: string;
}

function ListItem(props: ListItemProps) {
	const { onClick, strImage, strPrimaryText, strSecondaryText } = props;

	return (
		<DialogButton
			className={cl("ListItem")}
			onClick={onClick}
			data-no-image={!strImage ? "" : undefined}
		>
			{strImage && (
				<img
					alt={strPrimaryText}
					className={cl("ListItem", "Image")}
					src={strImage}
				/>
			)}
			<div>
				<span className={cl("ListItem", "Primary")}>{strPrimaryText}</span>
				<span className={cl("ListItem", "Secondary")}>{strSecondaryText}</span>
			</div>
		</DialogButton>
	);
}

export const OverlayPanel = {
	Body,
	Button,
	Container,
	Description,
	Footer,
	GridContainer,
	Header,
	ListItem,
};
