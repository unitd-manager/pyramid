import React, { useState } from 'react';
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Button,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { useParams } from 'react-router-dom';
import api from '../../constants/api';
import message from '../Message';


const EditLineItemModal = ({ editJobLineModal, setEditJobLineModal, editLineModelItem, onEditSuccess }) => {
  EditLineItemModal.propTypes = {
    editJobLineModal: PropTypes.bool,
    setEditJobLineModal: PropTypes.func,
    editLineModelItem: PropTypes.object,
    onEditSuccess: PropTypes.func,
   
  };
const {id}=useParams();
  const [lineItemData, setLineItemData] = useState(null);
  const [totalAmount, setTotalAmount] = useState();
  const [quoteData, setQuoteData] = useState();

  const handleData = (e) => {
    setLineItemData({ ...lineItemData, [e.target.name]: e.target.value });
  };
  const getQuote = () => {
    api.post('/project/getJobByProjectId', { project_id: id }).then((res) => {
      setQuoteData(res.data.data[0]);
    });
  };
  const handleCalc = (Qty, UnitPrice, TotalPrice) => {
    if (!Qty) Qty = 0;
    if (!UnitPrice) UnitPrice = 0;
    if (!TotalPrice) TotalPrice = 0;

    setTotalAmount(parseFloat(Qty) * parseFloat(UnitPrice));
  };
  const getLineItem = () => {
    api.post('/project/getJobLineItemsById', { job_order_id: quoteData.job_order_id }).then(() => {
      console.log('222222222:', quoteData.job_order_id);

    })
    .catch((error) => {
      console.error('Error fetching line items:', error);
      message('LineItem Data not found', 'info');
    });
  };
  const UpdateData = () => {
    lineItemData.job_order_id=quoteData.job_order_id;
    //lineItemData.amount=totalAmount;
    lineItemData.total_amount = parseFloat(lineItemData.quantity) * parseFloat(lineItemData.unit_price) 
    api
      .post('/project/editJoborderItems', lineItemData)
      .then(() => {
       
        getLineItem();
        onEditSuccess(); // Call the callback function
      
      })
      .catch(() => {
        message('Unable to edit quote. please fill all fields', 'error');
      });
  };

  React.useEffect(() => {
    getQuote();
    setLineItemData(editLineModelItem);
  }, [editLineModelItem]);

  return (
    <>
      <Modal isOpen={editJobLineModal}>
        <ModalHeader>Edit Line Item</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row>
              <Label sm="2">Title</Label>
              <Col sm="10">
                <Input
                  type="text"
                  name="title"
                  defaultValue={lineItemData && lineItemData.title}
                  onChange={handleData}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Label sm="2">Description</Label>
              <Col sm="10">
                <Input
                  type="textarea"
                  name="description"
                  defaultValue={lineItemData && lineItemData.description}
                  onChange={handleData}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Label sm="2">Unit</Label>
              <Col sm="10">
                <Input
                  type="textarea"
                  name="unit"
                  defaultValue={lineItemData && lineItemData.unit}
                  onChange={handleData}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Label sm="2">Qty</Label>
              <Col sm="10">
                <Input
                  type="textarea"
                  name="quantity"
                  defaultValue={lineItemData && lineItemData.quantity}
                  onChange={(e)=>{handleData(e);
                    handleCalc(e.target.value, lineItemData.unit_price,lineItemData.total_amount
                      )}}
                 
                />
              </Col>
            </Row>
          </FormGroup>
          
          <FormGroup>
            <Row>
              <Label sm="2">Unit Price</Label>
              <Col sm="10">
                <Input
                  type="text"
                  name="unit_price"
                  defaultValue={lineItemData && lineItemData.unit_price}
                  onChange={(e)=>{handleData(e);
                    handleCalc(lineItemData.quantity,e.target.value,lineItemData.total_amount)
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Label sm="2">Total Price</Label>
              <Col sm="10">
                <Input
                  type="text"
                  name="amount"
                  value={totalAmount || lineItemData && lineItemData.total_amount}
                  onChange={(e)=>{handleData(e);
                    handleCalc(lineItemData.quantity,lineItemData.unit_price,e.target.value)
                  }}
                  disabled
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Label sm="2">Remarks</Label>
              <Col sm="10">
                <Input
                  type="textarea"
                  name="remarks"
                  defaultValue={lineItemData && lineItemData.remarks}
                  onChange={handleData}
                />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            type="button"
            onClick={() => {
              UpdateData();
              setEditJobLineModal(false);
            }}
          >
            Save & Continue
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditJobLineModal(false);
            }}
          >
            {' '}
            Cancel{' '}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditLineItemModal;
