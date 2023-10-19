import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import api from '../../constants/api';
import CostingSummaryModal from '../ProjectModal/CostingSummaryModal';
/* eslint-disable */
export default function CostingSummary() {
  const [type, setType] = React.useState('');
  const [addCostingSummaryModal, setAddCostingSummaryModal] = React.useState(false);
  const [chargesdetails, setChargesDetails] = React.useState('');
  const [getCostingSummary, setGetCostingSummary] = React.useState('');
  const { id } = useParams();
  //Api call for getting Vehicle Fuel Data By ID

  const getCostingbySummary = () => {
    api
      .post('/projecttabcostingsummary/getTabCostingSummaryById', { project_id: id })
      .then((res) => {
        setGetCostingSummary(res.data.data[0]);
      });
  };
  const getCostingSummaryChargesById = () => {
    api
      .post('/projecttabcostingsummary/getCostingSummaryproject', {
        project_id: id,
      })
      .then((res) => {
        setChargesDetails(res.data.data);
      });
  };
  useEffect(() => {
    getCostingSummaryChargesById();
    getCostingbySummary();
  }, [id]);

  return (
    <>
      <Row>
        <Col md="3">
          <FormGroup>
            <h3>Costing Summary</h3>{' '}
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              Total Cost :{' '}
              <b>
                {
                  <span>
                    {(chargesdetails && chargesdetails.transport_charges) +
                      (chargesdetails && chargesdetails.labour_charges) +
                      (chargesdetails && chargesdetails.sales_commision) +
                      (chargesdetails && chargesdetails.finance_charges) +
                      (chargesdetails && chargesdetails.office_overheads) +
                      (chargesdetails && chargesdetails.other_charges)}
                  </span>
                }
              </b>
            </Label>{' '}
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              PO Price (S$ W/o GST) : <b>{getCostingSummary && getCostingSummary.po_price}</b>
            </Label>{' '}
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              {' '}
              Invoiced Price (S$ W/o GST) :
              <b>{getCostingSummary && getCostingSummary.invoiced_price}</b>
            </Label>{' '}
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label>
              Profit Margin :{' '}
              <b>
                {getCostingSummary && getCostingSummary.profit_percentage}%(
                {getCostingSummary && getCostingSummary.profit})
              </b>
            </Label>{' '}
          </FormGroup>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>Total Material</Label>
            <br />
            <span>{getCostingSummary && getCostingSummary.total_material_price}</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Transport Charges{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Transport Charges');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.transport_charges}</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Total Labour Charges{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Total Labour Charges');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.labour_charges}</span>
          </FormGroup>
        </Col>

        <Col md="3">
          <FormGroup>
            <Label>
              Salesman Commission{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Salesman Commission');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.sales_commision}</span>
          </FormGroup>
        </Col>
      </Row>
      <br />
      <Row>
        <Col md="3">
          <FormGroup>
            <Label>
              {' '}
              Finance Charges{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Finance Charges');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.finance_charges}</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Office Overheads{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Office Overheads');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.office_overheads}</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label>
              Other Charges{' '}
              <div color="primary" className="anchor">
                <span
                  onClick={() => {
                    setType('Other Charges');
                    setAddCostingSummaryModal(true);
                  }}
                >
                  <b>
                    <u>Add</u>
                  </b>
                </span>
              </div>
            </Label>
            <br />
            <span>{chargesdetails && chargesdetails.other_charges}</span>
          </FormGroup>
        </Col>
        <Col md="3">
          <FormGroup>
            <Label> TOTAL COST </Label>
            <br />
            <span>
              {(chargesdetails && chargesdetails.transport_charges) +
                (chargesdetails && chargesdetails.labour_charges) +
                (chargesdetails && chargesdetails.sales_commision) +
                (chargesdetails && chargesdetails.finance_charges) +
                (chargesdetails && chargesdetails.office_overheads) +
                (chargesdetails && chargesdetails.other_charges)}
            </span>
          </FormGroup>
        </Col>
      </Row>
      {addCostingSummaryModal && (
        <CostingSummaryModal
          type={type}
          addCostingSummaryModal={addCostingSummaryModal}
          setAddCostingSummaryModal={setAddCostingSummaryModal}
        />
      )}
    </>
  );
}
