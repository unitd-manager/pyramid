import React from 'react';
import { CardTitle, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

export default function CreationModification({ details = null, title }) {
  CreationModification.propTypes = {
    details: PropTypes.object,
    title: PropTypes.string,
  };
  return (
    <>
      <CardTitle tag="h4" className="border-bottom px-4 py-3 mb-0">
        <Row>
          <Col>{title}</Col>
          {details && (
            <Col>
              <Row>
                <small>Modification Date: {details && details.modification_date}</small>
              </Row>
              <Row className="d-flex">
                <small>Creation Date: {details && details.creation_date}</small>
              </Row>
            </Col>
          )}
        </Row>
      </CardTitle>
    </>
  );
}
