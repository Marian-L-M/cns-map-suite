import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardMedia,
	CardFooter,
	Flex,
	FlexBlock,
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import { image, pencil, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import type { ComponentType } from 'react';
import type { MediaAttachment } from '../../../types';

interface Props {
	imageId: number;
	imageUrl: string;
	label?: string;
	title?: string;
	onChange: ( attachment: MediaAttachment | null ) => void;
}

// The published types for MediaUpload declare its props as an untyped class
// component, so we re-type the render-prop surface we actually use.
interface MediaUploadProps {
	title?: string;
	allowedTypes?: string[];
	multiple?: boolean;
	value?: number;
	onSelect: ( attachment: { id: number; url: string } ) => void;
	render: ( props: { open: () => void } ) => JSX.Element;
}
const Media = MediaUpload as unknown as ComponentType< MediaUploadProps >;

export default function MediaPicker( {
	imageId,
	imageUrl,
	title,
	label,
	onChange,
}: Props ) {
	return (
		<Card className="cns-image-picker">
			{ label && <CardHeader> { label }</CardHeader> }
			{ imageUrl ? (
				<CardMedia>
					<img src={ imageUrl } alt="" />
				</CardMedia>
			) : (
				<CardBody>
					{ __( 'No image selected', 'cns-map-suite' ) }
				</CardBody>
			) }

			<CardFooter>
				<Flex gap={ 2 } align="center" justify="start">
					<FlexBlock
						style={ { width: 'fit-content', flex: 'unset' } }
					>
						<Media
							title={ title }
							allowedTypes={ [ 'image' ] }
							multiple={ false }
							value={ imageId }
							onSelect={ ( att ) =>
								onChange( { id: att.id, url: att.url } )
							}
							render={ ( { open } ) => (
								<Button
									variant="secondary"
									icon={ imageId > 0 ? pencil : image }
									label={
										imageId > 0
											? __(
													'Replace image',
													'cns-map-suite'
											  )
											: __(
													'Select image',
													'cns-map-suite'
											  )
									}
									onClick={ open }
								/>
							) }
						/>
					</FlexBlock>
					{ imageId > 0 && (
						<FlexBlock
							style={ { width: 'fit-content', flex: 'unset' } }
						>
							<Button
								variant="tertiary"
								isDestructive
								icon={ trash }
								label={ __( 'Remove image', 'cns-map-suite' ) }
								onClick={ () => onChange( null ) }
							/>
						</FlexBlock>
					) }
				</Flex>
			</CardFooter>
		</Card>
	);
}
