import React, { useState } from 'react';
import {
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../constants/api';

const EditCostingSummaryModal = ({
  editCostingSummaryModel,
  setEditCostingSummaryModel,
  costingsummary,
}) => {
  EditCostingSummaryModal.propTypes = {
    editCostingSummaryModel: PropTypes.bool,
    setEditCostingSummaryModel: PropTypes.func,
    costingsummary: PropTypes.object,
  };

  const [editCostingSummaryData, seteditCostingSummaryData] = useState(null);
  const { id } = useParams();
  const [totalLabour, setTotalLabour] = useState();
  const [totalCharges, setTotalCharges] = useState();
  //edit Tab Costing Summary Form
  const handleCostingSummeryInputs = (e) => {
    seteditCostingSummaryData({ ...editCostingSummaryData, [e.target.name]: e.target.value });
  };

  const handleCalc = (noofworkerused, noofdaysworked, labourratesperday, totallabourcharges) => {
    if (!noofworkerused) noofworkerused = 0;
    if (!noofdaysworked) noofdaysworked = 0;
    if (!labourratesperday) labourratesperday = 0;
    if (!totallabourcharges) totallabourcharges = 0;
    
    

    setTotalLabour(
      parseFloat(noofworkerused) * parseFloat(noofdaysworked) * parseFloat(labourratesperday),
     
    );
  };
  const handleCalc1 = (totalcost,transportcharges,salesmancommission,financecharges,officeoverheads,othercharges) => {
  
    if (!totalcost) totalcost = 0;
    if (!transportcharges) transportcharges = 0;
    if (!salesmancommission) salesmancommission = 0;
    if (!financecharges) financecharges = 0;
    if (!officeoverheads) officeoverheads = 0;
    if (!othercharges) othercharges = 0;
    

    setTotalCharges(
  
parseFloat(transportcharges) + parseFloat(salesmancommission)+ parseFloat(financecharges) +
parseFloat(officeoverheads) +
parseFloat(othercharges)  ,
    );
  };
  const EditCostingSummary = () => {
    editCostingSummaryData.opportunity_id = id;
    //editCostingSummaryData.total_cost=totalLabour;
    editCostingSummaryData.total_labour_charges =
      parseFloat(editCostingSummaryData.no_of_days_worked) *
      parseFloat(editCostingSummaryData.no_of_worker_used) *
      parseFloat(editCostingSummaryData.labour_rates_per_day);      
      editCostingSummaryData.total_cost = 
      parseFloat(editCostingSummaryData.transportcharges) +
      parseFloat(editCostingSummaryData.salesmancommission) +
      parseFloat(editCostingSummaryData.financecharges) +
      parseFloat(editCostingSummaryData.officeoverheads) +
      parseFloat(editCostingSummaryData.othercharges) ;
    api.post('/tender/edit-TabCostingSummaryForm', editCostingSummaryData).then(() => {
      setEditCostingSummaryModel(false);
      //window.location.reload();
    });
  };

  React.useEffect(() => {
    seteditCostingSummaryData(costingsummary);
  }, [costingsummary]);

  return (
    <>
      <Modal size="lg" isOpen={editCostingSummaryModel}>
        <ModalHeader>
          Edit Costing Summary
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditCostingSummaryModel(false);
            }}
          >
            X
          </Button>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="12">
              <CardBody>
                <Form>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>No. of Worker Used</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              e.target.value,
                              costingsummary.no_of_days_worked,
                              costingsummary.labour_rates_per_day,
                              costingsummary.total_labour_charges,
                              
                            );
                          }}
                          defaultValue={costingsummary && costingsummary.no_of_worker_used}
                          name="no_of_worker_used"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>No. of Days Worked</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              costingsummary.no_of_worker_used,
                              e.target.value,
                              costingsummary.labour_rates_per_day,
                              costingsummary.total_labour_charges,
                              
                            );
                          }}
                          defaultValue={costingsummary && costingsummary.no_of_days_worked}
                          name="no_of_days_worked"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Labout Rates Per Day</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              costingsummary.no_of_worker_used,
                              costingsummary.no_of_days_worked,
                              e.target.value,
                              costingsummary.total_labour_charges,
                             
                            );
                          }}
                          defaultValue={costingsummary && costingsummary.labour_rates_per_day}
                          name="labour_rates_per_day"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Total Price (S$ W/o GST)</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                          }}
                          defaultValue={costingsummary && costingsummary.invoiced_price}
                          name="invoiced_price"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Profit Margin %</Label>
                        <Input
                          type="number"
                          disabled
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                          }}
                          defaultValue={costingsummary && costingsummary.profit_percentage}
                          name="profit_percentage"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Profit Margin</Label>
                        <Input
                          type="number"
                          disabled
                          name="profit"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                          }}
                          defaultValue={costingsummary && costingsummary.profit}
                          tabindex="-1"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>

              <CardBody className="bg-light">
                <CardTitle tag="h4" className="mb-0"></CardTitle>
              </CardBody>

              <CardBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Total Material</Label>
                      <Input
                        type="number"
                        disabled
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                        }}
                        defaultValue={costingsummary && costingsummary.total_material_price}
                        name="total_material_price"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Transport Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalc1(
                            e.target.value,
                            costingsummary.salesman_commission,
                            costingsummary.finance_charges,
                            costingsummary.office_overheads,
                            costingsummary.other_charges,
                            costingsummary.total_cost,
                          );
                          
                        }}
                        defaultValue={costingsummary && costingsummary.transport_charges}
                        name="transport_charges"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Total Labour Charges</Label>
                      <Input
                        type="number"
                        disabled
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalc(
                            costingsummary.no_of_worker_used,
                            costingsummary.no_of_days_worked,
                            costingsummary.labour_rates_per_day,
                            e.target.value,
                         
                          );
                        }}
                        value={totalLabour || costingsummary && costingsummary.total_labour_charges}
                        name="total_labour_charges"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Salesman Commission </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalc1(
                            costingsummary.transport_charges,
                            e.target.value,
                            costingsummary.finance_charges,
                            costingsummary.office_overheads,
                            costingsummary.other_charges,
                            costingsummary.total_cost,
                          );
                        }}
                        defaultValue={costingsummary && costingsummary.salesman_commission}
                        name="salesman_commission"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Finance Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalc1(
                            costingsummary.transport_charges,
                            costingsummary.salesman_commission,
                            e.target.value,
                            costingsummary.office_overheads,
                            costingsummary.other_charges,
                            costingsummary.total_cost,
                            
                          );
                        }}
                        defaultValue={costingsummary && costingsummary.finance_charges}
                        name="finance_charges"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Office Overheads </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalc1(
                            costingsummary.transport_charges,
                            costingsummary.salesman_commission,
                            costingsummary.finance_charges,
                            e.target.value,
                            costingsummary.other_charges,
                            costingsummary.total_cost,
                            
                          );
                        }}
                        defaultValue={costingsummary && costingsummary.office_overheads}
                        name="office_overheads"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Other Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalc1(
                            costingsummary.transport_charges,
                            costingsummary.salesman_commission,
                            costingsummary.finance_charges,
                            costingsummary.office_overheads,
                            e.target.value,
                            costingsummary.total_cost,
                            
                          );
                        }}
                        defaultValue={costingsummary && costingsummary.other_charges}
                        
                        name="other_charges"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>TOTAL COST</Label>
                      <Input
                        type="number"
                        disabled
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                         
                          handleCalc1(
                            costingsummary.transport_charges,
                            costingsummary.salesman_commission,
                            costingsummary.finance_charges,
                            costingsummary.office_overheads,
                            costingsummary.other_charges,
                            e.target.value,
                            
                          );
                        }}
                        value={totalCharges || costingsummary && costingsummary.total_cost}
                       
                        // value={costingsummary && costingsummary.total_cost}
                        name="total_cost"
                          
                        
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardBody>
                <CardTitle className="mb-0 bg-light"></CardTitle>
              </CardBody>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              EditCostingSummary();
            }}
          >
            {' '}
            Submit{' '}
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditCostingSummaryModel(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditCostingSummaryModal;
