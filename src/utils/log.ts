import { PLUGIN_NAME } from "@/consts";

const LOG_STYLE = "padding: 0 1ch";
const SHOULD_LOG = true;

export class CLogger {
	private readonly m_strScope: string;

	constructor(strScope: string) {
		this.m_strScope = strScope;
	}

	private Print<T extends "error" | "log" | "warn">(
		strMethod: T,
		strFormat: string,
		...args: Parameters<Console[T]>
	) {
		if (!SHOULD_LOG) {
			return;
		}

		console[strMethod](
			`%c${PLUGIN_NAME}%c${this.m_strScope}%c ${strFormat}`,
			`${LOG_STYLE}; background-color: #5a6a50; color: #d8ded3`,
			`${LOG_STYLE}; background-color: #d8ded3; color: #5a6a50`,
			"",
			...args,
		);
	}

	// biome-ignore lint/suspicious/noExplicitAny: intentional
	Log(strFormat: string, ...args: any[]) {
		this.Print("log", strFormat, ...args);
	}

	// biome-ignore lint/suspicious/noExplicitAny: intentional
	Warn(strFormat: string, ...args: any[]) {
		this.Print("warn", strFormat, ...args);
	}

	// biome-ignore lint/suspicious/noExplicitAny: intentional
	Error(strFormat: string, ...args: any[]) {
		this.Print("error", strFormat, ...args);
	}

	// biome-ignore lint/suspicious/noExplicitAny: intentional
	Assert(bAssertion: boolean, strFormat: string, ...args: any[]) {
		if (bAssertion) {
			return;
		}

		this.Error(`Assertion failed: ${strFormat}`, ...args);
	}
}

export class CTimeLogger extends CLogger {
	private readonly m_strLabel: string;
	private m_unTimestamp: number;

	constructor(strScope: string, strLabel: string) {
		super(strScope);
		this.m_strLabel = strLabel;
	}

	TimeStart() {
		this.m_unTimestamp = Date.now();
	}

	TimeEnd() {
		const unCurrentDate = Date.now();
		this.Log(
			"%s: took %o seconds",
			this.m_strLabel,
			(unCurrentDate - this.m_unTimestamp) / 1_000,
		);
	}
}
