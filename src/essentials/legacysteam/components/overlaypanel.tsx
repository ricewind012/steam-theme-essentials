import { DialogButton } from "@steambrew/client";
import type { FC, PropsWithChildren } from "react";

export const k_nPanelEntriesCount = 4;

const Body: FC<PropsWithChildren> = ({ children }) => (
	<div className="OverlayPanel_Body">{children}</div>
);

interface ContainerProps extends PropsWithChildren {
	/** Section name, for `data-name` attribute. */
	strName: string;
}

const Container: FC<ContainerProps> = ({ children, strName }) => (
	<div className="OverlayPanel_Container" data-name={strName}>
		{children}
	</div>
);

const Description: FC<PropsWithChildren> = ({ children }) => (
	<div className="OverlayPanel_Description">{children}</div>
);

const Footer: FC<PropsWithChildren> = ({ children }) => (
	<div className="OverlayPanel_Footer">{children}</div>
);

const GridContainer: FC<PropsWithChildren> = ({ children }) => (
	<div className="OverlayPanel_GridContainer">{children}</div>
);

const Header: FC<PropsWithChildren> = ({ children }) => (
	<div className="OverlayPanel_Header">{children}</div>
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
		<DialogButton className="OverlayPanel_ListItem" onClick={onClick}>
			{strImage && (
				<img
					alt={strPrimaryText}
					className="OverlayPanel_ListItem_Image"
					src={strImage}
				/>
			)}
			<div>
				<span className="OverlayPanel_ListItem_Primary">{strPrimaryText}</span>
				<span className="OverlayPanel_ListItem_Secondary">
					{strSecondaryText}
				</span>
			</div>
		</DialogButton>
	);
}

export const OverlayPanel = {
	Body,
	Container,
	Description,
	Footer,
	GridContainer,
	Header,
	ListItem,
};
