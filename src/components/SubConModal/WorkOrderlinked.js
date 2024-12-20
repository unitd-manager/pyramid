import React, { useEffect, useState } from 'react';
import {
  CardBody,
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
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';

const WorkOrderLinked = ({ editWorkOrderLinked, setEditWorkOrderLinked }) => {
  WorkOrderLinked.propTypes = {
    editWorkOrderLinked: PropTypes.bool,
    setEditWorkOrderLinked: PropTypes.func,
  };
  //All const Variable
  const { id } = useParams();
  const [SubConReceipt, setSubConReceipt] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [createSubCon, setCreateReceipt] = useState({
    amount: 0,
  });
  const [selectedSubCon, setselectedSubCon] = useState([]);
 // const [subConWork, setSubConWork] = useState([]);

  //getting data
  const handleInputreceipt = (e) => {
    if (e.target.name === 'amount') {
      // eslint-disable-next-line
      setTotalAmount(parseInt(e.target.value));
    }
    setCreateReceipt({ ...createSubCon, [e.target.name]: e.target.value });
  };
  //Inserting subcon-receipt
  const insertPaymentHistory = (createSubConHistory) => {
    api
      .post('/subcon/insertsub_con_payments_history', createSubConHistory)
      .then(() => {
        message('History inserted successfully.');
    
      })
      .catch(() => {
        message('Network connection error.');
      
      });
  };
  //Chaning subcon status
  const editSubConStatus = (subconId, Status) => {
    api
      .post('/subcon/editSubConStatus', {
        sub_con_work_order_id: subconId,
        status: Status,
      })
      .then(() => {
        message('data inserted successfully.');
        // setTimeout(() => {
        //   console.log('Data saved successfully.');
        //   // Reload the page after saving data
        //   window.location.reload();
        // }, 2000);
      })
      .catch(() => {
        message('Network connection error.');
      });
  };
  const editSubconPartialStatus = (subconId, Status) => {
    api
      .post('/subcon/editPartialSubconStatus', {
        sub_con_work_order_id: subconId,
        status: Status,
      })
      .then(() => {
        message('data inserted successfully.');
        setTimeout(() => {
          console.log('Data saved successfully.');
          // Reload the page after saving data
          //window.location.reload();
        }, 2000);
      })
      .catch(() => {
        message('Network connection error.');
      });
  };

  // const getSubConWork = () => {
  //   api
  //     .post('/subcon/getSubConWorkOrder', { sub_con_id: id })
  //     .then((res) => {
  //       setSubConWork(res.data.data[0].sub_con_work_order_id);
  //     })
  //     .catch(() => {
  //       // message('Cannot get Invoice Data', 'error');
  //     });
  // };
  

  //Logic for deducting receipt amount
  // const finalCalculation = (receipt) => {
  //   let leftamount = totalAmount;

  //   for (let j = 0; j < selectedSubCon.length; j++) {
  //     if (selectedSubCon[j].remainingAmount <= leftamount) {
  //       leftamount = parseFloat(leftamount) - selectedSubCon[j].remainingAmount;
  //       selectedSubCon[j].paid = true;
  //       editSubConStatus(selectedSubCon[j].sub_con_work_order_id, 'Paid');

  //       insertPaymentHistory({
  //         creation_date: moment().format(),
  //         modification_date: moment().format(),
  //         work_order_date: '',
  //         invoice_paid_status: 'Paid',
  //         title: '',
  //         installment_id: '',
  //         receipt_type: '',
  //         related_sub_con_work_order_id: '',
  //         gst_amount: '',
  //         sub_con_work_order_id: selectedSubCon[j].sub_con_work_order_id,
  //         sub_con_payments_id: receipt,
  //         published: '1',
  //         flag: '1',

  //         created_by: 'admin',
  //         modified_by: 'admin',
  //         amount: selectedSubCon[j].remainingAmount,
  //       });
  //     } else {
  //       selectedSubCon[j].paid = true
  //       editSubconPartialStatus(selectedSubCon[j].sub_con_work_order_id, 'Partially Paid');
  //       insertPaymentHistory({
  //         creation_date: moment().format(),
  //         modification_date: moment().format(),

  //         work_order_date: '',
  //         invoice_paid_status: 'Partially paid',
  //         title: '',
  //         installment_id: '',
  //         receipt_type: '',
  //         related_sub_con_work_order_id: '',
  //         gst_amount: '',
  //         sub_con_work_order_id: selectedSubCon[j].sub_con_work_order_id,
  //         sub_con_payments_id: receipt,
  //         published: '1',
  //         flag: '1',
  //         created_by: 'admin',
  //         modified_by: 'admin',
  //         amount: leftamount,
  //       });
  //     }
  //   }
  // };
  //Getting receipt data by order id
  const getSubConReceipt = () => {
    api
      .post('/subcon/getSubMakePayment', { sub_con_id: id })
      .then((res) => {
        const datafromapi = res.data.data;
        datafromapi.forEach((element) => {
          element.remainingAmount = element.prev_inv_amount - element.prev_amount;
        });
       
        setSubConReceipt(datafromapi);
      });
  };
  
  //Insert Receipt
  const insertReceipt = (receipt) => {
    createSubCon.sub_con_id = id;
    console.log('selectedSubcon', selectedSubCon);
    const totalRemainingAmount = selectedSubCon.reduce((acc, curr) => acc + parseFloat(curr.remainingAmount), 0);
  
    if (selectedSubCon.length > 0) {
      if (createSubCon.amount && createSubCon.mode_of_payment) {
        if (parseFloat(createSubCon.amount) <= parseFloat(totalRemainingAmount)) {
          let receiptAmount = parseFloat(createSubCon.amount);
  
          for (let i = 0; i < selectedSubCon.length; i++) {
            const remainingAmount = parseFloat(selectedSubCon[i].remainingAmount);
            const paymentAmount = Math.min(remainingAmount, receiptAmount);
  
            if (paymentAmount > 0) {
              if (paymentAmount === remainingAmount) {
                selectedSubCon[i].paid = true;
                editSubConStatus(selectedSubCon[i].sub_con_work_order_id, 'Paid');
              } else {
                selectedSubCon[i].paid = true;
                editSubconPartialStatus(selectedSubCon[i].sub_con_work_order_id, 'Partially Paid');
              }
  
              insertPaymentHistory({
                creation_date: moment().format(),
                modification_date: moment().format(),
                work_order_date: '',
                invoice_paid_status: paymentAmount === remainingAmount ? 'Paid' : 'Partially Paid',
                title: '',
                installment_id: '',
                receipt_type: '',
                related_sub_con_work_order_id: '',
                gst_amount: '',
                sub_con_work_order_id: selectedSubCon[i].sub_con_work_order_id,
                sub_con_payments_id: receipt,
                published: '1',
                flag: '1',
                created_by: 'admin',
                modified_by: 'admin',
                amount: paymentAmount,
                mode_of_payment: createSubCon.mode_of_payment, // Ensure this is included
              });
  
              receiptAmount -= paymentAmount;
              if (receiptAmount === 0) break; // No need to iterate further if the receipt amount is fully distributed
            }
          }
  
          message('Data inserted successfully.');
  
          setTimeout(() => {
            setEditWorkOrderLinked(false);
            window.location.reload();
          }, 2000);
        } else {
          message('Your amount exceeds the limit.', 'warning');
        }
      } else {
        message('Please fill the required fields.', 'warning');
      }
    } else {
      message('Please select work orders to pay.', 'warning');
    }
  };
  
  let invoices = [];
  const removeObjectWithId = (arr, subConWorkerCode) => {
    const objWithIdIndex = arr.findIndex((obj) => obj.sub_con_worker_code === subConWorkerCode);

    if (objWithIdIndex > -1) {
      arr.splice(objWithIdIndex, 1);
    }

    return arr;
  };
  const getsubcon = (checkboxVal, invObj) => {
    if (checkboxVal.target.checked === true) {
      setselectedSubCon([...selectedSubCon, invObj]);
    } else {
      invoices = removeObjectWithId(selectedSubCon, invObj.sub_con_worker_code);
      setselectedSubCon(invoices);
    }
  };

  //Calculation for subcon Payment checkbox amount
  const addAndDeductAmount = (checkboxVal, receiptObj) => {
    const remainingAmount = receiptObj.prev_inv_amount - receiptObj.prev_amount;
    if (checkboxVal.target.checked === true) {
      setTotalAmount(parseFloat(totalAmount) + parseFloat(remainingAmount));
      setCreateReceipt({
        ...createSubCon,
        amount: (parseFloat(createSubCon.amount) + parseFloat(remainingAmount)).toString(),
      });
    } else {
      setTotalAmount(parseFloat(totalAmount) - parseFloat(remainingAmount));
      setCreateReceipt({
        ...createSubCon,
        amount: parseFloat(createSubCon.amount) - parseFloat(remainingAmount),
      });
    }
  };
  useEffect(() => {
    getSubConReceipt();
  }, [id]);
  return (
    <>
      <Modal size="lg" isOpen={editWorkOrderLinked}>
        <ToastContainer></ToastContainer>
        <ModalHeader>
          Create Receipt
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setEditWorkOrderLinked(false);
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
                    {SubConReceipt &&
                      SubConReceipt.map((singleInvoiceObj) => {
                        return (
                          <Row key={singleInvoiceObj.sub_con_id}>
                            <Col md="8">
                              <FormGroup check>
                                <Input
                                  onChange={(e) => {
                                    addAndDeductAmount(e, singleInvoiceObj);
                                    getsubcon(e, singleInvoiceObj);
                                  }}
                                  name="sub_con_worker_code(prev_inv_amount)"
                                  type="checkbox"
                                />
                                <span>
                                  {singleInvoiceObj.sub_con_worker_code} (
                                  {singleInvoiceObj.prev_inv_amount}) Paid - {' '}
                                  {singleInvoiceObj.prev_amount}
                                </span>
                              </FormGroup>
                            </Col>
                          </Row>
                        );
                      })}
                    <br></br>
                    {SubConReceipt && SubConReceipt.length > 0 ? (
                      <Row>
                        <Col md="8">
                          <FormGroup>
                            <Label>{' '} Amount <span className="required">*</span>{' '}</Label>
                            <Input
                              type="numbers"
                              onChange={handleInputreceipt}
                              value={createSubCon && createSubCon.amount}
                              defaultValue={totalAmount.toString()}
                              name="amount"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="8">
                          <FormGroup>
                            <Label>
                            {' '}
                             Mode Of Payment <span className="required">*</span>
                             {' '} 
                             </Label>
                            <Input
                              type="select"
                              name="mode_of_payment"
                              onChange={handleInputreceipt}
                              value={createSubCon.mode_of_payment || ''}
                                                          >
                              <option value="" selected="selected">
                                Please Select
                              </option>
                              <option value="cash">Cash</option>
                              <option value="cheque">Cheque</option>
                              <option value="giro">Giro</option>
                            </Input>
                          </FormGroup>
                        </Col>

                        <Col md="8">
                          <FormGroup>
                            <Label>Notes</Label>
                            <Input
                              type="text"
                              onChange={handleInputreceipt}
                              defaultValue={createSubCon && createSubCon.remarks}
                              name="remarks"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    ) : (
                      <span>Sorry No invoice Available</span>
                    )}
                  </Form>
                </CardBody>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            className="shadow-none"
            color="primary"
            onClick={() => {
              insertReceipt();
              
            }}
          >
            {' '}
            Submit{' '}
          </Button>
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setEditWorkOrderLinked(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default WorkOrderLinked;
