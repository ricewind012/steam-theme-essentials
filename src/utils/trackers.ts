export abstract class CTrackedTargetValues<T, V> {
	private m_mapTargets = new Map<T, Set<V>>();
	private m_setForbiddenTargets = new Set<T>();

	Add(target: T, value: V) {
		const bIsForbidden = this.IsForbidden(target);
		if (bIsForbidden) {
			console.warn("trying to add", target, this);
			return;
		}

		this.Get(target).add(value);
		this.OnChange(target);
	}

	private EnsureInMap(target: T) {
		if (!this.m_mapTargets.get(target)) {
			this.m_mapTargets.set(target, new Set());
		}
	}

	protected Get(target: T) {
		this.EnsureInMap(target);
		return this.m_mapTargets.get(target);
	}

	private IsForbidden(target: T) {
		return this.m_setForbiddenTargets.has(target);
	}

	/**
	 * Disposed on adding/removing values from the map.
	 */
	protected abstract OnChange(target: T): void;

	Remove(target: T, value: V) {
		const bIsForbidden = this.IsForbidden(target);
		if (bIsForbidden) {
			console.warn("trying to remove", target, this);
			return;
		}

		this.Get(target).delete(value);
		this.OnChange(target);
	}

	/**
	 * Stops and forbids tracking the given target.
	 */
	StopTracking(target: T) {
		for (const value of this.Get(target)) {
			this.Remove(target, value);
		}
		this.m_setForbiddenTargets.add(target);
	}
}
