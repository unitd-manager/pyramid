import React from 'react';
import { Row, Col, Form, FormGroup, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCardV2 from '../ComponentCardV2';

export default function ProjectButton({ UpdateData, InsertJobOrder, applyChanges, backToList, navigate }) {
  ProjectButton.propTypes = {
    UpdateData: PropTypes.any,
    InsertJobOrder: PropTypes.any,
    navigate: PropTypes.any,
    applyChanges: PropTypes.func,
    backToList: PropTypes.func,
  };
  return (
    <Form>
      <FormGroup>
        <ComponentCardV2>
          <Row>
            <Col>
              <Button
                className="shadow-none"
                color="primary"
                onClick={() => {
                  UpdateData();
                  InsertJobOrder();
                  navigate('/Project');
                }}
              >
                Save
              </Button>
            </Col>
            <Col>
              <Button
                className="shadow-none"
                color="primary"
                onClick={() => {
                  UpdateData();
                  InsertJobOrder();
                  applyChanges();
                }}
              >
                Apply
              </Button>
            </Col>

            <Col>
              <Button
                className="shadow-none"
                color="dark"
                onClick={() => {
                  backToList();
                }}
              >
                Back to List
              </Button>
            </Col>
          </Row>
        </ComponentCardV2>
      </FormGroup>
    </Form>
  );
}
