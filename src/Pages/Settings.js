// import React, { useEffect, useState } from 'react';
// import { Card, Col, Container, Row } from 'react-bootstrap';
// const useEffect = wp.element.useState;
// const useState = wp.element.useState;
// import Logo from '../assets/images/logo.svg';
import { MediaUpload } from '@wordpress/block-editor';
import { Button, Notice, SelectControl, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
const nonce = document.getElementById('nonce-field');
export default function Settings(props) {

    // const [option1, setOption1] = useState('');
    const [options, setOptions] = useState({});
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [image, setImage] = useState(null);
    const [mediaId, setMediaId] = useState(null);


    useEffect(() => {
        /**
         * Initialize the options fields with the data received from the REST API
         * endpoint provided by the plugin.
         */
        wp.apiFetch({path: '/store_banner/v1/options'}).
        then(data => {
                let options = {};
                //Set the new values of the options in the state
                // setOption1(data['plugin_option_1'])
                // setOption2(data['plugin_option_2'])
                setOptions(data['programmelab_store_banner'])
            },
        );
    }, []);
    useEffect(() => {
        if (Object.keys(options).length) {
            setLoading(false);
        }
    }, [options]);

    const updateField = (path, value) => {
        const keys = path.split('.');
        let tempData = { ...options };

        keys.reduce((acc, key, index) => {
            if (index === keys.length - 1) {
                acc[key] = value;
            } else {
                if (!acc[key]) acc[key] = {};
                return acc[key];
            }
        }, tempData);

        setOptions(tempData);

        wp.apiFetch({
            path: '/store_banner/v1/options',
            method: 'POST',
            data: {
                'programmelab_store_banner': options
            },
        }).then(data => {
            console.log('Options saved successfully!');
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(options);
        wp.apiFetch({
            path: '/store_banner/v1/options',
            method: 'POST',
            data: {
                'programmelab_store_banner': options
            },
        }).then(data => {
            alert('Options saved successfully!');
        });
    };
    const ALLOWED_MEDIA_TYPES = ['image'];
    const handleSelect = (media) => {
        //console.log('selected media:', media);
        setMediaId(media.id);
        setImage(media);
    };
    /*const onSelect = (media) => {
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
    };*/
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
                                            <form onSubmit={handleSubmit}>
                                                <div className="options">
                                                
                                                    {/* {console.log(options)} */}
                                                    {error && (
                                                        <Notice status="error" onRemove={() => setError('')}>
                                                            {error}
                                                        </Notice>
                                                    )}
                                                    {success && (
                                                        <Notice status="success" onRemove={() => setSuccess('')}>
                                                            {success}
                                                        </Notice>
                                                    )}
                                                    <div className="store-banner-setting-unit">
                                                        <div className="switch-setting-unit">
                                                            <div className="title-wrap">
                                                                <label>
                                                                    <span>{__('Shop', 'store-banner')}</span>
                                                                    <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                </label>
                                                                <div className="description"><p>{__('Choose a banner for the shop page that best aligns with your current marketing goals and target audience.', 'store-banner')}</p></div>
                                                            </div>
                                                            <div className="position-relative switcher">
                                                                <label htmlFor="shop_page_enable">
                                                                    <input 
                                                                    id="shop_page_enable"
                                                                    type="checkbox" 
                                                                    value="1"
                                                                    checked={options?._shop_page?._enable}
                                                                    onChange = {(event) => updateField('_shop_page._enable', event.target.checked)}
                                                                    />
                                                                        <em data-on="on" data-off="off"></em>
                                                                        <span></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="store-banner-setting-unit store-banner-setting-sub-unit">
                                                        <div className="wrapper">
                                                            <Row>
                                                                <Col className="col-lg-6">
                                                                    Image Preview {mediaId} {image?.url}
                                                                    <Image src={options._shop_page._banner_internal_image.thumbnail}/>
                                                                </Col>
                                                                <Col>
                                                                <MediaUpload
                                                                    onSelect={handleSelect}
                                                                    onChange={console.log(image)}
                                                                    onChange = {(image) => {
                                                                        updateField('_shop_page._banner_internal_image.url', image.url)
                                                                        updateField('_shop_page._banner_internal_image.thumbnail', image.sizes.thumbnail.url)
                                                                        updateField('_shop_page._banner_internal_image.id', image.id)
                                                                        // setImage('');
                                                                    }}
                                                                    allowedTypes={ALLOWED_MEDIA_TYPES}
                                                                    value={mediaId}
                                                                    render={({ open }) => (
                                                                        <Button onClick={open}>Open Media Library</Button>
                                                                    )}
                                                                />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col className="col-lg-6">
                                                                    <div className="text-setting-unit">
                                                                        <div className="title-wrap">
                                                                            <label>
                                                                                <span>{__('Upload from an URL', 'store-banner')}</span>
                                                                                <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="position-relative">
                                                                            <TextControl
                                                                                className="input-control"
                                                                                placeholder= {__('Add the URL here', 'store-banner')}
                                                                                value={options?._shop_page?._banner_external_image?._url}
                                                                                onChange={(value) => updateField('_shop_page._banner_external_image._url', value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col className="col-lg-6">
                                                                    <div className="text-setting-unit">
                                                                        <div className="title-wrap">
                                                                            <label>
                                                                                <span>{__('Banner Alt Text', 'store-banner')}</span>
                                                                                <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="position-relative">
                                                                            <TextControl
                                                                                className="input-control"
                                                                                placeholder= {__('Add the Alt text here', 'store-banner')}
                                                                                value={options?._shop_page?._banner_external_image?.alt}
                                                                                onChange={(value) => updateField('_shop_page._banner_external_image.alt', value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>  
                                                            <Row>                                                                
                                                                <Col className="col-lg-6">
                                                                    <div className="select-setting-unit">
                                                                        <div className="title-wrap">
                                                                            <label>
                                                                                <span>{__('Select Type', 'store-banner')}</span>
                                                                                <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="position-relative">
                                                                        <SelectControl
                                                                            // label="Size"
                                                                            className="input-control"
                                                                            value={options?._shop_page?._banner_width}
                                                                            options={ [
                                                                                //align-center, align-wide, align-full-width 
                                                                                { value: 'align-center', label: 'None' },
                                                                                { value: 'align-wide', label: 'Wide Width' },
                                                                                { value: 'align-full-width ', label: 'Full Width' },
                                                                            ] }
                                                                            onChange={ ( value ) => updateField( '_shop_page._banner_width', value)}
                                                                            __nextHasNoMarginBottom
                                                                        />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>                                                          
                                                            <div className="text-setting-unit">
                                                                <div className="title-wrap">
                                                                    <label>
                                                                        <span>{__('Banner URL', 'store-banner')}</span>
                                                                        <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                    </label>
                                                                </div>
                                                                <div className="position-relative">
                                                                    
                                                                    <TextControl
                                                                        className="input-control"
                                                                        placeholder= {__('Add the Alt text here', 'store-banner')}
                                                                        value={options?._shop_page?._banner_url}
                                                                        onChange={(event) => updateField('_shop_page._banner_url', event.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="store-banner-setting-unit">
                                                        <div className="switch-setting-unit">
                                                            <div className="title-wrap">
                                                                <label>
                                                                    <span>{__('All Product', 'store-banner')}</span>
                                                                    <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                </label>
                                                                <div className="description"><p>{__('Choose a banner for the products page that best aligns with your current marketing goals and target audience.', 'store-banner')}</p></div>
                                                            </div>
                                                            <div className="position-relative switcher">
                                                                <label htmlFor="all_product_page_enable">
                                                                    <input 
                                                                    id="all_product_page_enable"
                                                                    type="checkbox" 
                                                                    value="1"
                                                                    checked={options?._all_product_page?._enable}
                                                                    onChange = {(event) => updateField('_all_product_page._enable', event.target.checked)}
                                                                    />
                                                                        <em data-on="on" data-off="off"></em>
                                                                        <span></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="store-banner-setting-unit store-banner-setting-sub-unit">
                                                        <div className="wrapper">
                                                            <Row className="row">
                                                                <Col className="col-lg-6">
                                                                    <div className="text-setting-unit">
                                                                        <div className="title-wrap">
                                                                            <label>
                                                                                <span>{__('Upload from an URL', 'store-banner')}</span>
                                                                                <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="position-relative">
                                                                            <TextControl
                                                                                className="input-control"
                                                                                placeholder= {__('Add the URL here', 'store-banner')}
                                                                                value={options?._all_product_page?._banner_external_image?._url}
                                                                                onChange={(value) => updateField('_all_product_page._banner_external_image._url', value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col className="col-lg-6">
                                                                    <div className="text-setting-unit">
                                                                        <div className="title-wrap">
                                                                            <label>
                                                                                <span>{__('Banner Alt Text', 'store-banner')}</span>
                                                                                <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="position-relative">
                                                                            <TextControl
                                                                                className="input-control"
                                                                                placeholder= {__('Add the Alt text here', 'store-banner')}
                                                                                value={options?._all_product_page?._banner_external_image?.alt}
                                                                                onChange={(value) => updateField('_all_product_page._banner_external_image.alt', value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col className="col-lg-6">
                                                                    <div className="select-setting-unit">
                                                                        <div className="title-wrap">
                                                                            <label>
                                                                                <span>{__('Select Type', 'store-banner')}</span>
                                                                                <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="position-relative">
                                                                        <SelectControl
                                                                            // label="Size"
                                                                            value={options?._all_product_page?._banner_width}
                                                                            className="input-control"
                                                                            options={ [
                                                                                //align-center, align-wide, align-full-width 
                                                                                { value: 'align-center', label: 'None' },
                                                                                { value: 'align-wide', label: 'Wide Width' },
                                                                                { value: 'align-full-width ', label: 'Full Width' },
                                                                            ] }
                                                                            onChange={ ( value ) => updateField( '_all_product_page._banner_width', value)}
                                                                            __nextHasNoMarginBottom
                                                                        />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <div className="text-setting-unit">
                                                                <div className="title-wrap">
                                                                    <label>
                                                                        <span>{__('Banner URL', 'store-banner')}</span>
                                                                        <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                    </label>
                                                                </div>
                                                                <div className="position-relative">
                                                                    <TextControl
                                                                        // label="Size"
                                                                        className="input-control"
                                                                        placeholder= {__('Add the Alt text here', 'store-banner')}
                                                                        value={options?._all_product_page?._banner_url}
                                                                        onChange={(value) => updateField('_all_product_page._banner_url', value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="store-banner-setting-unit">
                                                        <div className="switch-setting-unit">
                                                            <div className="title-wrap">
                                                                <label>
                                                                    <span>{__('Specific Product', 'store-banner')}</span>
                                                                    <span className="hints-css hint--bottom" aria-label={__('Enable banner option for shop page.', 'store-banner')}><i className="dashicons dashicons-editor-help"></i></span>
                                                                </label>
                                                                <div className="description"><p>{__('Choose a specific banner for specific products that best aligns with your current marketing goals and target audience.', 'store-banner')}</p></div>
                                                            </div>
                                                            <div className="position-relative switcher">
                                                                <label htmlFor="specific_product_enable">
                                                                    <input 
                                                                    id="specific_product_enable"
                                                                    type="checkbox" 
                                                                    value="1"
                                                                    checked={options?._specific_product?._enable}
                                                                    onChange = {(event) => updateField('_specific_product._enable', event.target.checked)}
                                                                    />
                                                                        <em data-on="on" data-off="off"></em>
                                                                        <span></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <TextControl
                                                        label="Shop Page Banner Width"
                                                        value={options?._shop_page?._banner_width}
                                                        onChange={(value) => updateField('_shop_page._banner_width', value)}
                                                    />                                          */}
                                                    
                                                    
                                                </div>                                      
                                                
                                                <div className="save-button mt-auto">
                                                    <Button isPrimary type="submit" className="button button-primary">
                                                    {__('Save settings', 'store-banner')}
                                                    </Button>
                                                </div>
                                            
                                            </form>
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
