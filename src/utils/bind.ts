/**
 * Decorate a class method with this to make sure the method is always invoked
 * in the context of the object instance it's declared in.
 *
 * @example
 * ```ts
 * \@bind onTextInput( event ) { ... }
 *
 * render() {
 *     return <input OnInput={ this.onTextInput } />;
 * }
 * ```
 */
export function bind(
	_target: object,
	propertyKey: PropertyKey,
	descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
): TypedPropertyDescriptor<(...args: any[]) => any> {
	return {
		get() {
			const value = descriptor.value.bind(this);
			if (!Object.hasOwn(this, propertyKey)) {
				Object.defineProperty(this, propertyKey, { value });
			}
			return value;
		},
	};
}
