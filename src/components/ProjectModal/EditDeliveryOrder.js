import React, { useState, useEffect } from 'react';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter,Form,Row,Col } from 'reactstrap';
import PropTypes from 'prop-types';

import message from '../Message';
import api from '../../constants/api';
 import DeliveryModalTable from './DeliveryOrder/DeliveryModalTable';

const EditDeliveryOrder = ({ editDeliveryOrder, setEditDeliveryOrder, data, tabdeliveryorder}) => {
  
  EditDeliveryOrder.propTypes = {
    editDeliveryOrder: PropTypes.bool,
    setEditDeliveryOrder: PropTypes.func,
    data: PropTypes.string,
    tabdeliveryorder:PropTypes.any
  };
  const [delivery, setDelivery] = useState({});
  const [deliveryHistory, setDeliveryHistory] = useState();
  
console.log('tabdeliveryorder',tabdeliveryorder)
  const handleInputs = (e) => {
    setDelivery({ ...delivery, [e.target.name]: e.target.value });
  };

  const getDeliveryOrder = () => {
    api
      .post('/projecttabdeliveryorder/getDeliveryOrder', { delivery_order_id: tabdeliveryorder.delivery_order_id})
      .then((res) => {
        setDelivery(res.data.data[[0]]);
        console.log('deliveryorder',res.data.data);
      });
  };

  const TabDeliveryOrderHistory = () => {
    api
      .post('/projecttabdeliveryorder/TabDeliveryOrderHistoryId', { delivery_order_id: data })
      .then((res) => {
        setDeliveryHistory(res.data.data);
        console.log("res",res.data.data);
      })
      .catch(() => {
        message('Unable to add Delivery Order Item', 'error');
      });
  };

  

//edit delivery order
const editDelivery = () => {
  const updatedDelivery = { ...delivery };
  updatedDelivery.delivery_order_id = tabdeliveryorder.delivery_order_id;

  api
    .post('/projecttabdeliveryorder/editTabDeliveryOrder', updatedDelivery)
    .then(() => {
      message('Delivery Order edited successfully.', 'success');
    })
    .catch(() => {
      message('Network connection error.');
    });
};

  //edit delivery items
  const editDeliveryProducts = () => {
    deliveryHistory.forEach((el) => {
      api
        .post('/purchaseorder/editDelieryOrderHistory', el)
        .then(() => {
          message('Record editted successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    });
  };

  //handle inputs
  function updateState(index, property, e) {
    const copyDeliverOrderProducts = [...deliveryHistory];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };
    copyDeliverOrderProducts[index] = updatedObject;
    setDeliveryHistory(copyDeliverOrderProducts);
  }

  useEffect(() => {
    getDeliveryOrder(data)
    TabDeliveryOrderHistory(data);
  }, [data]);

  return (
    <>
      <Modal size="xl" isOpen={editDeliveryOrder}>
        <ModalHeader>
          Edit Delivery Order
          <Button
            color="secondary"
            onClick={() => {
              setEditDeliveryOrder(false);
            }}
          >
            {' '}
            X{' '}
          </Button>
        </ModalHeader>

        <ModalBody>
          
        <Form>
            <Row>
              <DeliveryModalTable delivery={delivery} handleInputs={handleInputs} />
              
            </Row>
            <Row>
              <Col>
          <table className="lineitem">
            <thead>
              <tr>
              <th scope="col">Line/Equipment No</th>
                <th scope="col">Work Description</th>
                <th scope="col">Item</th>
                <th scope="col">Size</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unit</th>
              </tr>
            </thead>
            <tbody>
              {deliveryHistory &&
                deliveryHistory.map((res, index) => {
                  return (
                    <>
                      <tr>
                      <td data-label="Item">
                          <Input  type="text" name="equipment_no" value={res.equipment_no} />
                        </td>
                        <td data-label="Item">
                          <Input disabled type="text" name="item_title" value={res.item_title} />
                        </td>
                        <td data-label="Item">
                          <Input
                            type="text"
                            name="item"
                            value={res.item}
                            onChange={(e) => updateState(index, 'item', e)}
                          />
                        </td>
                        <td data-label="Size">
                          <Input
                            type="text"
                            name="size"
                            value={res.size}
                            onChange={(e) => updateState(index, 'size', e)}
                          >
                            
                          </Input>
                        </td>
                        <td data-label="Quantity">
                          <Input
                            type="text"
                            name="quantity"
                            value={res.quantity}
                            onChange={(e) => updateState(index, 'quantity', e)}
                          ></Input>
                        </td>
                        <td data-label="Unit">
                          <Input
                            type="text"
                            name="unit"
                            value={res.unit}
                            onChange={(e) => updateState(index, 'unit', e)}
                          ></Input>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
          </Col>
            </Row>
                <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              editDeliveryProducts();
              editDelivery();
              setEditDeliveryOrder(false);
            }}
          >
            {' '}
            Submit{' '}
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditDeliveryOrder(false);
            }}
          >
            {' '}
            Close{' '}
          </Button>
        </ModalFooter>
        </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditDeliveryOrder;
