import React, { useState } from 'react';
import {
  // Card,
  FormGroup,
  Row,
  Col,
  // Form,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import random from 'random';
import api from '../../constants/api';
import message from '../Message';

const InvoiceData = ({ workOrderLine, setWorkOrderLine, projectId, subCon }) => {
  InvoiceData.propTypes = {
    workOrderLine: PropTypes.bool,
    setWorkOrderLine: PropTypes.func,
    projectId: PropTypes.any,
    subCon: PropTypes.any,
  };

  const [totalAmount, setTotalAmount] = useState(0);
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      quantity: '',
      unit_rate: '',
      amount: '',
      description: '',
    },
  ]);
  //Insert Invoice Item
  const addLineItemApi = (obj) => {
    obj.project_id = projectId;
    obj.sub_con_work_order_id = subCon;

    api
      .post('/projecttabsubconworkorder/insertWorkOrderLineIteam', obj)
      .then(() => {
        message('Line Item Added Successfully', 'success');
      })
      .catch(() => {
        message('Cannot Add Line Items', 'error');
      });
  };

  //Add new line item
  const AddNewLineItem = () => {
    setAddLineItem([
      ...addLineItem,
      {
        id: new Date().getTime().toString(),
        quantity: '',
        unit_rate: '',
        amount: '',
        description: '',
      },
    ]);
  };

  //Invoice item values
  const getAllValues = () => {
    const result = [];
    $('.lineitem tbody tr').each(() => {
      const allValues = {};
      $(this)
        .find('input')
        .each(() => {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
        });
      result.push(allValues);
    });
    console.log(result);
    setTotalAmount(0);
    result.forEach((element) => {
      addLineItemApi(element);
    });
  };
  //Invoice Items Calculation
  const calculateTotal = () => {
    let totalValue = 0;
    const result = [];
    $('.lineitem tbody tr').each(() => {
      const allValues = {};
      $(this)
        .find('input')
        .each(() => {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
          allValues.amount = allValues.quantity * allValues.unit_rate;
        });
      result.push(allValues);
    });
    result.forEach((e) => {
      if (e.amount) {
        totalValue += parseFloat(e.amount);
      }
    });
    setAddLineItem(result);
    setTotalAmount(totalValue);
  };

  // Clear row value
  const ClearValue = (ind) => {
    setAddLineItem((current) =>
      current.filter((obj) => {
        return obj.id !== ind.id;
      }),
    );
    if (ind.amount) {
      const finalTotal = totalAmount - parseFloat(ind.amount);
      setTotalAmount(finalTotal);
    }
  };
  return (
    <>
      <Modal size="xl" isOpen={workOrderLine}>
        <ModalHeader>
          Work Order Line Item
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setWorkOrderLine(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="12">
                <Row>
                  <Col md="3">
                    <Button
                      className="shadow-none"
                      color="primary"
                      type="button"
                      onClick={() => {
                        AddNewLineItem();
                      }}
                    >
                      Add Line Item
                    </Button>
                  </Col>

                  {/* Invoice Item */}
                </Row>
                <Row className="mt-3">
                  <Col>
                    <table className="lineitem">
                      <thead>
                        <tr>
                          <th scope="col">Description </th>
                          <th scope="col">Qty</th>
                          <th scope="col">Unit Price</th>
                          <th scope="col">Amount</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {addLineItem.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td data-label="Description">
                                <Input
                                  defaultValue={item.description}
                                  type="text"
                                  name="description"
                                />
                              </td>

                              <td data-label="Qty">
                                <Input defaultValue={item.quantity} type="number" name="quantity" />
                              </td>
                              <td data-label="Unit Price">
                                <Input
                                  defaultValue={item.unit_rate}
                                  onBlur={() => {
                                    calculateTotal();
                                  }}
                                  type="number"
                                  name="unit_rate"
                                />
                              </td>
                              <td data-label="Amount">
                                <Input
                                  defaultValue={item.amount}
                                  type="text"
                                  name="amount"
                                  disabled
                                />
                              </td>
                              <td data-label="Action">
                                <div className="anchor">
                                  <Input type="hidden" name="id" defaultValue={item.id}></Input>
                                  <span
                                    onClick={() => {
                                      ClearValue(item);
                                    }}
                                  >
                                    Clear
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
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
              setWorkOrderLine(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default InvoiceData;
