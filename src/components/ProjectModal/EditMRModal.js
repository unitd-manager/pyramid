import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Form,
} from 'reactstrap';
import PropTypes from 'prop-types';
//import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';

const EditMRModal = ({ editMR, setEditMR, data }) => {
  EditMRModal.propTypes = {
    editMR: PropTypes.bool,
    setEditMR: PropTypes.func,
    data: PropTypes.array,
  };

  const [editMaterialTabPurchaseOrder, setEditMaterialTabPurchaseOrder] = useState();
 
  const GetPoData = () => {
    api
      .post('/materialrequest/getMaterialRequestById', { material_request_id: data[0].material_request_id })
      .then((res) => {
        setEditMaterialTabPurchaseOrder(res.data.data[0]);
        console.log('editpo',res.data.data[0])
      })
      .catch(() => {
        message('', 'info');
      });
  };

  const handleInputs = (e) => {
    setEditMaterialTabPurchaseOrder({
      ...editMaterialTabPurchaseOrder,
      [e.target.name]: e.target.value,
    });
    console.log('Fetched Data', editMaterialTabPurchaseOrder);
  };

  const UpdateData = () => {
    api
      .post('/materialrequest/editMaterialRequest', editMaterialTabPurchaseOrder)
      .then(() => {
        message('Record editted successfully', 'success');
        //setTimeout(() => {
        //   window.location.reload();
        // }, 300);

      })
      .catch(() => {
        message(' Record Not editted successfully', 'info');
      });
  };

  useEffect(() => {
    setEditMaterialTabPurchaseOrder(data);
  
    GetPoData();
  }, [data]);

  return (
    <>
      <Modal size="lg" isOpen={editMR}>
        <ModalHeader> Edit Material Request </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Form>
              <FormGroup>
                <Row>
                 
                  <Col md="4">
                    <FormGroup>
                      <Label>MR  Date</Label>
                      <Input
                        type="date"
                        name="mr_date"
                        defaultValue={
                          editMaterialTabPurchaseOrder && editMaterialTabPurchaseOrder.mr_date
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Request Date</Label>
                      <Input
                        type="date"
                        name="request_by"
                        defaultValue={
                          editMaterialTabPurchaseOrder && editMaterialTabPurchaseOrder.request_by
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Request By</Label>
                      <Input
                        type="text"
                        name="request_by"
                        defaultValue={
                          editMaterialTabPurchaseOrder && editMaterialTabPurchaseOrder.request_by
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Delivery Date</Label>
                      <Input
                        type="date"
                        name="delivery_date"
                        defaultValue={
                          editMaterialTabPurchaseOrder &&
                            editMaterialTabPurchaseOrder.mr_code
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Delivery Terms</Label>
                      <Input
                        type="text"
                        name="delivery_terms"
                        defaultValue={
                          editMaterialTabPurchaseOrder && editMaterialTabPurchaseOrder.delivery_terms
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Mobile</Label>
                      <Input
                        type="text"
                        name="mobile"
                        defaultValue={
                          editMaterialTabPurchaseOrder && editMaterialTabPurchaseOrder.mobile
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Payment</Label>
                      <Input
                        type="text"
                        name="payment"
                        defaultValue={
                          editMaterialTabPurchaseOrder && editMaterialTabPurchaseOrder.payment
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Shipping method</Label>
                      <Input
                        type="text"
                        name="shipping_method"
                        defaultValue={
                          editMaterialTabPurchaseOrder &&
                          editMaterialTabPurchaseOrder.shipping_method
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Site Reference</Label>
                      <Input
                        type="text"
                        name="site_reference"
                        defaultValue={
                          editMaterialTabPurchaseOrder && editMaterialTabPurchaseOrder.site_reference
                        }
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <FormGroup>
                    <Label>PaymentTerms</Label>
                    <Input
                      type="textarea"
                      name="payment_terms"
                      defaultValue={
                        editMaterialTabPurchaseOrder && editMaterialTabPurchaseOrder.payment_terms
                      }
                      onChange={handleInputs}
                    />
                  </FormGroup>
                </Row>

                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      type="button"
                      className="btn mr-2 shadow-none"
                      color="primary"
                      onClick={() => {
                        UpdateData();
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      color="secondary"
                      className="shadow-none"
                      onClick={() => {
                        setEditMR(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </FormGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditMRModal;
