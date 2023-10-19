import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, FormGroup, Label, Button, CardTitle } from 'reactstrap';
import moment from 'moment';
import * as Icon from 'react-feather';
import api from '../../constants/api';
import ViewLineItemModal from './ViewLineItemModal';
import EditQuotation from './EditQuotation';
import PdfProjectQuote from '../PDF/PdfProjectQuote';
import QuotationViewLineItem from './QuotationViewLineItems';

export default function QuotationMoreDetails({
  projectId,
  setViewQuotationsModal,
  insertQuote,
  handleQuoteForms,
  generateCodeQuote,
}) {
  QuotationMoreDetails.propTypes = {
    projectId: PropTypes.string,
    setViewQuotationsModal: PropTypes.any,
    insertQuote: PropTypes.any,
    handleQuoteForms: PropTypes.any,
    generateCodeQuote: PropTypes.any,
  };

  const [quotation, setQuotation] = useState();
  const [quoteData, setQuoteData] = useState();
  const [quotelineItem, setQuoteLineItem] = useState();
  const [editQuoteModal, setEditQuoteModal] = useState();
  const [quotationViewLineItem, setQuotationViewLineItem] = useState();
  const [quote, setQuote] = useState();

  const getQuotations = () => {
    api
      .post('/projecttabquote/getTabQuoteById', { project_id: projectId })
      .then((res) => {
        setQuotation(res.data.data);
      })
  };
  useEffect(() => {
    getQuotations();
  }, [projectId]);

  return (
    <>
      <Row>
        <Col md="2">
          <Button
            color="primary"
            className="shadow-none mb-2"
            onClick={() => {
              setViewQuotationsModal(true);
            }}
          >
            View Quote Log
          </Button>
        </Col>
        <Col md="2">
          <Button
            color="primary"
            className="shadow-none mb-2"
            onClick={() => {
              insertQuote();
              handleQuoteForms();
              generateCodeQuote('quote');
            }}
          >
            Add Quote
          </Button>
        </Col>
      </Row>
      <CardTitle tag="h4" className="border-bottom bg-secondary p-2 mb-0 text-white">
        {' '}
        Quotations{' '}
      </CardTitle>

      <Form className="mt-4">
        <Row className="border-bottom mb-3">
          <Col>
            <FormGroup>
              <Label>Revision</Label>{' '}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Quote Date</Label>{' '}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Quote Code</Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Quote Status</Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Discount </Label>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Amount </Label>
            </FormGroup>
          </Col>
          <Col></Col>

          <Col>
            <FormGroup>
              <Label>Action</Label>
            </FormGroup>
          </Col>
        </Row>

        {quotation &&
          quotation.map((element) => {
            return (
              <Row>
                <Col>
                  <FormGroup>
                    <Label>{element.revision}</Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>
                      {element.quote_date ? moment(element.quote_date).format('YYYY-MM-DD') : ''}
                    </Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <span>{element.quote_code}</span>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>{element.quote_status}</Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>{element.discount}</Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>{element.total_amount}</Label>
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Label>
                      <div className='anchor'>
                        <span
                          onClick={() => {
                            setQuote(element.quote_id);
                            setQuotationViewLineItem(true);
                          }}
                        >
                          <u> View Line Items</u>
                        </span>
                      </div>
                    </Label>
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Row>
                      <Col md="2">
                        <Label>
                          <div color="primary" className='anchor'>
                            <span
                              onClick={() => {
                                setQuoteData(element);
                                setEditQuoteModal(true);
                              }}
                            >
                              <Icon.Edit />
                            </span>
                          </div>
                        </Label>
                      </Col>
                      <Col md="4">
                        <Label>
                          <PdfProjectQuote quotation={element.quote_id}></PdfProjectQuote>
                        </Label>
                      </Col>
                      <Col md="2">
                        <Label>
                          <div color="primary" className='anchor'>
                            {' '}
                            <span
                              onClick={() => {
                                setQuote(element.quote_items_id);
                                setQuoteLineItem(true);
                              }}
                            >
                              <Icon.PlusCircle />
                            </span>{' '}
                          </div>
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                  {quotelineItem && (
                    <ViewLineItemModal
                      quotelineItem={quotelineItem}
                      setQuoteLineItem={setQuoteLineItem}
                      projectId={projectId}
                      quote={quote}
                    />
                  )}
                  <EditQuotation
                    editQuoteModal={editQuoteModal}
                    setEditQuoteModal={setEditQuoteModal}
                    quoteData={quoteData}
                  />
                  {quotationViewLineItem && (
                    <QuotationViewLineItem
                      quotationViewLineItem={quotationViewLineItem}
                      setQuotationViewLineItem={setQuotationViewLineItem}
                      projectId={projectId}
                      quote={quote}
                    />
                  )}
                </Col>
              </Row>
            );
          })}
      </Form>
    </>
  );
}
