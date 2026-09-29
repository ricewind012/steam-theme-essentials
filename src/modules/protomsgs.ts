import { type EResult, findModuleExport } from "millennium";

export type ProtoBufService_t = Record<
	string,
	<T>(transport: any, msg: any) => Promise<CBaseProtoBufMsg<T>>
>;

interface CBaseProtoBufMsg<T> {
	BIsValid(): boolean;
	Body(): {
		toObject(): T;
	} & {
		[K in keyof T as `set_${string & K}`]: (value: T[K]) => void;
	};
	BSuccess(): boolean;
	/**
	 * @see https://github.com/SteamDatabase/SteamTracking/blob/master/Protobufs/enums_clientserver.proto#L4
	 */
	GetEMsg(): number;
	GetEResult(): EResult;
	GetErrorMessage(): string;
}

interface CProtoBufMsg {
	Init<T>(proto: T): CBaseProtoBufMsg<T>;
}

export const CProtoBufMsg: CProtoBufMsg = findModuleExport(
	(e) => e.InitFromPacket,
);
