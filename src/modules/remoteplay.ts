import { FindModuleExportByString } from "@/utils/shared";

export const GetAppMobileCategories: (
	overview: any,
) => Array<"phone" | "tablet"> = FindModuleExportByString(
	"of e.store_category",
);
