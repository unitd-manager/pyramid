import React, { useState,useEffect } from 'react';
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
  Label
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw,EditorState,ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Select from 'react-select';
import * as $ from 'jquery';
import random from 'random';
import api from '../../constants/api';
import message from '../Message';
import InvoiceTable from './InvoiceTable';

const FinanceInvoiceData = ({ editInvoiceData, setEditInvoiceData, projectInfo, orderId }) => {
  FinanceInvoiceData.propTypes = {
    editInvoiceData: PropTypes.bool,
    setEditInvoiceData: PropTypes.func,
    projectInfo: PropTypes.any,
    orderId: PropTypes.any,
  };
  //All state Varible

  const [totalAmount, setTotalAmount] = useState(0);
  const [gstValue, setGstValue] = useState();
  //const [checkbox, setCheckbox] = useState();
  const [paymentTerms, setPaymentTerms] = useState('');
  const gstPercentageValue = parseInt(gstValue?.value, 10) || 0; 
  const [createInvoice, setCreateInvoice] = useState({
    discount: '',
    quote_code: '',
    po_number: '',
    project_location: '',
    project_reference: '',
    invoice_date: '',
    code: '',
    so_ref_no: '',
    site_code: '',
    attention: '',
    reference: '',
    invoice_terms: '',
    status: 'due',
    paymentTerms: '',
    invoice_code: '',
    invoice_due_date: '',
  });
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      unit: '',
      qty: '',
      unit_price: '',
      total_cost: '',
      remarks: '',
      item_title: '',
      description: '',
    },
  ]);

  const getGstValue = () => {
    api.get('/finance/getGst').then((res) => {
      setGstValue(res.data.data);
      });
  };
  console.log('ordr',orderId)
  // const getCheckBox = async () => {
  //   try {
  //     const response = await api.post('/invoice/getCheckboxReceiptById', { order_id: orderId });
  //     setCheckbox(response.data.data);
  //   } catch (error) {
  //     console.error('Error fetching checkbox data:', error);
  //   }


  //setting data in createinvoice
  const handleInserts = (e) => {
    setCreateInvoice({ ...createInvoice, [e.target.name]: e.target.value });
  };
  const handleDataEditor = (e, type) => {
    setCreateInvoice({
      ...createInvoice,
      [type]: draftToHtml(convertToRaw(e.getCurrentContent())),
    });
  };
  const fetchTermsAndConditions = () => {
    api.get('/setting/getSettingsForPaymentTerms')
      .then((res) => {
        const settings = res.data.data;
        if (settings && settings.length > 0) {
          const fetchedTermsAndCondition = settings[0].value; // Assuming 'value' holds the terms and conditions
          // Update the payment terms in createInvoice
          setCreateInvoice({ ...createInvoice, payment_terms: fetchedTermsAndCondition });
          const contentBlock = htmlToDraft(fetchedTermsAndCondition);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setPaymentTerms(editorState);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching terms and conditions:', error);
      });
  };

  useEffect(() => {
    fetchTermsAndConditions();
    // Other useEffect logic
  }, []);
  //Insert Invoice Item
  const addLineItemApi = (obj) => {
    obj.order_id = projectInfo;
    api
      .post('/invoice/insertInvoiceItem', obj)
      .then(() => {
        message('Line Item Added Successfully', 'sucess');
      })
      .catch(() => {
        message('Cannot Add Line Items', 'error');
      });
  };
  //final api call
  const finalinsertapi = (receipt, results) => {
    for (let j = 0; j < results.length; j++) {
      addLineItemApi({
        description: results[j].description,
        invoice_id: receipt,
        total_cost: results[j].total_cost,
        item_title: results[j].item_title,
        item_code: projectInfo.item_code,
        cost_price: 2,
        qty: results[j].qty,
        unit: results[j].unit,
        remarks: results[j].remarks,
        unit_price: parseFloat(results[j].unit_price),
      });
    }
  };
  console.log('amount',totalAmount)
  //Insert Invoice
  const insertInvoice = async (results, code,) => {
     // Calculate total cost
  let totalCost = 0;
  results.forEach((result) => {
    totalCost += parseFloat(result.total_cost);
  });

  // Assign total cost to invoice amount
  createInvoice.invoice_amount = totalCost + (gstPercentageValue / 100) * totalCost;
    //createInvoice.invoice_amount = totalAmount + (gstPercentageValue / 100) * totalAmount;
    createInvoice.gst_value = (gstPercentageValue / 100) * totalCost;
    createInvoice.gst_percentage = gstPercentageValue;
    createInvoice.project_id = projectInfo;
    createInvoice.order_id = orderId;
    createInvoice.invoice_code = code;
    const now = new Date();
    if (now.getMonth() === 11) {
      const current = new Date(now.getFullYear() + 1, 0, now.getDate());
      createInvoice.invoice_due_date = current;
    } else {
      const current = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      createInvoice.invoice_due_date = current;
    }
    api
      .post('/finance/insertInvoice', createInvoice)
      .then((res) => {
        message('Invoice inserted successfully.', 'success');
        finalinsertapi(res.data.data.insertId, results);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      })
      .catch(() => {
        message('Network connection error.');
      });
  };
  //generateCode
  const generateCode = (results,type) => {
    api
      .post('/tender/getCodeValue', { type})
      .then((res) => {
        insertInvoice(results, res.data.data);
      })
      .catch(() => {
        insertInvoice(results, '');
      });
  };

  //Add new line item
  const AddNewLineItem = () => {
    setAddLineItem([
      ...addLineItem,
      {
        id: new Date().getTime().toString(),
        uom: '',
        qty: '',
        unitprice: '',
        total_cost: '',
        remarks: '',
        item: '',
        description: '',
      },
    ]);
  };

  //Invoice item values
  const getAllValues = () => {
    const result = [];
    //let hasZeroTotalCost = false; 
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
        });
        //allValues.total_cost = allValues.qty * allValues.unit_price;
        // if (allValues.total_cost === 0) {
        //   hasZeroTotalCost = true; // Set the flag if total_cost is 0
        // }
      result.push(allValues);
    });
    // if (hasZeroTotalCost) {
    //   message('Total cost cannot be 0.', 'error');
    //   return; // Prevent further processing if total_cost is 0
    // }
    setTotalAmount(0);
    console.log(result);
    result.forEach((element) => {
      addLineItemApi(element);
    });
    setAddLineItem([
      {
        id: random.int(1, 99),
        unit: '',
        qty: '',
        unit_price: '',
        total_cost: '',
        remarks: '',
        item_title: '',
        description: '',
      },
    ]);
    generateCode(result, 'invoicestype');
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

    setAddLineItem(updatedItems);
  };
  //Invoice Items Calculation
  console.log('TotalAmount', totalAmount)
  const calculateTotal = () => {
    let totalValue = 0;
    const result = [];
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
          allValues.total_cost = allValues.qty * allValues.unit_price;
        });
      result.push(allValues);
    });
    result.forEach((e) => {
      if (e.total_cost) {
        totalValue += parseFloat(e.total_cost);
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
    if (ind.total_cost) {
      const finalTotal = totalAmount - parseFloat(ind.total_cost);
      setTotalAmount(finalTotal);
    }
  };
    // };
    useEffect(() => {
      getGstValue();
      getUnit();
      //getCheckBox();
    }, [orderId]);
  //console.log('checkbox',checkbox)
  return (
    <>
     <Modal size="xl" isOpen={editInvoiceData}>
        <ModalHeader>
          Create Invoice
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setEditInvoiceData(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <Form>
                <Row>


                  {/* Invoice Detail */}
                  <Row>
                    <InvoiceTable createInvoice={createInvoice} handleInserts={handleInserts} />
                    {/* Description form */}
                    <Row>
                      <Label>Description</Label>
                    </Row>
                    {/* <ComponentCard title="Description"> */}
                    <Editor
                      editorState={paymentTerms}
                      wrapperClassName="demo-wrapper mb-0"
                      editorClassName="demo-editor border mb-4 edi-height"
                      onEditorStateChange={(e) => {
                        handleDataEditor(e, 'payment_terms');
                        setPaymentTerms(e);
                      }}
                    />
                    {/* </ComponentCard> */}
                  </Row>
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
                  
                  {/* {checkbox &&
                      checkbox.map((singleInvoiceObj) => {
                        console.log('singleInvoiceObj',singleInvoiceObj)
                        return (
                          <Row key={singleInvoiceObj.invoice_id}>
                            <Col md="12">
                              <FormGroup check>
                                <Input
                                  onChange={() => {
                                    
                                    // getInvoices(e, singleInvoiceObj);
                                  }}
                                  name="invoice_code(prev_amount)"
                                  type="checkbox"
                                />
                                <span>
                                 {singleInvoiceObj.receipt_code} -{singleInvoiceObj.amount}
                                </span>
                              </FormGroup>
                            </Col>
                          </Row>
                        );
                      })} */}
                    <br></br>
                  {/* Invoice Item */}
                  <Row>
                    <Col>
                      <table className="lineitem">
                        <thead>
                          <tr>
                            <th scope="col">Item</th>
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
                          {addLineItem.map((item) => {
                            return (
                              <tr key={item.id}>
                                <td data-label="Item">
                                  <Input defaultValue={item.item} type="text" name="item_title" />
                                </td>
                                <td data-label="Description">
                                  <Input
                                    defaultValue={item.description}
                                    type="text"
                                    name="description"
                                  />
                                </td>
                                 <td data-label="UoM">
                                  <Select
                                    name="unit"
                                    onChange={(selectedOption) => {
                                      onchangeItem(selectedOption);
                                    }}
                                    options={unitdetails}
                                  />
                                  </td>
                                {/* <td data-label="UoM">
                                  <Input defaultValue={item.unit} type="text" name="unit" />
                                </td> */}
                                <td data-label="Qty">
                                  <Input Value={item.qty !== '' ? item.qty : 0} type="number" name="qty" />
                                </td>
                                <td data-label="Unit Price">
                                  <Input
                                    Value={item.unit_price !== '' ? item.unit_price : 0}
                                    onBlur={() => {
                                      calculateTotal();
                                    }}
                                    type="number"
                                    name="unit_price"
                                  />
                                </td>
                                <td data-label="Total Price">
                                  <Input
                                    Value={item.total_cost}
                                    type="text"
                                    name="total_cost"
                                    
                                  />
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
                        setEditInvoiceData(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Row>
              </Form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FinanceInvoiceData;
