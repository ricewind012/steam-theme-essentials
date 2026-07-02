import { Field, type FieldProps, TextField, Toggle } from "@steambrew/client";
import {
	type ChangeEventHandler,
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";

import { pEssentialController } from "@/essentials/controller";
import { Localize } from "@/modules/localization";
import {
	type EssentialName_t,
	GetSettings,
	SetSettingsKey,
	type Settings_t,
} from "@/settings";

import { LocalizedPanelSection } from "./localized";

type EssentialControlsType_t = "boolean" | "number" | "string";

const SettingsContext = createContext<Settings_t>(null);

const EssentialPanelSectionContent: Record<EssentialName_t, () => ReactNode> = {
	aerothemesteam: () => {
		const pEssential = pEssentialController.Get("aerothemesteam");

		return (
			<EssentialField
				fieldProps={{ bottomSeparator: "thick" }}
				strName="aerothemesteam"
				strField="bEnabled"
				onChange={(value) => {
					if (value) {
						pEssential.OnMount();
					} else {
						pEssential.OnDismount();
					}
				}}
			/>
		);
	},
	legacysteam: () => {
		const pEssential = pEssentialController.Get("legacysteam");

		return (
			<EssentialField
				fieldProps={{ bottomSeparator: "thick" }}
				strName="legacysteam"
				strField="bEnabled"
				onChange={(value) => {
					if (value) {
						pEssential.OnMount();
					} else {
						pEssential.OnDismount();
					}
				}}
			/>
		);
	},
};

interface EssentialControlProps<
	T extends EssentialName_t,
	F extends Exclude<keyof Settings_t[T], symbol>,
> {
	onChange: (value: Settings_t[T][F]) => void;
	strField: F;
	strName: T;
}

// Type checking is disabled for onChange values, because I don't think this is
// possible to do, but what do I know...
const EssentialControls: Record<
	EssentialControlsType_t,
	<T extends EssentialName_t, F extends Exclude<keyof Settings_t[T], symbol>>(
		props: EssentialControlProps<T, F>,
	) => ReactNode
> = {
	boolean(props) {
		const { strField, strName } = props;
		const ctx = useContext(SettingsContext);
		const [value, setValue] = useState(ctx[strName][strField] as boolean);
		const onChange = (value: never) => {
			props.onChange(value);
			SetSettingsKey(strName, strField, value);
			setValue(value);
		};

		return <Toggle value={value} onChange={onChange} />;
	},
	number(props) {
		const { strField, strName } = props;
		const pSettings = useContext(SettingsContext);
		const [value, setValue] = useState(pSettings[strName][strField] as number);
		const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
			const value = Number(ev.target.value) as never;
			if (!Number.isFinite(value)) {
				return;
			}

			props.onChange(value);
			SetSettingsKey(strName, strField, value);
			setValue(value);
		};

		return (
			<TextField mustBeNumeric value={value.toString()} onChange={onChange} />
		);
	},
	string(props) {
		const { strField, strName } = props;
		const pSettings = useContext(SettingsContext);
		const [value, setValue] = useState(pSettings[strName][strField] as string);
		const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
			const value = ev.target.value as never;
			props.onChange(value);
			SetSettingsKey(strName, strField, value);
			setValue(value);
		};

		return <TextField value={value} onChange={onChange} />;
	},
};

interface EssentialFieldProps<
	T extends EssentialName_t,
	F extends Exclude<keyof Settings_t[T], symbol>,
> extends EssentialControlProps<T, F> {
	fieldProps?: FieldProps;
}

function EssentialField<
	T extends EssentialName_t,
	F extends Exclude<keyof Settings_t[T], symbol>,
>(props: EssentialFieldProps<T, F>) {
	const { fieldProps, onChange, strField, strName } = props;
	const label = Localize(`#EssentialSettings_${strName}_${strField}`);

	const pSettings = useContext(SettingsContext);
	const eType = typeof pSettings[strName][strField] as EssentialControlsType_t;
	const Component = EssentialControls[eType];

	return (
		<Field {...fieldProps} focusable label={label}>
			<Component onChange={onChange} strField={strField} strName={strName} />
		</Field>
	);
}

interface EssentialPanelSectionProps {
	strName: EssentialName_t;
}

function EssentialPanelSection(props: EssentialPanelSectionProps) {
	const { strName } = props;
	const Content = EssentialPanelSectionContent[strName];

	return (
		<LocalizedPanelSection strToken={`#EssentialSettings_${strName}`}>
			<Content />
		</LocalizedPanelSection>
	);
}

export function SettingsPanel() {
	const pSettings = GetSettings();
	const vecEssentials = Object.keys(pSettings) as EssentialName_t[];

	return (
		<SettingsContext value={pSettings}>
			{vecEssentials.map((e) => (
				<EssentialPanelSection key={e} strName={e} />
			))}
		</SettingsContext>
	);
}
