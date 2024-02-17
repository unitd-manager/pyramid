import React, {useState} from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';
import AddLineItemModal from './AddLineItemModal';
import PdfJobCompletionCertificate from '../PDF/PdfJobCompletionCertificate';


const JobCompletionTab = ({ joborder, setJobOrder, projectId }) => {
  JobCompletionTab.propTypes = {
    joborder: PropTypes.any,
    setJobOrder: PropTypes.any,
    projectId: PropTypes.any
  };

  // Edit Project
  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [editLineModal, setEditLineModal] = useState(false);
  const handleInputs = (e) => {
    setJobOrder({ ...joborder, [e.target.name]: e.target.value });
  };

  

  return (
    <>
      <Form>
        <FormGroup>
          <ComponentCard>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    name="project_location"
                    defaultValue={joborder && joborder.project_location}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>Scope of Work</Label>
                  <Input
                    type="text"
                    name="scope_of_work"
                    defaultValue={joborder && joborder.scope_of_work}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>Po Number</Label>
                  <Input
                    type="text"
                    name="po_number"
                    defaultValue={joborder && joborder.po_number}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Quote Number</Label>
                  <Input
                    type="text"
                    name="quote_no"
                    defaultValue={joborder && joborder.quote_no}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Job Completion Date</Label>
                  <Input
                    type="date"
                    name="job_completion_date"
                    defaultValue={joborder && joborder.job_completion_date}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    defaultValue={joborder && joborder.name}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Designation</Label>
                  <Input
                    type="text"
                    name="designation"
                    defaultValue={joborder && joborder.designation}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    name="signature"
                    defaultValue={joborder && joborder.date}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              </Row>
              <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Witness By Name</Label>
                  <Input
                    type="text"
                    name="witness_by_name"
                    defaultValue={joborder && joborder.witness_by_name}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Witness By Designation</Label>
                  <Input
                    type="text"
                    name="witness_by_designation"
                    defaultValue={joborder && joborder.witness_by_designation}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Witness By Date</Label>
                  <Input
                    type="date"
                    name="witness_by_date"
                    defaultValue={joborder && joborder.witness_by_date}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              </Row>

          </ComponentCard>
        </FormGroup>
      </Form>
      <Row>
      <Col md="4">
        <Button color="primary" 
        onClick={() => setAddLineItemModal(true)}>
            Add Line Item</Button>
      </Col>
      <Col md="4">
        <Button color="primary" 
        onClick={() => setAddLineItemModal(true)}>
            View Line Item</Button>
      </Col>
      <Col md="4">
                    <Label className='pointer'>
                      <PdfJobCompletionCertificate  id={projectId} 
                      quoteId={projectId} ></PdfJobCompletionCertificate>
                      {/* <PdfQuote id={id} quoteId={quote.quote_id}></PdfQuote> */}
                    </Label>
                  </Col>
      </Row>
      <AddLineItemModal
          addLineItemModal={addLineItemModal}
          setAddLineItemModal={setAddLineItemModal}
          editLineModal={editLineModal}
          setEditLineModal={setEditLineModal}
        ></AddLineItemModal>
        
    </>
  );
};

export default JobCompletionTab;
