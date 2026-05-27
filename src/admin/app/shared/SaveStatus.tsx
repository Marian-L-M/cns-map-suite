import type { SaveStatusKind } from '../../../types';

interface Props {
	text: string;
	type: SaveStatusKind;
}

export default function SaveStatus( { text, type }: Props ) {
	if ( ! text ) return null;
	const cls = 'cns-save-status' + ( type ? ` cns-save-status--${ type }` : '' );
	return <span className={ cls }>{ text }</span>;
}
