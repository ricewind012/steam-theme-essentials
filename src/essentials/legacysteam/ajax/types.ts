interface AjaxPartnerEvent {
	gid: string;
	clan_steamid: string;
	event_name: string;
	event_type: number;
	appid: number;
	server_address: null;
	server_password: null;
	rtime32_start_time: number;
	rtime32_end_time: number;
	comment_count: number;
	creator_steamid: string;
	last_update_steamid: string;
	event_notes: string;
	jsondata: string;
	announcement_body: {
		gid: string;
		clanid: string;
		posterid: string;
		headline: string;
		posttime: number;
		updatetime: number;
		body: string;
		commentcount: number;
		tags: string[];
		language: number;
		hidden: number;
		forum_topic_id: string;
		event_gid: string;
		voteupcount: number;
		votedowncount: number;
		ban_check_result: number;
		banned: number;
	};
	published: number;
	hidden: number;
	rtime32_visibility_start: number;
	rtime32_visibility_end: number;
	broadcaster_accountid: number;
	follower_count: number;
	ignore_count: number;
	forum_topic_id: string;
	rtime32_last_modified: number;
	news_post_gid: string;
	rtime_mod_reviewed: number;
	featured_app_tagid: number;
	referenced_appids: number[];
	build_id: number;
	build_branch: string;
	unlisted: number;
	rtime_created: number;
	votes_up: number;
	votes_down: number;
	comment_type: string;
	gidfeature: string;
	gidfeature2: string;
	clan_steamid_original: string;
}

export interface AjaxGetPartnerEventsPageableResult {
	events: AjaxPartnerEvent[];
}
