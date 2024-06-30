import { MediaUpload } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import React, { useState } from 'react';

const ALLOWED_MEDIA_TYPES = ['image'];

const Image = ({ onSelectImage }) => {
    const [mediaId, setMediaId] = useState(null);

    const handleSelect = (media) => {
        console.log('selected media:', media);
        setMediaId(media.id);
        if (onSelectImage) {
            onSelectImage(media);
        }
    };

    return (
        <div className="photo-uploader">
            {mediaId}
                <MediaUpload
                    onSelect={handleSelect}
                    allowedTypes={ALLOWED_MEDIA_TYPES}
                    value={mediaId}
                    render={({ open }) => (
                        <Button onClick={open}>Open Media Library</Button>
                    )}
                />
        </div>
    );
};

export default Image;