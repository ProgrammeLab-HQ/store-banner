import { __ } from '@wordpress/i18n';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Card from '../Molecules/Card';
import imageSupport from '../assets/images/get-5-star-support.svg';
import imageJoin from '../assets/images/join-the-community.svg';
import imageRate from '../assets/images/rate-us.svg';
import imageWelcomeFeature from '../assets/images/welcome-feature-image.svg';
import imageWelcomeHeader from '../assets/images/welcome-store-banner.svg';



export default function Home() {
return (
      <section className="settings-page-wrap">
        <Container fluid="fluid">
        <div className="content-part">
                <Row>
                    <Col className="col-lg-8 left-content">
                    <Card
                        // className="custom-class"      
                        header = {{
                            imgBox: {
                                className: 'gap-4',
                                title: __('Welcome to Store Banner', 'store-banner'),
                                content: __('We designed Store Banner to be intuitive but we do recommend learning how it works by Checking our comprehensive documentation and watching the video below. Enjoy your time with Spectra!', 'store-banner'),
                                img: imageWelcomeHeader
                            }
                        }}
                        body = {{
                            html: `<div class="text-center"><img class="img-fluid" src="${imageWelcomeFeature}" /></div>`
                        }}
                        footer = {{
                            cta: {
                                content: __('Enjoyed Store Banner ? Please leave us a rating. We really appreciate your support!', 'store-banner'),
                                btn: [
                                    {
                                        'url': '#',
                                        'title': __('Create New Page', 'store-banner'),
                                        'className': 'button-solid button-solid-blue',
                                    },
                                    {
                                        'url': '#',
                                        'title': __('Visit Our Website', 'store-banner')
                                    },
                                ]
                            }
                        }}
                        />
                    </Col>
                    <Col className="col-lg-4 right-content">
                        <Card
                        // className="custom-class"      
                        body = {{
                            imgBox: {
                                className: 'gap-3',
                                title: __('Get 5-star Support', 'store-banner'),
                                content: __('Need some help? Our awesome support team is here to help you with any question you have.', 'store-banner'),
                                img: imageSupport,
                                btn: [
                                    {
                                        'url': '#',
                                        'title': __('Get Support', 'store-banner')
                                    }
                                ]
                            }
                        }}
                        />
                        <Card
                        // className="custom-class"      
                        body = {{
                            imgBox: {
                                className: 'gap-3',
                                title: __('Join the Community', 'store-banner'),
                                content: __('Got a question about the plugin, want to share your awesome project or just say hi? Join our wonderful community!'),
                                img: imageJoin,
                                btn: [
                                    {
                                        'url': '#',
                                        'title': __('Get Support', 'store-banner')
                                    }
                                ]
                            }
                        }}
                        />
                        <Card
                        // className="custom-class"      
                        body = {{
                            imgBox: {
                                className: 'gap-3',
                                title: __('Rate Us', 'store-banner'),
                                content: __('We love to hear from you, we would appreciate your every single review.', 'store-banner'),
                                img: imageRate,
                                btn: [
                                    {
                                        'url': '#',
                                        'title': __('Get Support', 'store-banner')
                                    }
                                ]
                            }
                        }}
                        />
                        
                    </Col>
                </Row>
            </div>
            </Container>
      </section>
  )
};
