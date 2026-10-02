// Declared by compiler
declare const pluginName: string;

type LogParams_t = Parameters<Console["log"]>;

const LOG_STYLE = "padding: 0 1ch";
const PLUGIN_NAME = pluginName;
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

	Assert(bAssertion: boolean, strFormat: string, ...args: LogParams_t) {
		if (bAssertion) {
			return;
		}

		this.Error(`Assertion failed: ${strFormat}`, ...args);
	}

	Error(strFormat: string, ...args: LogParams_t) {
		this.Print("error", strFormat, ...args);
	}

	Log(strFormat: string, ...args: LogParams_t) {
		this.Print("log", strFormat, ...args);
	}

	Warn(strFormat: string, ...args: LogParams_t) {
		this.Print("warn", strFormat, ...args);
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
		const unSec = (Date.now() - this.m_unTimestamp) / 1_000;
		this.Log("%s: took %o seconds", this.m_strLabel, unSec);
	}
}
