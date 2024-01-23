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
  Label,
  Form,
} from 'reactstrap';
import { Editor } from 'react-draft-wysiwyg';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import moment from 'moment';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import api from '../../constants/api';
import message from '../Message';

const EditQuoteModal = ({ editQuoteModal, setEditQuoteModal, quoteDatas, lineItem, getQuoteFun }) => {
  EditQuoteModal.propTypes = {
    editQuoteModal: PropTypes.bool,
    setEditQuoteModal: PropTypes.func,
    quoteDatas: PropTypes.object,
    lineItem: PropTypes.object,
    getQuoteFun: PropTypes.any,
  };

  const { id } = useParams();
  console.log('win', lineItem);
  //   Get Quote Edited Value

  const [quoteData, setQuoteData] = useState(quoteDatas);
  const [conditions, setConditions] = useState('');
  const [lineItems, setLineItem] = useState('');

  const handleData = (e) => {
    setQuoteData({ ...quoteData, [e.target.name]: e.target.value });
  };

  const getQuote = () => {
    api.post('/tender/getQuoteById', { opportunity_id: id }).then((res) => {
      setQuoteData(res.data.data[0]);
    });
  };
  const fetchTermsAndConditions = () => {
    api.get('/setting/getSettingsForTerms')
      .then((res) => {
        const settings = res.data.data;
        if (settings && settings.length > 0) {
          const fetchedTermsAndCondition = settings[0].value; // Assuming 'value' holds the terms and conditions
          console.log("1", res.data.data);
          // Update the quote condition in quoteData
          setQuoteData({ ...quoteData, quote_condition: fetchedTermsAndCondition });
          // Convert fetched terms and conditions to EditorState
          const contentBlock = htmlToDraft(fetchedTermsAndCondition);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setConditions(editorState);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching terms and conditions:', error);
      });
  };
  // Call fetchTermsAndConditions within useEffect or when required
  useEffect(() => {
    fetchTermsAndConditions();
    // Other useEffect logic
  }, []);
  
  const insertquote = () => {
    api.post('/tender/insertLog', quoteData).then((res) => {
      message('quote inserted successfully.', 'success');
      lineItem.forEach((element) => {
        element.quote_log_id = res.data.data.insertId;
        api.post('/tender/insertLogLine', element).then(() => {
          getQuoteFun();
            setTimeout(() => {
          window.location.reload();
        }, 1000);
        });
      });
    });
  };
  const GetEditQuote = () => {
    api
      .post('/tender/edit-TabQuote', quoteData)
      .then(() => {
        message('Quote Edited Successfully.', 'success');
        getQuoteFun();
          setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(() => {
        message('Unable to edit quote. please fill all fields', 'error');
      });
  };

  const handleDataEditor = (e, type) => {
    setQuoteData({ ...quoteData, [type]: draftToHtml(convertToRaw(e.getCurrentContent())) });
  };

  const convertHtmlToDraftcondition = (existingQuoteformal) => {
    if (existingQuoteformal && existingQuoteformal.quote_condition) {
      const contentBlock = htmlToDraft(existingQuoteformal && existingQuoteformal.quote_condition);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setConditions(editorState);
      }
    }
  };

  const convertHtmlToDraft = (existingQuoteformal) => {
    if (existingQuoteformal && existingQuoteformal.intro_drawing_quote) {
      const contentBlock = htmlToDraft(
        existingQuoteformal && existingQuoteformal.intro_drawing_quote,
      );
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setLineItem(editorState);
      }
    }
  };
  useEffect(() => {
    setQuoteData(quoteDatas);
    getQuote();
    convertHtmlToDraftcondition(quoteDatas);
    convertHtmlToDraft(quoteDatas);
  }, [quoteDatas]);

  return (
    <>
      {/*  Edit Quote Modal */}
      <Modal size="lg" isOpen={editQuoteModal}>
        <ModalHeader>
          Edit Quote
          <Button
            color="secondary"
            onClick={() => {
              setEditQuoteModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Quote Date</Label>
                    <Input
                      type="date"
                      name="quote_date"
                      value={quoteData ? moment(quoteData.quote_date).format('YYYY-MM-DD') : ''}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label> Quote Status</Label>
                    <Input
                      value={quoteData && quoteData.quote_status}
                      type="select"
                      onChange={handleData}
                      name="quote_status"
                    >
                      <option selected="selected" value="New">
                        New
                      </option>
                      <option value="Quoted">Quoted</option>
                      <option value="Awarded">Awarded</option>
                      <option value="Not Awarded">Not Awarded</option>
                      <option value="Cancelled">Cancelled</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Discount</Label>
                    <Input
                      type="text"
                      name="discount"
                      defaultValue={quoteData && quoteData.discount || 0}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Validity</Label>
                    <Input
                      type="text"
                      name="validity"
                      defaultValue={quoteData && quoteData.validity}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Project Reference</Label>
                    <Input
                      type="text"
                      name="project_reference"
                      defaultValue={quoteData && quoteData.project_reference}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Mode of Payment</Label>
                    <Input
                      type="select"
                      name="payment_method"
                      defaultValue={quoteData && quoteData.payment_method}
                      onChange={handleData}
                    >
                      <option value="">Please Select</option>
                      <option value="15 days">15 days</option>
                      <option selected="selected" value="30 days">
                        30 days
                      </option>
                      <option value="60 days">60 days</option>
                      <option value="COD">COD</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Our Reference</Label>
                    <Input
                      type="text"
                      name="our_reference"
                      defaultValue={quoteData && quoteData.our_reference}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Ref No</Label>
                    <Input
                      type="text"
                      name="ref_no_quote"
                      defaultValue={quoteData && quoteData.ref_no_quote}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>Quote Revision</Label>
                    <Input
                      type="text"
                      name="revision"
                      defaultValue={quoteData && quoteData.revision}
                      onChange={handleData}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Label>Intro Line Items</Label>
              </Row>
              <Editor
                editorState={lineItems}
                wrapperClassName="demo-wrapper mb-0"
                editorClassName="demo-editor border mb-4 edi-height"
                onEditorStateChange={(e) => {
                  handleDataEditor(e, 'intro_drawing_quote');
                  setLineItem(e);
                }}
              />
              <Row>
                <Label>Terms & Condition</Label>
              </Row>
              <Editor
                editorState={conditions}
                wrapperClassName="demo-wrapper mb-0"
                editorClassName="demo-editor border mb-4 edi-height"
                onEditorStateChange={(e) => {
                  handleDataEditor(e, 'quote_condition');
                  setConditions(e);
                }}
              />

              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    type="button"
                    color="primary"
                    className="btn shadow-none mr-2"
                    onClick={() => {
                      insertquote();
                      GetEditQuote();
                      // setQuoteData();
                      setEditQuoteModal(false);
                      //insertquoteLogLine();
                    }}
                  >
                    Save & Continue
                  </Button>
                  <Button
                    color="secondary"
                    className="shadow-none"
                    onClick={() => {
                      setEditQuoteModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Row>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      {/* END Edit Quote Modal */}
    </>
  );
};

export default EditQuoteModal;
