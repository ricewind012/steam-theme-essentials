import { findModuleExport, Millennium } from "millennium";

export const FindModuleExportByString = (s: string) =>
	findModuleExport((e) => e.toString?.().includes(s));

export const GetUnixTime = () => Math.floor(Date.now() / 1_000);

export const LocalizeRtime32ToShortDate = (dt: number) =>
	new Date(dt * 1000).toLocaleDateString();

export const RandomArrayElement = <T>(vec: T[]) =>
	vec[Math.floor(Math.random() * vec.length)];

export const WaitForElement = async (sel: string, parent = document) =>
	[...(await Millennium.findElement(parent, sel))][0];
