import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default function Settings() {
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
                                    <div className="options-area"></div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    )
}
