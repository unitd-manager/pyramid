/*eslint-disable */
import React, { useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  CardBody,
  CardTitle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import random from 'random';
import api from '../../constants/api';
import message from '../Message';

const AddCostingSummaryModal = ({
  addCostingSummaryModel,
  setAddCostingSummaryModel,
  projectInfo,
}) => {
  AddCostingSummaryModal.propTypes = {
    addCostingSummaryModel: PropTypes.bool,
    setAddCostingSummaryModel: PropTypes.func,
    projectInfo: PropTypes.func,
  };
  // const setAddCostingSummaryModal = ({ addLineItemModal, setAddLineItemModal, projectInfo, quoteLine }) => {
  //   setAddCostingSummaryModal.propTypes = {
  //     addLineItemModal: PropTypes.bool,
  //     setAddLineItemModal: PropTypes.func,
  //     projectInfo: PropTypes.any,
  //     quoteLine: PropTypes.any,
  //   };
  //All state Varible
  //const [totalAmount, setTotalAmount] = useState(0);
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      unit: '',
      no_of_days_worked: '',
      labour_rates_per_day: '',
      transport_charges: '',
      other_charges: '',
      salesman_commission: '',
    },
  ]);
  //Insert Invoice Item
  // const addLineItemApi = (obj) => {
  //   obj.opportunity_id = projectInfo;
  //   obj.quote_id = quoteLine;
  //   api
  //     .post('/tender/insertQuoteItems', obj)
  //     .then(() => {
  //       message('Line Item Added Successfully', 'sucess');
  //       window.location.reload();
  //     })
  //     .catch(() => {
  //       message('Cannot Add Line Items', 'error');
  //     });
  // };
  const AddCostingSummary = (obj) => {
    //obj.opportunity_costing_summary_id=id;
    obj.opportunity_id = projectInfo;
    api
      .post('/tender/insertTabcostingsummary', obj)
      .then(() => {
        message('Line Item Added Successfully', 'sucess');
        window.location.reload();
      })
      .catch(() => {
        message('Cannot Add Line Items', 'error');
      });
  };

  //Add new line item
  // const AddNewLineItem = () => {
  //   setAddLineItem([
  //     ...addLineItem,
  //     {
  //       id: new Date().getTime().toString(),
  //       unit: '',
  //       no_of_days_worked: '',
  //       labour_rates_per_day: '',
  //       remarks: '',
  //       amount: '',
  //       title: '',
  //       description: '',
  //     },
  //   ]);
  // };
  //Invoice item values
  const getAllValues = () => {
    const result = [];
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
        });
      result.push(allValues);
    });
    //setTotalAmount(0);
    console.log(result);
    result.forEach((element) => {
      AddCostingSummary(element);
    });
    console.log(result);
  };

  const calculateTotal = () => {
    const result = [];
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
          allValues.total_labour_charges =
            allValues.no_of_worker_used *
            allValues.no_of_days_worked *
            allValues.labour_rates_per_day;
        });
      // Access the transport_charges and other_charges values
      const transportCharges = parseFloat(allValues.transport_charges) || 0;
      const totalLabourCharges = parseFloat(allValues.total_labour_charges) || 0;
      const salesmanCommission = parseFloat(allValues.salesman_commission) || 0;
      const financeCharges = parseFloat(allValues.finance_charges) || 0;
      const officeOverHeads = parseFloat(allValues.office_overheads) || 0;
      const otherCharges = parseFloat(allValues.other_charges) || 0;
      const totalCost = parseFloat(allValues.total_cost) || 0;
      const poPrice = parseFloat(allValues.po_price) || 0;
      const profits = parseFloat(allValues.profit) || 0;
      const profitPercentage = parseFloat(allValues.profit_percentage) || 0;
      const totalMaterialPrice = parseFloat(allValues.total_material_price) || 0;
      
      // Calculate the total_cost by adding transport_charges and other_charges
      allValues.total_cost =
        transportCharges +
        totalLabourCharges +
        salesmanCommission +
        financeCharges +
        officeOverHeads +
        otherCharges+
        totalMaterialPrice;
        allValues.profit =  parseFloat(transportCharges +
          totalLabourCharges +
          salesmanCommission +
          financeCharges +
          officeOverHeads +
          otherCharges+
          totalMaterialPrice)*parseFloat(profitPercentage)*parseFloat(0.01);
    
      //allValues.profit_percentage = (profit / poPrice) * 100;
      result.push(allValues);
    });
    // Return the result array
    setAddLineItem(result);
  };

  // result.forEach((e) => {
  //   if (e.invoiced_price) {
  //     totalValue += parseFloat(e.invoiced_price);
  //   }
  // });
  // console.log(result);
  // setAddLineItem(result);
  // setTotalAmount(totalValue);
  // Clear row value
  // const ClearValue = (ind) => {
  //   setAddLineItem((current) =>
  //     current.filter((obj) => {
  //       return obj.id !== ind.id;
  //     }),
  //   );
  //   if (ind.amount) {
  //     const finalTotal = totalAmount - parseFloat(ind.amount);
  //     setTotalAmount(finalTotal);
  //   }
  // };
  return (
    <>
      <Modal size="lg" isOpen={addCostingSummaryModel}>
        <ModalHeader>
          Add Costing Summary
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setAddCostingSummaryModel(false);
            }}
          >
            X
          </Button>
        </ModalHeader>

        <table className="lineitem">
          <tbody>
            {addLineItem &&
              addLineItem.map((item) => {
                return (
                  <tr key={item.id}>
                    <ModalBody>
                      <Row>
                        <Col md="12">
                          <CardBody>
                            <Form>
                              <Row>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>No of Worker Used</Label>
                                    <Input
                                      Value={item.no_of_worker_used}
                                      type="number"
                                      name="no_of_worker_used"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>No of Days Worked</Label>
                                    <Input
                                      Value={item.no_of_days_worked}
                                      type="number"
                                      name="no_of_days_worked"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Labour Rates Per Day</Label>
                                    <Input
                                      Value={item.labour_rates_per_day}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="number"
                                      name="labour_rates_per_day"
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Total Price</Label>
                                    <Input
                                      Value={item.po_price}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="number"
                                      name="po_price"
                                    />
                                  </FormGroup>
                                </Col>

                            
                              </Row>
                              <CardBody className="bg-light">
                                <CardTitle tag="h4" className="mb-0"></CardTitle>
                              </CardBody>
                              <Row>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Total Material</Label>
                                    <Input
                                      Value={item.total_material_price}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="text"
                                      name="total_material_price"
                                     
                                    />
                                  </FormGroup>
                                </Col>

                                <Col md="4">
                                  <FormGroup>
                                    <Label>Transport Charges</Label>
                                    <Input
                                      Value={item.transport_charges}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="number"
                                      name="transport_charges"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Total Labour Charges</Label>
                                    <Input
                                      Value={item.total_labour_charges}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="number"
                                      name="total_labour_charges"
                                      disabled
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>salesman commission</Label>
                                    <Input
                                      Value={item.salesman_commission}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="number"
                                      name="salesman_commission"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Finance Charges</Label>
                                    <Input
                                      Value={item.finance_charges}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="number"
                                      name="finance_charges"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Office Overheads</Label>
                                    <Input
                                      Value={item.office_overheads}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="number"
                                      name="office_overheads"
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Other Charges</Label>
                                    <Input
                                      Value={item.other_charges}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="number"
                                      name="other_charges"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Total Cost</Label>
                                    <Input
                                      Value={item.total_cost}
                                      onBlur={() => {
                                        calculateTotal();
                                      }}
                                      type="numbtexter"
                                      name="total_cost"
                                      disabled
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Profit Margin%</Label>
                                    <Input
                                      Value={item.profit_percentage}
                                      type="text"
                                      name="profit_percentage"
                                      />
                                  </FormGroup>
                                </Col>
                                <Col md="4">
                                  <FormGroup>
                                    <Label>Profit Margin Value</Label>
                                    <Input
                                      Value={item.profit}
                                      type="text"
                                      name="profit"
                                      disabled
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Form>
                          </CardBody>
                        </Col>
                      </Row>
                    </ModalBody>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <ModalFooter>
          <Button
            className="shadow-none"
            color="primary"
            onClick={() => {
              getAllValues();
            }}
          >
            {' '}
            Submit{' '}
          </Button>
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setAddCostingSummaryModel(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default AddCostingSummaryModal;
