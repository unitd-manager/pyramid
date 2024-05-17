import React, { useEffect, useState, useContext } from 'react';
import {
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
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const FinanceReceiptData = ({ editCreateReceipt, setEditCreateReceipt, orderId }) => {
  FinanceReceiptData.propTypes = {
    editCreateReceipt: PropTypes.bool,
    setEditCreateReceipt: PropTypes.func,
    orderId: PropTypes.any,
    // canceledAmount: PropTypes.any,
  };

  const [invoiceReceipt, setInvoiceReceipt] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const [totalAmount, setTotalAmount] = useState(0);
  const [createReceipt, setCreateReceipt] = useState({
    amount: 0,
    order_id: orderId,
    receipt_status: 'Paid',
    receipt_date: moment().format('YYYY-MM-DD'),
    receipt_code: '',
  });
  const { loggedInuser } = useContext(AppContext);
  const [selectedInvoice, setSelectedInvoice] = useState([]);

  const handleInputreceipt = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      setTotalAmount(parseFloat(value));
    }
    setCreateReceipt((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (editCreateReceipt) {
      setCreateReceipt((prev) => ({
        ...prev,
        receipt_date: moment().format('YYYY-MM-DD'),
      }));
    }
  }, [editCreateReceipt]);

  const insertReceiptHistory = (createReceiptHistory) => {
    api
      .post('/finance/insertInvoiceReceiptHistory', createReceiptHistory)
      .then(() => {
        message('data inserted successfully.');
        window.location.reload();
      })
      .catch(() => {
        message('Network connection error.');
      });
  };

  const editInvoiceStatus = (invoiceId, Status) => {
    api
      .post('/invoice/editInvoiceStatus', {
        invoice_id: invoiceId,
        status: Status,
      })
      .then(() => {
        message('data inserted successfully.');
      })
      .catch(() => {
        message('Network connection error.');
      });
  };

  const editInvoicePartialStatus = (invoiceId, Status) => {
    api
      .post('/invoice/editInvoicePartialStatus', {
        invoice_id: invoiceId,
        status: Status,
      })
      .then(() => {
        message('data inserted successfully.');
      })
      .catch(() => {
        message('Network connection error.');
      });
  };

  const finalCalculation = (receipt) => {
    let leftamount = totalAmount;

    for (let j = 0; j < selectedInvoice.length; j++) {
      if (selectedInvoice[j].remainingAmount <= leftamount) {
        leftamount = parseFloat(leftamount) - selectedInvoice[j].remainingAmount;
        selectedInvoice[j].paid = true;
        editInvoiceStatus(selectedInvoice[j].invoice_id, 'Paid');
        insertReceiptHistory({
          invoice_id: selectedInvoice[j].invoice_id,
          receipt_id: receipt,
          published: '1',
          flag: '1',
          creation_date: '',
          modification_date: '',
          created_by: '',
          modified_by: '',
          amount: selectedInvoice[j].remainingAmount,
          site_id: '1',
        });
      } else {
        selectedInvoice[j].partiallyPaid = true;
        editInvoicePartialStatus(selectedInvoice[j].invoice_id, 'Partial Payment');
        insertReceiptHistory({
          invoice_id: selectedInvoice[j].invoice_id,
          receipt_id: receipt,
          published: '1',
          flag: '1',
          creation_date: '',
          modification_date: '',
          created_by: '',
          modified_by: '',
          amount: leftamount,
          site_id: '1',
        });
      }
    }
  };

  const insertReceipt = async (code) => {
    const receipt = {
      ...createReceipt,
      receipt_code: code,
      creation_date: creationdatetime,
      created_by: loggedInuser.first_name,
    };

    if (createReceipt.mode_of_payment && selectedInvoice.length > 0) {
      if (totalAmount >= createReceipt.amount) {
        api
          .post('/finance/insertreceipt', receipt)
          .then((res) => {
            message('data inserted successfully.');
            finalCalculation(res.data.data.insertId);
          })
          .catch(() => {
            message('Network connection error.');
          })
          .finally(() => {
            setSubmitting(false);
          });
      } else {
        message('Please fill all required fields', 'warning');
        setSubmitting(false);
      }
    } else {
      message('Please fill mode of payment fields', 'warning');
      setSubmitting(false);
    }
  };

  const generateCode = () => {
    api
      .post('/commonApi/getCodeValue', { type: 'receipt' })
      .then((res) => {
        insertReceipt(res.data.data);
      })
      .catch(() => {
        insertReceipt('');
      });
  };

  const getInvoices = (event, invObj) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedInvoice((prev) => [...prev, invObj]);
    } else {
      setSelectedInvoice((prev) => prev.filter((invoice) => invoice.invoice_id !== invObj.invoice_id));
    }
  };

  const addAndDeductAmount = (checkboxVal, receiptObj) => {
    const remainingAmount = receiptObj.invoice_amount - receiptObj.prev_amount;
    const parsedTotalAmount = parseFloat(totalAmount);
    const parsedCreateReceiptAmount = parseFloat(createReceipt.amount);

    if (checkboxVal.target.checked) {
      const updatedTotalAmount = parsedTotalAmount + remainingAmount;
      const updatedCreateReceiptAmount = parsedCreateReceiptAmount + remainingAmount;

      setTotalAmount(updatedTotalAmount);
      setCreateReceipt((prevReceipt) => ({
        ...prevReceipt,
        amount: updatedCreateReceiptAmount.toString(),
      }));
    } else {
      const updatedTotalAmount = parsedTotalAmount - remainingAmount;
      const updatedCreateReceiptAmount = parsedCreateReceiptAmount - remainingAmount;

      setTotalAmount(updatedTotalAmount >= 0 ? updatedTotalAmount : 0);
      setCreateReceipt((prevReceipt) => ({
        ...prevReceipt,
        amount: updatedCreateReceiptAmount >= 0 ? updatedCreateReceiptAmount.toString() : '0',
      }));
    }
  };

  useEffect(() => {
    api.post('/invoice/getInvoiceReceiptById', { order_id: orderId }).then((res) => {
      const datafromapi = res.data.data;
      datafromapi.forEach((element) => {
        element.remainingAmount = element.invoice_amount - element.prev_amount;
      });
      const result = datafromapi.filter((el) => el.invoice_amount !== el.prev_amount);
      setInvoiceReceipt(result);
    });
  }, [id]);

  return (
    <Modal size="md=6" isOpen={editCreateReceipt}>
      <ModalHeader>
        Create Receipt
        <Button
          className="shadow-none"
          color="secondary"
          onClick={() => {
            setEditCreateReceipt(false);
          }}
        >
          X
        </Button>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="12">
            <Form>
              {invoiceReceipt && invoiceReceipt.length > 0 ? (
                <>
                  {invoiceReceipt.map((singleInvoiceObj) => (
                    <Row key={singleInvoiceObj.invoice_id}>
                      <Col md="12">
                        <FormGroup check>
                          <Input
                            onChange={(e) => {
                              addAndDeductAmount(e, singleInvoiceObj);
                              getInvoices(e, singleInvoiceObj);
                            }}
                            name="invoice_code(prev_amount)"
                            type="checkbox"
                          />
                          <span>
                            {singleInvoiceObj.invoice_code}({singleInvoiceObj.invoice_amount}) Paid - {singleInvoiceObj.prev_amount}
                          </span>
                        </FormGroup>
                      </Col>
                    </Row>
                  ))}
                  <br />
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label>Amount</Label>
                        <Input
                          type="text"
                          onChange={handleInputreceipt}
                          value={createReceipt.amount}
                          name="amount"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          onChange={handleInputreceipt}
                          value={createReceipt.receipt_date}
                          name="receipt_date"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label>Mode Of Payment <span className="required">*</span></Label>
                        <Input
                          type="select"
                          name="mode_of_payment"
                          onChange={handleInputreceipt}
                          value={createReceipt.mode_of_payment || ''}
                        >
                          <option value="">Please Select</option>
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                          <option value="giro">Giro</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    {createReceipt.mode_of_payment === 'cheque' && (
                      <>
                        <Col md="12">
                          <FormGroup>
                            <Label>Check No</Label>
                            <Input
                              type="number"
                              onChange={handleInputreceipt}
                              value={createReceipt.cheque_no || ''}
                              name="cheque_no"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <Label>Check date</Label>
                            <Input
                              type="date"
                              onChange={handleInputreceipt}
                              value={createReceipt.cheque_date || ''}
                              name="cheque_date"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <Label>Bank</Label>
                            <Input
                              type="text"
                              onChange={handleInputreceipt}
                              value={createReceipt.bank_name || ''}
                              name="bank_name"
                            />
                          </FormGroup>
                        </Col>
                      </>
                    )}
                    <Col md="12">
                      <FormGroup>
                        <Label>Notes</Label>
                        <Input
                          type="text"
                          onChange={handleInputreceipt}
                          value={createReceipt.remarks || ''}
                          name="remarks"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              ) : (
                <span>No Invoice</span>
              )}
            </Form>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          className="shadow-none"
          color="primary"
          onClick={() => {
            if (!submitting) {
              setSubmitting(true);
              if (parseFloat(createReceipt.amount) > 0) {
                if (createReceipt.mode_of_payment && createReceipt.mode_of_payment !== 'Please Select') {
                  const totalInvoiceAmount = selectedInvoice.reduce(
                    (total, invoice) => total + invoice.remainingAmount,
                    0,
                  );
                  if (parseFloat(createReceipt.amount) <= totalInvoiceAmount) {
                    generateCode();
                  } else {
                    message('Amount should not be greater than the total invoice amount.', 'warning');
                    setSubmitting(false);
                  }
                } else {
                  message('Please select a valid mode of payment', 'warning');
                  setSubmitting(false);
                }
              } else {
                message('Please select at least one Invoice', 'warning');
                setSubmitting(false);
              }
            }
          }}
          disabled={submitting}
        >
          Submit
        </Button>
        <Button
          className="shadow-none"
          color="secondary"
          onClick={() => {
            setEditCreateReceipt(false);
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FinanceReceiptData;
