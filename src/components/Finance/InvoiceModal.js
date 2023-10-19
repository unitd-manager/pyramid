import React, { useEffect, useState } from 'react';
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
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { useParams } from 'react-router-dom';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import * as $ from 'jquery';
import random from 'random';
import api from '../../constants/api';
import message from '../Message';
import InvoiceModalTable from './InvoiceModalTable';

const InvoiceModal = ({ editInvoiceModal, editModal, setEditModal }) => {
  InvoiceModal.propTypes = {
    editInvoiceModal: PropTypes.any,
    editModal: PropTypes.bool,
    setEditModal: PropTypes.func,
  };
  //All state variable
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('');
  const [invoiceData, SetInvoiceData] = useState({
    invoice_id: editInvoiceModal.invoice_id,
    invoice_code: '',
    status: '',
    invoice_date: '',
    invoice_amount: '',
    gst_value: '',
    discount: '',
    quote_code: '',
    po_number: '',
    project_location: '',
    project_reference: '',
    so_ref_no: '',
    code: '',
    reference: '',
    invoice_terms: '',
    attention: '',
  });
  const { id } = useParams();
  //Add Line Item
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      'invoice_id ': '',
      unit: '',
      qty: '',
      unit_price: '',
      amount: '',
      remarks: '',
      item_title: '',
      description: '',
    },
  ]);
  const AddNewLineItem = () => {
    setAddLineItem([
      ...addLineItem,
      {
        id: new Date().getTime().toString(),
        invoice_id: '',
        uom: '',
        qty: '',
        unitprice: '',
        amount: '',
        remarks: '',
        item: '',
        description: '',
      },
    ]);
  };
  //setting value in invoiceData
  const handleInputs = (e) => {
    SetInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };
  const handleDataEditor = (e, type) => {
    SetInvoiceData({
      ...invoiceData,
      [type]: draftToHtml(convertToRaw(e.getCurrentContent())),
    });
  };
  //getting data from invoice id
  const getInvoice = () => {
    api
      .post('/invoice/getInvoiceByInvoiceId', { invoice_id: editInvoiceModal.invoice_id })
      .then((res) => {
        SetInvoiceData(res.data.data);
      });
  };
  //get invoice line item
  const getLineItem = () => {
    api
      .post('/invoice/getInvoiceItemsById', { invoice_id: editInvoiceModal.invoice_id })
      .then((res) => {
        setAddLineItem(res.data.data);
      });
  };
  //Edit invoice
  const editInvoice = () => {
    invoiceData.invoice_amount = totalAmount + (7 / 100) * totalAmount;
    invoiceData.order_id = id;
    api
      .post('/Finance/editInvoicePortalDisplay', invoiceData)
      .then(() => {
        message('Invoice edited successfully.', 'success');
      })
      .catch(() => {
        message('Network connection error.');
      });
  };
  //editlineitem
  const editLineItemApi = (obj) => {
    api
      .post('/Finance/editInvoiceItem', {
        description: obj.description,
        amount: obj.amount,
        item_title: obj.item_title,
        cost_price: 0,
        qty: obj.qty,
        created_by: '',
        modified_by: '',
        invoice_id: obj.invoice_id,
        unit: obj.unit,
        remarks: obj.remarks,
        s_no: '',
        model: '',
        vat: 0,
        discount_percentage: 0,
        item_code_backup: '',
        erection: 0,
        dismantle: 0,
        unit_price: parseFloat(obj.unit_price),
      })
      .then(() => {
        message('Line Item Edited Successfully', 'sucess');
      })
      .catch(() => {
        message('Cannot Edit Line Items', 'error');
      });
  };

  //Add line item API
  const addLineItemApi = (obj) => {
    api
      .post('/Finance/insertInvoiceItem', {
        description: obj.description,
        amount: obj.amount,
        item_title: obj.item_title,
        cost_price: 0,
        qty: obj.qty,
        created_by: '',
        modified_by: '',
        unit: obj.unit,
        remarks: obj.remarks,
        s_no: '',
        model: '',
        vat: 0,
        discount_percentage: 0,
        item_code_backup: '',
        erection: 0,
        dismantle: 0,
        unit_price: parseFloat(obj.unit_price),
      })
      .then(() => {
        message('Line Item Added Successfully', 'sucess');
      })
      .catch(() => {
        message('Cannot Add Line Items', 'error');
      });
  };
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
    result.forEach((obj) => {
      if (obj.item !== '' && obj.amount) {
        if (obj.invoice_id !== '') {
          editLineItemApi(obj);
        } else {
          addLineItemApi(obj);
        }
      }
    });
    setTotalAmount(0);
    setAddLineItem([
      {
        id: random.int(1, 99),
        invoice_id: '',
        unit: '',
        qty: '',
        unit_price: '',
        amount: '',
        remarks: '',
        item_title: '',
        description: '',
      },
    ]);
  };
  //Calculation for Invoice Item
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
          allValues.amount = allValues.qty * allValues.unit_price;
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
  useEffect(() => {
    getLineItem();
    getInvoice();
    SetInvoiceData(editInvoiceModal);
  }, [editInvoiceModal]);
  return (
    <>
      <Modal size="xl" isOpen={editModal}>
        <ModalHeader>
          Create Invoice
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setEditModal(false);
            }}>
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Form>
              <Row>
                <Col md="3">
                  <Button
                    color="primary"
                    className="shadow-none"
                    type="button"
                    onClick={() => {
                      AddNewLineItem();
                    }}>
                    Add Line Item
                  </Button>
                </Col>
              </Row>
              <Row>
                <InvoiceModalTable createInvoice={invoiceData} handleInputs={handleInputs} />
                  <Editor
                editorState={paymentTerms}
                wrapperClassName="demo-wrapper mb-0"
                editorClassName="demo-editor border mb-4 edi-height"
                onEditorStateChange={(e) => {
                  handleDataEditor(e, 'payment_terms');
                  setPaymentTerms(e);
                }}/>
              </Row>
              <Row>
                <Col>
                  <table className="lineitem">
                    <thead>
                      <tr>
                        <th scope="col">Item</th>
                        <th scope="col">Invoice Id</th>
                        <th scope="col">Description </th>
                        <th scope="col">UoM</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Unit Price</th>
                        <th scope="col">Total Price</th>
                        <th scope="col">Remarks</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {addLineItem &&
                        addLineItem.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td data-label="Item">
                                <Input
                                  defaultValue={item.item_title}
                                  type="text"
                                  name="item_title"/>
                              </td>
                              <td data-label="Invoice Id">
                                <Input
                                  defaultValue={item.invoice_id}
                                  type="text"
                                  name="invoice_id"/>
                              </td>
                              <td data-label="Description">
                                <Input
                                  defaultValue={item.description}
                                  type="text"
                                  name="description"/>
                              </td>
                              <td data-label="UoM">
                                <Input defaultValue={item.unit} type="text" name="unit" />
                              </td>
                              <td data-label="Qty">
                                <Input defaultValue={item.qty} type="number" name="qty" />
                              </td>
                              <td data-label="Unit Price">
                                <Input
                                  defaultValue={item.unit_price}
                                  onBlur={() => {
                                    calculateTotal();
                                  }}
                                  type="number"
                                  name="unit_price"/>
                              </td>
                              <td data-label="Total Price">
                                <Input value={item.amount} type="text" name="amount" disabled />
                              </td>
                              <td data-label="Remarks">
                                <Input defaultValue={item.remarks} type="text" name="remarks" />
                              </td>
                              <td data-label="Action">
                                <div className="anchor">
                                  <Input type="hidden" name="id" defaultValue={item.id}></Input>
                                  <span
                                    onClick={() => {
                                      ClearValue(item);
                                    }}>
                                    Clear
                                  </span>
                                </div>
                              </td>
                            </tr>);})}
                    </tbody>
                  </table>
                </Col>
              </Row>
              <ModalFooter>
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    editInvoice();
                    getAllValues();
                  }}>
                  {' '}
                  Submit{' '}
                </Button>
                <Button
                  className="shadow-none"
                  color="secondary"
                  onClick={() => {
                    setEditModal(false);
                  }}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
         </ModalBody>
      </Modal>
    </>
  );
};
export default InvoiceModal;