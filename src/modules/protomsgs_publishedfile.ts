import { EResult, findModuleExport } from "@steambrew/client";

import { FindModuleExportByString } from "@/utils/shared";

import { Config } from "./config";
import { CProtoBufMsg, type ProtoBufService_t } from "./protomsgs";

export interface PublishedFile {
	result: EResult;
	publishedfileid: string;
	creator: string;
	creator_appid: number;
	consumer_appid: number;
	consumer_shortcutid: number;
	filename: string;
	file_size: string;
	preview_file_size: string;
	file_url: string;
	preview_url: string;
	url: string;
	hcontent_file: string;
	hcontent_preview: string;
	title: string;
	short_description: string;
	time_created: number;
	time_updated: number;
	visibility: number;
	flags: number;
	workshop_file: boolean;
	workshop_accepted: boolean;
	show_subscribe_all: boolean;
	num_comments_public: number;
	banned: boolean;
	ban_reason: string;
	banner: string;
	can_be_deleted: boolean;
	app_name: string;
	file_type: number;
	can_subscribe: boolean;
	subscriptions: number;
	favorited: number;
	followers: number;
	lifetime_subscriptions: number;
	lifetime_favorited: number;
	lifetime_followers: number;
	lifetime_playtime: string;
	lifetime_playtime_sessions: string;
	views: number;
	image_width: number;
	image_height: number;
	num_children: number;
	num_reports: number;
	previews: object;
	tags: object;
	children: object;
	kvtags: object;
	vote_data: object;
	language: number;
	maybe_inappropriate_sex: boolean;
	maybe_inappropriate_violence: boolean;
	content_descriptorids: object;
	revision_change_number: string;
	revision: number;
	available_revisions: object;
	reactions: object;
	ban_text_check_result: number;
	author_snapshots: object;
}

const CPublishedFile_QueryFiles_Request = FindModuleExportByString(
	"CPublishedFile_QueryFiles_Request",
);

const PublishedFileService: ProtoBufService_t = findModuleExport(
	(e) => e.QueryFiles,
);

/**
 * Stolen from webpack module 39054, because usePopularGuidesQuery requires a
 * QueryClientProvider, and probably some other bullshit, and this function is
 * inlined, ty webpack
 *
 * @param appid The app ID to fetch guides for.
 */
export async function FetchPopularGuides(appid: number) {
	const vecDescriptorIDs =
		settingsStore.storePreferences.content_descriptor_preferences.content_descriptors_to_exclude.map(
			(e) => e.content_descriptorid,
		);
	const msg = CProtoBufMsg.Init(CPublishedFile_QueryFiles_Request);
	msg.Body().set_filetype(11);
	msg.Body().set_appid(appid);
	msg.Body().set_query_type(3);
	msg.Body().set_days(7);
	msg.Body().set_page(1);
	// Gets 10 for the purpose of getting them randomly
	msg.Body().set_numperpage(10);
	msg.Body().set_return_details(true);
	msg.Body().set_return_short_description(true);
	msg.Body().set_strip_description_bbcode(true);
	msg.Body().set_requiredtags([Config.LANGUAGE]);
	msg.Body().set_return_vote_data(true);
	msg.Body().set_cache_max_age_seconds(86400); // 1 day
	msg.Body().set_excluded_content_descriptors(vecDescriptorIDs);

	const pTransport = communityStore.CMInterface.GetServiceTransport();
	const pQueryMsg = await PublishedFileService.QueryFiles<any>(pTransport, msg);
	const eResult = pQueryMsg.GetEResult();
	if (eResult !== EResult.OK) {
		throw new Error(`FetchPopularGuides got result ${eResult}`);
	}

	const { publishedfiledetails } = pQueryMsg.Body().toObject();
	return publishedfiledetails as PublishedFile[];
}
