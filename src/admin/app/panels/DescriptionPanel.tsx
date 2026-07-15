import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const EDITOR_ID = 'cns-map-description';

interface Props {
	value: string;
	onChange: ( html: string ) => void;
}

interface TinyMceEditor {
	on( events: string, handler: () => void ): void;
	getContent(): string;
}

/**
 * Rich-text map description, edited with the classic (TinyMCE) editor —
 * wp_enqueue_editor() provides it on the map editor page. The textarea is
 * uncontrolled: TinyMCE owns the DOM, and edits stream back into the map
 * settings state via editor events (Visual) / the input event (Text mode).
 * The panel unmounts on tab switch, so the instance is torn down and
 * re-initialized with the latest value each time the tab opens.
 */
export default function DescriptionPanel( { value, onChange }: Props ) {
	const onChangeRef   = useRef( onChange );
	onChangeRef.current = onChange;

	useEffect( () => {
		const ed = window.wp?.oldEditor || window.wp?.editor;
		const textarea = document.getElementById( EDITOR_ID ) as HTMLTextAreaElement | null;

		// Text-mode (Quicktags) edits land directly in the textarea.
		const onInput = () => onChangeRef.current( textarea?.value ?? '' );
		textarea?.addEventListener( 'input', onInput );

		if ( ed?.initialize ) {
			ed.initialize( EDITOR_ID, {
				tinymce: {
					wpautop: true,
					height: 320,
					toolbar1:
						'formatselect,bold,italic,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,undo,redo',
					setup( editor: TinyMceEditor ) {
						// No SetContent here — it fires during init and would
						// mark the settings dirty before any user edit.
						editor.on( 'change keyup input Undo Redo', () => {
							onChangeRef.current( editor.getContent() );
						} );
					},
				},
				quicktags: true,
				mediaButtons: true,
			} );
		}

		return () => {
			textarea?.removeEventListener( 'input', onInput );
			ed?.remove?.( EDITOR_ID );
		};
	}, [] );

	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="description" role="tabpanel">
			<div className="cns-desc-editor">
				<p className="description">
					{ __(
						'Shown beneath the map on its own page and wherever the map block is embedded. Not shown where the map is only used as a base (e.g. stories, master-map regions).',
						'cns-map-suite'
					) }
				</p>
				<textarea id={ EDITOR_ID } rows={ 14 } defaultValue={ value } />
			</div>
		</div>
	);
}
