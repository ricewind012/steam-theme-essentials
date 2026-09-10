import { findModuleByExport } from "@steambrew/client";
import type { ReactNode } from "react";

const mod = findModuleByExport((e) =>
	e.toString().includes("LocalizeStringFromFallback"),
);

/**
 * Replaces `%1$s`, `%2$s`, etc. in a localization string with provided arguments.
 */
export const Localize: (
	strToken: string,
	...args: (string | number)[]
) => string = Object.values<any>(mod).find((e) =>
	e.toString().match(/LocalizeString\([\w$]+\);return/),
);

/**
 * Uses the specified localization token and React elements to create a formatted, localized string. The localization token is parsed
 * for matching <#> ... </#> segments, and the text from those segments is set as the children of each matching arg parameter.
 *
 * Example token:
 * 		"TestToken": "Press the <1>Enter</1> Button"
 * Can be used with:
 * 		let str = LocalizeInlineReact( '#TestToken', <span style={ {color: 'red'} } /> ) }
 */
export const LocalizeInlineReact: (
	strToken: string,
	...nodes: ReactNode[]
) => ReactNode = Object.values<any>(mod).find((e) =>
	e.toString().includes("cloneElement"),
);
