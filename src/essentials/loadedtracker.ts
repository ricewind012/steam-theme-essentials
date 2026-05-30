import type { EssentialName_t } from "@/settings";
import { CTrackedTargetValues } from "@/utils/trackers";

/**
 * Tracker for essentials in a given document - in case one of the essential's
 * part fails, the `data-loaded-essentials` attribute will be gone.
 */
class CTrackedDocumentEssentials extends CTrackedTargetValues<
	Document,
	EssentialName_t
> {
	OnChange(target: Document) {
		const { dataset } = target.documentElement;
		const value = [...this.Get(target)].join(" ");
		if (value === "") {
			delete dataset.loadedEssentials;
		} else {
			dataset.loadedEssentials = value;
		}
	}
}

export const pLoadedEssentials = new CTrackedDocumentEssentials();
