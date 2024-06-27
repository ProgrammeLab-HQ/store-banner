import { __ } from '@wordpress/i18n';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Logo from '../assets/images/logo.svg';
const useEffect = wp.element.useState;
const useState = wp.element.useState;
const nonce = document.getElementById('nonce-field');
export default function Settings() {

    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [options, setOptions] = useState([]);
    
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
    });
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
                                    <div className="options-area">
                                        {console.log(options)}
                                        <Card>
                                            <Card.Header>Card Header</Card.Header>
                                            <Card.Title>Card Title</Card.Title>
                                            <Card.Subtitle>Card Subtitle</Card.Subtitle>
                                            <Card.Body>Card Body</Card.Body>
                                            <Card.Link>Card Link</Card.Link>
                                            <Card.Text>Card Text</Card.Text>
                                            <Card.Img src={Logo} />
                                            <Card.Footer>Card Footer</Card.Footer>
                                        </Card>
                                        <div>

                                            <h1>React Settings Page</h1>
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

                                            <button onClick={() => {

                                            wp.apiFetch({
                                                path: '/store_banner/v1/options',
                                                method: 'POST',
                                                data: {
                                                'plugin_option_1': option1,
                                                'plugin_option_2': option2,
                                                },
                                            }).then(data => {
                                                alert('Options saved successfully!');
                                            });

                                            }}>{__('Save settings', 'store-banner')}
                                            </button>

                                        </div>
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
