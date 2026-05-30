import type { EssentialName_t } from "@/settings";

import { CAeroThemeEssential } from "./aerothemesteam";
import type { CThemeEssentialBase } from "./base";

export const pEssentialController = new (class {
	private m_mapEssentials = new Map<EssentialName_t, CThemeEssentialBase>([
		["aerothemesteam", new CAeroThemeEssential()],
	]);

	/**
	 * @returns all the currently active essentials.
	 */
	GetActive() {
		return this.m_mapEssentials.values().filter((e) => e.IsEnabled());
	}

	/**
	 * @returns the given name's essential.
	 */
	Get(strName: EssentialName_t) {
		return this.m_mapEssentials.get(strName);
	}
})();
