import { useState } from '@wordpress/element';

interface Props {
	id?: string;
	min: number;
	max: number;
	step: number;
	value: number;
	onChange: ( value: number ) => void;
}

/**
 * Slider + number-input pair — the one control used for every range value in
 * the editor. The number input keeps a local draft while typing so
 * intermediate states ("", "0.") don't snap back before they parse.
 */
export default function RangeField( { id, min, max, step, value, onChange }: Props ) {
	const [ draft, setDraft ] = useState< string | null >( null );

	const decimals = ( String( step ).split( '.' )[ 1 ] || '' ).length;
	const display  = draft ?? String( Number( value.toFixed( decimals ) ) );

	function commit( raw: string ) {
		const parsed = parseFloat( raw );
		if ( ! Number.isNaN( parsed ) ) {
			onChange( Math.min( max, Math.max( min, parsed ) ) );
		}
	}

	return (
		<div className="cns-range-wrap">
			<input
				id={ id }
				type="range"
				min={ min } max={ max } step={ step }
				value={ value }
				onChange={ ( e ) => {
					setDraft( null );
					onChange( parseFloat( e.target.value ) );
				} }
			/>
			<input
				type="number"
				className="small-text cns-range-number"
				min={ min } max={ max } step={ step }
				value={ display }
				aria-label="Exact value"
				onChange={ ( e ) => {
					setDraft( e.target.value );
					commit( e.target.value );
				} }
				onBlur={ () => setDraft( null ) }
			/>
		</div>
	);
}
