/* global wp */
export default function SaveStatus( { text, type } ) {
	if ( ! text ) return null;
	const cls = 'cns-save-status' + ( type ? ` cns-save-status--${ type }` : '' );
	return <span className={ cls }>{ text }</span>;
}
