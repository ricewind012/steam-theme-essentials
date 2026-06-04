import type { Unregisterable } from "@steambrew/client";
import { useEffect } from "react";

// TODO: useEffectEvent with React 19.2
// biome-ignore lint/suspicious/noConfusingVoidType: See below
function useSteamRegistrar<T extends (...args: any[]) => Unregisterable | void>(
	handle: T,
) {
	useEffect(() => {
		// Some functions like User.RegisterForCurrentUserChanges do not return
		// anything... vaaaalve
		return handle?.unregister;
	}, []);
}

/**
 * Hook that fires when the offline mode state changes.
 */
export function useOfflineMode(callback: (bIsOfflineMode: boolean) => void) {
	useSteamRegistrar(
		SteamClient.User.RegisterForCurrentUserChanges((ev) => {
			callback(ev.bIsOfflineMode);
		}),
	);
}
