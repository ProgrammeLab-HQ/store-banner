// import React, { Component, Suspense } from "react";
import React, { Component } from "react";
import { Col, Container, Row } from 'react-bootstrap';

export default class Elements extends Component {  
    render() {
        return (
            <Container className="p-3" fluid="fluid">
                <Row className="set-row">
                    <Col className="col-lg-4">Col 1</Col>
                    <Col>Col 2</Col>
                    <Col>Col 3</Col>
                </Row>
            </Container>
        )
    }
}
