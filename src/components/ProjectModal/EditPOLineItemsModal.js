import React, { useState, useEffect } from 'react';
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
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from 'react-select';
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';

const EditPOLineItemsModal = ({
  editPOLineItemsModal,
  setEditPOLineItemsModal,
  data,
  projectId,
}) => {
  EditPOLineItemsModal.propTypes = {
    editPOLineItemsModal: PropTypes.bool,
    setEditPOLineItemsModal: PropTypes.func,
    data: PropTypes.array,
    projectId: PropTypes.string,
  };

  const [newItems, setNewItems] = useState([]);
  const [purchase, setPurchase] = useState(projectId);
  const [addLineItem, setAddLineItem] = useState(data);
  const [addNewProductModal, setAddNewProductModal] = useState(false);
  const [addMoreItem, setMoreItem] = useState(0);
  const [getProductValue, setProductValue] = useState();
  const [productDetail, setProductDetail] = useState({
    category_id: null,
    sub_category_id: null,
    title: '',
    product_code: '',
    qty_in_stock: null,
    price: null,
    published: 0,
  });

  const AddMoreItem = () => {
    setMoreItem(addMoreItem + 1);
  };
  console.log('po', data);
  const handleInputs = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };

  const handleNewProductDetails = (e) => {
    setProductDetail({ ...productDetail, [e.target.name]: e.target.value });
  };

  function updateState(index, property, e) {
    const copyDeliverOrderProducts = [...addLineItem];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };
    copyDeliverOrderProducts[index] = updatedObject;
    setAddLineItem(copyDeliverOrderProducts);
  }
  function updateNewItemState(index, property, e) {
    const copyDeliverOrderProducts = [...newItems];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };
    copyDeliverOrderProducts[index] = updatedObject;
    setNewItems(copyDeliverOrderProducts);
  }
  console.log('product', addLineItem);
  // const getProduct = () => {
  //   api.get('/product/getProducts').then((res) => {

  //     const items1 = res.data.data;
  //     const finaldat = [];
  //     items1.forEach((item) => {
  //       finaldat.push({ value: item.product_id, label: item.title });
  //     });
  //     setProductValue(finaldat);
  //   });
  // };
  //   Get Products
  const getProduct = () => {
    api.get('/product/getProducts').then((res) => {
      const items = res.data.data;
      const finaldat = [];
      items.forEach((item) => {
        finaldat.push({ value: item.product_id, label: item.title });
      });
      setProductValue(finaldat);
    });
  };

  const onchangeItem1 = (str, itemId) => {
    const element = addLineItem.find((el) => el.id === itemId);
    element.item_title = str.label;
    element.itemId = str.value;
    setAddLineItem(addLineItem);
  };

  // //onchange function
  const onchangeItem = (selectedValue) => {
    const updatedItems = addLineItem.map((item) => {
      if (item.unit === selectedValue.value) {
        // Compare with selectedValue.value
        return {
          ...item,
          unit: selectedValue.value, // Update the unit with the selected option's value
          value: selectedValue.value, // Update the value with the selected option's value
        };
      }
      return item;
    });
    setMoreItem(updatedItems);
  };

  const [unitdetails, setUnitDetails] = useState();
  // Fetch data from API
  const getUnit = () => {
    api.get('/product/getUnitFromValueList', unitdetails).then((res) => {
      const items = res.data.data;
      const finaldat = [];
      items.forEach((item) => {
        finaldat.push({ value: item.value, label: item.value });
      });
      setUnitDetails(finaldat);
    });
  };
  const TabMaterialsPurchased = () => {
    api
      .get('/purchaseorder/TabPurchaseOrderLineItem')
      .then((res) => {
        const items1 = res.data.data;
        const finaldat = [];
        items1.forEach((item) => {
          finaldat.push({ value: item.product_id, label: item.title });
        });
      })
      .catch(() => {
        message('Tab Purchase Order not found', 'info');
      });
  };
  const insertProduct = (ProductCode, ItemCode) => {
    if (productDetail.title !== '') {
      productDetail.product_code = ProductCode;
      productDetail.item_code = ItemCode;
      productDetail.creation_date = creationdatetime;
      api
        .post('/purchaseorder/insertPurchaseProduct', productDetail)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Product inserted successfully.', 'success');
          //getProduct();
          api
            .post('/product/getCodeValue', { type: 'InventoryCode' })
            .then((res1) => {
              const InventoryCode = res1.data.data;
              message('inventory created successfully.', 'success');
              api
                .post('/inventory/insertinventory', {
                  product_id: insertedDataId,
                  inventory_code: InventoryCode,
                })

                .then(() => {
                  message('inventory created successfully.', 'success');
                  //  getProduct();
                });
            })
            .catch(() => {
              message('Unable to create inventory.', 'error');
            });
        })
        .catch(() => {
          message('Unable to insert product.', 'error');
        });
    } else {
      message('Please fill the Product Name ', 'warning');
    }
  };
  //Auto generation code
  const generateCode = () => {
    api
      .post('/product/getCodeValue', { type: 'ProductCode' })
      .then((res) => {
        const ProductCode = res.data.data;
        api.post('/product/getCodeValue', { type: 'ItemCode' }).then((response) => {
          const ItemCode = response.data.data;
          insertProduct(ProductCode, ItemCode);
        });
      })
      .catch(() => {
        insertProduct('');
      });
  };

  //edit purchase
  const editPurchase = () => {
    const purchaseRecord = {
      po_code: purchase.po_code,
      purchase_order_id: purchase.purchase_order_id,
      purchase_order_date: purchase.purchase_order_date,
      gst: purchase.gst,
    };
    api
      .post('/purchaseorder/editPurchaseOrder', purchaseRecord)
      .then(() => {
        message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  //edit delivery items
  const editLineItems = () => {
    addLineItem.forEach((el) => {
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
    addLineItem.forEach((a) => {
      total += parseInt(a.qty, 10) * parseFloat(a.cost_price, 10);
    });
    return total;
  };

  //insert po items
  // const insertPoItems = () => {
  //   newItems.forEach((el) => {
  //     api
  //       .post('/purchaseorder/insertPoProduct', el)
  //       .then(() => {
  //         message('Record editted successfully', 'success');
  //       })
  //       .catch(() => {
  //         message('Unable to edit record.', 'error');
  //       });
  //   });
  // };
  const insertPoItems = (PurchaseOrderId, itemObj) => {
    addLineItem.forEach(() => {
      api
        .post('/purchaseorder/insertPoProduct', {
          purchase_order_id: PurchaseOrderId,
          item_title: itemObj.Item,
          quantity: Number(itemObj.qty).toFixed(2),
          unit: itemObj.unit,
          amount: 0,
          description: itemObj.description,
          creation_date: new Date(),
          modification_date: new Date(),
          created_by: '1',
          modified_by: '1',
          status: 'In Progress',
          cost_price: Number(itemObj.cost_price).toFixed(2),
          selling_price: itemObj.mrp,
          qty_updated: parseInt(itemObj.qty, 10),
          qty: parseInt(itemObj.qty, 10),
          product_id: parseInt(itemObj.itemId, 10),
          //supplier_id: insertPurchaseOrderData.supplier_id,
          gst: Number(itemObj.gst).toFixed(2),
          damage_qty: 0,
          brand: '',
          qty_requested: Number(0).toFixed(2),
          qty_delivered: Number(0).toFixed(2),
          price: Number(itemObj.price).toFixed(2),
        })
        .then(() => {
          //setAddPurchaseOrderModal(false);
          message('Product Added!', 'success');
          //window.location.reload();
        })

        .catch(() => {
          message('Unable to add Product!', 'error');
        });
    });
  };
  // const onchangeItem = (str, itemId) => {
  //   const element = addMoreItem.find((el) => el.id === itemId);
  //   element.Item = str.label;
  //   element.itemId = str.value;
  //   setMoreItem(addMoreItem);
  // };
  // Clear row value
  // const ClearValue = (ind) => {
  //   setMoreItem((current) =>
  //     current.filter((obj) => {
  //       return obj.id !== ind.id;
  //     }),
  //   );
  // };
  useEffect(() => {
    getUnit();
    getProduct();
    //getMaxItemcode();
    TabMaterialsPurchased();
    //getSupplier();
  }, []);
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
                      value={moment(purchase && purchase.purchase_order_date).format('YYYY-MM-DD')}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Col md="3">
                    <Label>PO No.</Label>
                    <Input
                      type="text"
                      name="po_code"
                      value={purchase && purchase.po_code}
                      onChange={handleInputs}
                    />
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Label>VAT</Label>
                      <br></br>
                      <Label>Yes</Label>
                      &nbsp;
                      <Input
                        name="gst"
                        value="1"
                        type="radio"
                        defaultChecked={purchase && purchase.gst === '1' && true}
                        onChange={handleInputs}
                      />
                      &nbsp; &nbsp;
                      <Label>No</Label>
                      &nbsp;
                      <Input
                        name="gst"
                        value="0"
                        type="radio"
                        defaultChecked={purchase && purchase.gst === '0' && true}
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
                {addLineItem &&
                  addLineItem.map((el, index) => {
                    return (
                      <tr key={el.id}>
                        <td data-label="title">
                          {/* <Select
                          key={el.id}
                          defaultValue={{ value: el.product_id, label: el.item_title }}
                          onChange={(e) => {
                            onchangeItem(e, el.id);
                          }}
                          options={getProductValue}
                        /> */}
                          {/* <Input
                          value={el.product_id}
                          type="text"
                          name="product_id"
                          onChange={(e) => updateState(index, 'product_id', e)}
                        ></Input> */}
                         <Select
                          key={el.id}
                          defaultValue={{ value: el.product_id, label: el.item_title }}
                          onChange={(e) => {
                            onchangeItem1(e, el.id);
                          }}
                          options={getProductValue}
                        />
                       
                        <Input
                          value={el.item_title}
                          type="hidden"
                          name="item_title"
                          onChange={(e) => updateState(index, 'item_title', e)}
                        ></Input>
                     
                          {/* <Input
                            value={el.item_title}
                            type="text"
                            name="item_title"
                            onChange={(e) => updateState(index, 'item_title', e)}
                          ></Input> */}

                          {/* <Input
                          value={el.product_id}
                          type="hidden"
                          name="product_id"
                          onChange={(e) => updateState(index, 'product_id', e)}
                        ></Input>
                        <Input
                          value={el.title}
                          type="hidden"
                          name="title"
                          onChange={(e) => updateState(index, 'title', e)}
                        ></Input> */}
                        </td>
                        {/* <td data-label="unit">
                        <Input
                          type="text"
                          name="unit"
                          value={el.unit}
                          onChange={(e) => updateState(index, 'unit', e)}
                        />
                      </td> */}
                        <td data-label="Unit">
                          <Select
                            name="unit"
                            onChange={(selectedOption) => {
                              onchangeItem(selectedOption);
                            }}
                            options={unitdetails}
                          ></Select>
                          {/* <Input
                          type="select"
                          name="unit"
                          onChange={handleInputs}
                          value={el && el.unit}
                        >
                          <option defaultValue="selected">Please Select</option>
                          {unitdetails &&
                            unitdetails.map((ele) => {
                              return (
                                <option key={ele.value} value={ele.value}>
                                  {ele.value}
                                </option>
                              );
                            })} */}
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
                        <td data-label="Total Price">{el.cost_price * el.qty}</td>
                        <td data-label="Remarks">
                          <Input
                            type="textarea"
                            name="description"
                            value={el.description}
                            onChange={(e) => updateState(index, 'description', e)}
                          />
                        </td>
                        <td data-label="Action">
                          <div className="anchor">
                            <span>Clear</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {[...Array(addMoreItem)].map((elem, index) => {
                  return (
                    <tr key={addMoreItem}>
                      <td data-label="ProductName">
                        {/* <Select
                          key={el.id}
                          defaultValue={{ value: el.product_id, label: el.item_title }}
                          onChange={(e) => updateNewItemState(index, 'item_title', e)}
                          options={getProductValue}
                        /> */}
                        <Input
                          type="text"
                          name="item_title"
                          value={elem && elem.item_title}
                          onChange={(e) => updateNewItemState(index, 'item_title', e)}
                        />
                      </td>
                      <td data-label="UoM">
                        <Input
                          type="text"
                          name="unit"
                          value={elem && elem.unit}
                          onChange={(e) => updateNewItemState(index, 'unit', e)}
                        />
                      </td>
                      <td data-label="Qty">
                        <Input
                          type="text"
                          name="qty"
                          value={elem && elem.qty}
                          onChange={(e) => updateNewItemState(index, 'qty', e)}
                        />
                      </td>
                      <td data-label="Unit Price">
                        <Input
                          type="text"
                          name="cost_price"
                          value={elem && elem.cost_price}
                          onChange={(e) => updateNewItemState(index, 'cost_price', e)}
                        />
                      </td>
                      <td data-label="Total Price">{elem && elem.cost_price * elem && elem.qty}</td>
                      <td data-label="Remarks">
                        <Input
                          type="textarea"
                          name="description"
                          value={elem && elem.description}
                          onChange={(e) => updateNewItemState(index, 'description', e)}
                        />
                      </td>
                      <td data-label="Action">
                        <div className="anchor">
                          <span>Clear</span>
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
            onClick={async () => {
              await editPurchase();
              await editLineItems();
              await insertPoItems();
              await setEditPOLineItemsModal(false);

              //getProduct();
              //     setTimeout(() => {
              //   window.location.reload();
              // }, 1500);
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
                      <Col sm="8">
                        <Input
                          type="text"
                          name="title"
                          onChange={handleNewProductDetails}
                          value={productDetail.title}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Label sm="3">
                        Product Type <span className="required"> *</span>
                      </Label>
                      <Col sm="9">
                        <Input
                          type="select"
                          name="product_type"
                          onChange={handleNewProductDetails}
                          value={productDetail.product_type}
                        >
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
              generateCode();
              setTimeout(() => {
                //getProduct();
                setAddNewProductModal(false);
              }, 500);
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
