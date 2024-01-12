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
  ModalFooter,
  Label,
} from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';
import message from '../Message';

const EditPOLineItemsModal = ({ editPOLineItemsModal, setEditPOLineItemsModal, data }) => {
  EditPOLineItemsModal.propTypes = {
    editPOLineItemsModal: PropTypes.bool,
    setEditPOLineItemsModal: PropTypes.func,
    data: PropTypes.array,
  };

  const [getProductValue, setProductValue] = useState();
  const [newItems, setNewItems] = useState([]);
  const [purchase, setPurchase] = useState(data[0]);
  const [items, setItems] = useState(data);
  const [addNewProductModal, setAddNewProductModal] = useState(false);
  const AddMoreItem = () => {
    const item = newItems.slice();
    item.push(1);
    setNewItems(item)
  };
console.log('purchase',purchase);
  const handleInputs = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };

  function updateState(index, property, e) {
    const copyDeliverOrderProducts = [...items];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };
    copyDeliverOrderProducts[index] = updatedObject;
    setItems(copyDeliverOrderProducts);
  }
  function updateNewItemState(index, property, e) {
    const copyDeliverOrderProducts = [...newItems];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e?.target?.value || e?.value };
    copyDeliverOrderProducts[index] = updatedObject;
    setNewItems(copyDeliverOrderProducts);
  }

  //edit purchase
  const editPurchase = () => {
    // api.post('/purchaseorder/editTabPurchaseOrder',purchase)
    // .then(() => {
    //   message('Record editted successfully', 'success');
    // })
    // .catch(() => {
    //   message('Unable to edit record.', 'error');
    // });
  };

  //edit delivery items
  const editLineItems = () => {
    items.forEach((el) => {
      api
        .post('/purchaseorder/editTabPurchaseOrderLineItem', el)
        .then(() => {
          message('Record editted successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    });
  };

  const getTotalOfPurchase = () => {
    let total = 0;
    items.forEach((a) => {
      const amount = parseInt(a.qty, 10) * parseFloat(a.cost_price, 10);
       total += Number.isNaN(amount) ? 0 : amount;
    });
    return total;
  };

  //insert po items
  const insertPoItems = () => {
    newItems.forEach((el) => {
      api
        .post('/purchaseorder/insertPoProduct', el)
        .then(() => {
          message('Record editted successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    });
  };

  //Clear row value
  const ClearValue = (index, newItem) => {
    let arr = [];
    let setArr;
    
    if (newItem) {
      arr = [...newItems];
      setArr = setNewItems;
    }else {
      arr = [...items];
      setArr = setItems;
    }

    const updatedObject = { ...arr[index], 
      item_title: "",
      unit: "",
      qty: "0",
      cost_price: "0",
      description: "",
    };
    arr[index] = updatedObject;
    setArr(arr);
  };

  const getProduct = () => {
    api.get('/product/getProducts').then((res) => {
      const arr = res.data.data;
      const finaldat = [];
      arr.forEach((item) => {
        finaldat.push({ value: item.product_id, label: item.title });
      });
      setProductValue(finaldat);
    });
  };
  useEffect(
    () => {
      getProduct();
      return () => {
        setItems(data);
      }
    }, []
  )

  return (
    <>
      <Modal size="xl" isOpen={editPOLineItemsModal}>
        <ModalHeader>Edit PO Line Items</ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <Col md="3">
                    <Button
                      color="primary"
                      className="shadow-none"
                      onClick={() => {
                        setAddNewProductModal(true);
                      }}
                    >
                      Add New Product
                    </Button>
                  </Col>
                  <Col md="3">
                    <Button color="primary" className="shadow-none" onClick={AddMoreItem}>
                      Add More Items
                    </Button>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md="3">
                    <Label>Supplier</Label>
                    <Input
                      disabled
                      type="text"
                      name="supplier"
                      value={purchase && purchase.company_name}
                    />
                  </Col>
                  <Col md="3">
                    <Label>PO Date</Label>
                    <Input
                      type="date"
                      name="po_date"
                      value={moment(purchase && purchase.po_date).format('YYYY-MM-DD')}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Col md="3">
                    <Label>PO No.</Label>
                    <Input
                      type="text"
                      name="po_no"
                      value={purchase && purchase.po_code}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>Gst</Label>
                      <br></br>
                      <Label>Yes</Label>
                      &nbsp;
                      <Input
                        name="gst"
                        value="1"
                        type="radio"
                        defaultChecked={purchase && purchase.gst === 1 && true}
                        onChange={handleInputs}
                      />
                      &nbsp; &nbsp;
                      <Label>No</Label>
                      &nbsp;
                      <Input
                        name="gst"
                        value="0"
                        type="radio"
                        defaultChecked={purchase && purchase.gst === 0 && true}
                        onChange={handleInputs}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <FormGroup className="mt-3"> Total Amount :{getTotalOfPurchase()}</FormGroup>
                </Row>
              </Col>
            </Row>

            <table className="lineitem">
              <thead>
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">UoM</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Remarks</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((el, index) => {
                  const amount = el.cost_price * el.qty;
                  return (
                    <tr key={el.po_product_id}>
                      <td data-label="ProductName">
                        <Input
                          type="text"
                          name="item_title"
                          value={el.item_title}
                          onChange={(e) => updateState(index, 'item_title', e)}
                        />
                      </td>
                      <td data-label="unit">
                        <Input
                          type="text"
                          name="unit"
                          value={el.unit}
                          onChange={(e) => updateState(index, 'unit', e)}
                        />
                      </td>
                      <td data-label="qty">
                        <Input
                          type="text"
                          name="qty"
                          value={el.qty}
                          onChange={(e) => updateState(index, 'qty', e)}
                        />
                      </td>
                      <td data-label="Unit Price">
                        <Input
                          type="text"
                          name="cost_price"
                          value={el.cost_price}
                          onChange={(e) => updateState(index, 'cost_price', e)}
                        />
                      </td>
                      <td data-label="Total Price">{Number.isNaN(amount) ? 0 : amount}</td>
                      <td data-label="Remarks">
                        <Input
                          type="textarea"
                          name="description"
                          value={el.description}
                          onChange={(e) => updateState(index, 'description', e)}
                        />
                      </td>
                      <td data-label="Action">
                        <div className='anchor'>
                          <span onClick={()=>ClearValue(index)}>Clear</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {newItems?.map((elem, index) => {
                  const amount = elem.cost_price * elem.qty;
                  return (
                    <tr key={elem}>
                      <td data-label="ProductName">
                        <Select
                          key={elem.id}
                          defaultValue={{ value: elem.product_id, label: elem.title }}
                          onChange={(e) => {
                            updateNewItemState(index, 'item_title', e)
                          }}
                          options={getProductValue}
                        />
                        <Input
                          value={elem.product_id}
                          type="hidden"
                          name="product_id"
                          onChange={(e) => updateState(index, 'product_id', e)}
                        ></Input>
                        <Input
                          value={elem.title}
                          type="hidden"
                          name="title"
                          onChange={(e) => updateState(index, 'title', e)}
                        ></Input>
                        {/* <Input
                          type="text"
                          name="item_title"
                          value={elem.item_title}
                          onChange={(e) => updateNewItemState(index, 'item_title', e)}
                        /> */}
                      </td>
                      <td data-label="UoM">
                        <Input
                          type="text"
                          name="unit"
                          value={elem.unit}
                          onChange={(e) => updateNewItemState(index, 'unit', e)}
                        />
                      </td>
                      <td data-label="Qty">
                        <Input
                          type="text"
                          name="qty"
                          value={elem.qty}
                          onChange={(e) => updateNewItemState(index, 'qty', e)}
                        />
                      </td>
                      <td data-label="Unit Price">
                        <Input
                          type="text"
                          name="cost_price"
                          value={elem.cost_price}
                          onChange={(e) => updateNewItemState(index, 'cost_price', e)}
                        />
                      </td>
                      <td data-label="Total Price">{Number.isNaN(amount) ? 0 : amount}</td>
                      <td data-label="Remarks">
                        <Input
                          type="textarea"
                          name="description"
                          value={elem.description}
                          onChange={(e) => updateNewItemState(index, 'description', e)}
                        />
                      </td>
                      <td data-label="Action">
                        <div className='anchor'>
                          <span onClick={()=>ClearValue(index, true)}>Clear</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              editPurchase();
              editLineItems();
              insertPoItems();
              setEditPOLineItemsModal(false);
            }}
          >
            Submit
          </Button>
          <Button
            color="secondar"
            className="shadow-none"
            onClick={() => {
              setEditPOLineItemsModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add New Product Modal */}
      <Modal size="lg" isOpen={addNewProductModal}>
        <ModalHeader>Add New Materials / Tools</ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <FormGroup>
                    <Row>
                      <Label sm="3">
                        Product Name <span className="required"> *</span>
                      </Label>
                      <Col sm="9">
                        <Input type="text" name="product_name" />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3">
                        Product Type <span className="required"> *</span>
                      </Label>
                      <Col sm="9">
                        <Input type="select" name="product_type">
                          <option value="">Please Select</option>
                          <option defaultValue="selected" value="Materials">
                            Materials
                          </option>
                          <option value="Tools">Tools</option>
                        </Input>
                      </Col>
                    </Row>
                  </FormGroup>
                </Row>
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              setAddNewProductModal(false);
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setAddNewProductModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditPOLineItemsModal;
