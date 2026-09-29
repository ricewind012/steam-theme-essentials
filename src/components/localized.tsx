import { PanelSection } from "millennium";
import type { PropsWithChildren } from "react";

import { Localize } from "@/modules/localization";

interface LocalizedBaseProps {
	/**
	 * Localization token.
	 */
	strToken: string;
}

interface LocalizedPanelSectionProps
	extends LocalizedBaseProps,
		PropsWithChildren {}

export function LocalizedPanelSection(props: LocalizedPanelSectionProps) {
	const { strToken, children } = props;
	return <PanelSection title={Localize(strToken)}>{children}</PanelSection>;
}
