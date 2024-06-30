import { __ } from '@wordpress/i18n';
// import React, { useEffect, useState } from 'react';
// import { Card, Col, Container, Row } from 'react-bootstrap';
// const useEffect = wp.element.useState;
// const useState = wp.element.useState;
// import Logo from '../assets/images/logo.svg';
import { MediaUpload } from '@wordpress/block-editor';
import { Button, Notice } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import noImageAvailable from '../assets/images/no_image_available.png';
const nonce = document.getElementById('nonce-field');
export default function Settings(props) {

    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [options, setOptions] = useState({});
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        /**
         * Initialize the options fields with the data received from the REST API
         * endpoint provided by the plugin.
         */
        wp.apiFetch({path: '/store_banner/v1/options'}).
        then(data => {
                let options = {};
                //Set the new values of the options in the state
                setOption1(data['plugin_option_1'])
                setOption2(data['plugin_option_2'])
                setOptions(data['programmelab_store_banner'])
            },
        );
    }, []);
    useEffect(() => {
        if (Object.keys(options).length) {
            setLoading(false);
        }
    }, [options]);
    const handleOptionsChange = (key, value) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [key]: value
        }));
        // console.log(options);
    };

    const handleNestedOptionsChange = (key, subKey, value) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [key]: {
                ...prevOptions[key],
                [subKey]: value
            }
        }));
    };
    const onSelect = (media) => {
        setImage(media);
        if (onSelectImage) {
            onSelectImage(media);
        }
    };

    const removeImage = () => {
        setImage(null);
        if (onSelectImage) {
            onSelectImage(null);
        }
    };
    return (
        <section className="settings-page-wrap">
            <Container fluid="fluid">
                <div className="content-part">
                    <Row className="justify-content-lg-center">
                        <Col className="col-lg-8">
                            <div className="settings-box">
                                <div className="d-flex">
                                    <div className="nav-area">
                                        <ul className="options-menu d-flex flex-column">
                                            <li>
                                                <a href="#" className="store-banner-nav-tab nav-tab-active">Banner</a>
                                                <ul>
                                                    <li><a href="#">Product Page</a></li>
                                                    <li><a href="#">Shop Page</a></li>
                                                    <li><a href="#">Checkout Page</a></li>
                                                    <li><a href="#">Cart Page</a></li>
                                                </ul>
                                            </li>
                                            <li className="mt-auto">
                                                <a href="#" className="store-banner-nav-tab">Settings</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="options-area d-flex flex-column">
                                        {/* {console.log(Object.keys(options).length)} */}
                                        {/* {console.log(loading)} */}
                                        {/* <Card>
                                            <Card.Header>Card Header</Card.Header>
                                            <Card.Title>Card Title</Card.Title>
                                            <Card.Subtitle>Card Subtitle</Card.Subtitle>
                                            <Card.Body>Card Body</Card.Body>
                                            <Card.Link>Card Link</Card.Link>
                                            <Card.Text>Card Text</Card.Text>
                                            <Card.Img src={Logo} />
                                            <Card.Footer>Card Footer</Card.Footer>
                                        </Card> */}  
                                            {
                                            loading
                                            ?<div className="page-loader" />
                                            :<>
                                                <div className="options">
                                                    
                                                    <div className="store-banner-setting-unit">
                                                        <div className="switch-setting-unit">
                                                            <div className="title-wrap">
                                                                <label>
                                                                    <span>Shop</span>
                                                                    <span className="hints-css hint--bottom" aria-label="Enable banner option for shop page."><i className="dashicons dashicons-editor-help"></i></span>
                                                                </label>
                                                                <div className="description"><p>Choose a banner for the shop page that best aligns with your current marketing goals and target audience.</p></div>
                                                            </div>
                                                            <div className="position-relative switcher">
                                                                <label htmlFor="enable_shop_page">
                                                                    <input 
                                                                    type="checkbox" 
                                                                    name="_enable_shop_page" 
                                                                    id="enable_shop_page" 
                                                                    value="1"
                                                                    checked={options?._enable_shop_page ? 'checked' : ''}
                                                                    onChange = {(event) => handleOptionsChange('_enable_shop_page', event.target.checked)}
                                                                    />
                                                                        <em data-on="on" data-off="off"></em>
                                                                        <span></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="store-banner-setting-unit store-banner-setting-sub-unit">
                                                        <div className="image-uploader-unit">
                                                            <div className="title-wrap">
                                                                <label>
                                                                    <span>Banner Image</span>
                                                                    <span className="hints-css hint--bottom" aria-label="Enable banner option for shop page."><i className="dashicons dashicons-editor-help"></i></span>
                                                                </label>
                                                            </div>
                                                            <div className="position-relative store_banner_image">
                                                                <div className="image-uploader">
                                                                    <div
                                                                        className={
                                                                            [
                                                                                'file-name',
                                                                                options?._shop_page_banner_internal_image?.id ? 'with-close-button' : ''
                                                                            ].join(" ")
                                                                        }
                                                                    >
                                                                        {
                                                                            options?._shop_page_banner_internal_image?.id ?
                                                                            <>
                                                                            <span className="gallery" data-fancybox="gallery-rand" data-src={options._shop_page_banner_internal_image.url}>
                                                                                <img src={options._shop_page_banner_internal_image.thumbnail} className="option-image" />
                                                                            </span>
                                                                            <span 
                                                                                className="store-banner-remove-image" 
                                                                                data-base={noImageAvailable}

                                                                                ></span>
                                                                            </>
                                                                            :
                                                                            <span className="gallery">
                                                                                <img src={noImageAvailable} className="option-image" />
                                                                            </span>

                                                                        }
                                                                        
                                                                        
                                                                    </div>
                                                                    <div className="file-detail">
                                                                        <input
                                                                            type="hidden"
                                                                            className="url"
                                                                            value={options._shop_page_banner_internal_image?.url || ''}
                                                                            onChange={(event) => handleNestedOptionsChange('_shop_page_banner_internal_image', 'url', event.target.value)}
                                                                        />
                                                                        <input
                                                                            type="hidden"
                                                                            className="thumbnail"
                                                                            value={options._shop_page_banner_internal_image?.thumbnail || ''}
                                                                            onChange={(event) => handleNestedOptionsChange('_shop_page_banner_internal_image', 'thumbnail', event.target.value)}
                                                                        />
                                                                        <input
                                                                            type="hidden"
                                                                            className="id"
                                                                            value={options._shop_page_banner_internal_image?.id || ''}
                                                                            onChange={(event) => handleNestedOptionsChange('_shop_page_banner_internal_image', 'id', event.target.value)}
                                                                        />
                                                                        <div className="upload-help-text">
                                                                            <p>Size: Optional <br /> File Support: .jpg, .jpeg, .gif, or .png.</p>
                                                                        </div>
                                                                        <button className="button button-primary image-uploader-button single-image-uploader-button">Upload Image</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                    <div>
                                                        <label>Banner Image URL</label>
                                                        <input
                                                            value={options._shop_page_banner_internal_image?.url || ''}
                                                            onChange={(event) => handleNestedOptionsChange('_shop_page_banner_internal_image', 'url', event.target.value)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label>Options 1</label>
                                                        <input
                                                        value={option1}
                                                        onChange={(event) => {
                                                        setOption1(event.target.value);
                                                        }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>Options 2</label>
                                                        <input
                                                        value={option2}
                                                        onChange={(event) => {
                                                        setOption2(event.target.value);
                                                        }}
                                                        />
                                                    </div>

                                                    <div className="photo-uploader">
                                                        {error && (
                                                            <Notice status="error" onRemove={() => setError('')}>
                                                                {error}
                                                            </Notice>
                                                        )}
                                                        {image ? (
                                                            <div className="photo-preview">
                                                                <img src={image.url} alt={image.alt} />
                                                                <Button isSecondary onClick={removeImage}>
                                                                    Remove Image
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            
                                                                <MediaUpload
                                                                    onSelect={onSelect}
                                                                    allowedTypes={['image']}
                                                                    value={image ? image.id : ''}
                                                                    render={({ open }) => (
                                                                        <Button isPrimary onClick={open}>
                                                                            Upload Image
                                                                        </Button>
                                                                    )}
                                                                />
                                                            
                                                        )}
                                                    </div>
                                                    
                                                </div>                                      
                                                
                                                <div className="save-button mt-auto">
                                                    <button onClick={() => {

                                                    wp.apiFetch({
                                                        path: '/store_banner/v1/options',
                                                        method: 'POST',
                                                        data: {
                                                        'plugin_option_1': option1,
                                                        'plugin_option_2': option2,
                                                        'programmelab_store_banner': options
                                                        },
                                                    }).then(data => {
                                                        alert('Options saved successfully!');
                                                    });

                                                    }}>{__('Save settings', 'store-banner')}
                                                    </button>

                                                </div>
                                        </>
                                        }

                                        
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    )
}
