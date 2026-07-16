import { Button, SelectControl } from '@wordpress/components';
import { arrowLeft, external } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import type { PostStatus } from '../../types';

const STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
	{ value: 'draft',   label: 'Draft' },
	{ value: 'publish', label: 'Published' },
	{ value: 'private', label: 'Private' },
];

interface Props {
	pageTitle: string;
	overviewUrl: string;
	viewUrl: string;
	status: PostStatus;
	onStatusChange: ( status: PostStatus ) => void;
	isSaving: boolean;
	onSave: () => void;
}

export default function EditorHeader( { pageTitle, overviewUrl, viewUrl, status, onStatusChange, isSaving, onSave }: Props ) {
	return (
		<div className="cns-map-editor__header">
			<Button
				href={ overviewUrl }
				variant="tertiary"
				icon={ arrowLeft }
			>
				{ __( 'All Maps', 'cns-map-suite' ) }
			</Button>
			<h1>{ pageTitle }</h1>
			<div className="cns-map-editor__header-actions">
				{ viewUrl && (
					<Button
						href={ viewUrl }
						variant="secondary"
						icon={ external }
						target="_blank"
					>
						{ __( 'View Map', 'cns-map-suite' ) }
					</Button>
				) }
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Post status', 'cns-map-suite' ) }
					hideLabelFromVision
					value={ status }
					options={ STATUS_OPTIONS }
					onChange={ ( v ) => onStatusChange( v as PostStatus ) }
				/>
				<Button
					variant="primary"
					isBusy={ isSaving }
					disabled={ isSaving }
					onClick={ onSave }
				>
					{ __( 'Save Map', 'cns-map-suite' ) }
				</Button>
			</div>
		</div>
	);
}
