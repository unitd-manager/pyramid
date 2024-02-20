import React, { useState } from 'react';
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
  Form,
} from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';

const EditQuoteModal = ({
  editjob,
  setEditJob,
  getJob,
  job
}) => {
  EditQuoteModal.propTypes = {
    editjob: PropTypes.bool,
    setEditJob: PropTypes.func,
    getJob: PropTypes.func,
    job: PropTypes.any
  };

  const [jobeditdata, setJobEditData] = useState(job);
  

  const handleInputs = (e) => {
    setJobEditData({ ...jobeditdata, [e.target.name]: e.target.value });
  };

  const EditJob = () => {
    api
      .post('/project/editJoborder', jobeditdata)
      .then(() => {
        message('Job order Edited Successfully.', 'success');
        getJob();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(() => {
        message('Unable to edit job. please fill all fields', 'error');
      });
  };

  return (
    <>
      {/*  Edit Quote Modal */}
      <Modal size="lg" isOpen={editjob}>
        <ModalHeader>
          Edit Job
          <Button
            color="secondary"
            onClick={() => {
              setEditJob(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
      <Form>
        <FormGroup>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    name="project_location"
                    defaultValue={jobeditdata && jobeditdata.project_location}
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
                    defaultValue={jobeditdata && jobeditdata.scope_of_work}
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
                    defaultValue={jobeditdata && jobeditdata.po_number}
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
                    defaultValue={jobeditdata && jobeditdata.quote_no}
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
                    defaultValue={jobeditdata && jobeditdata.job_completion_date}
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
                    defaultValue={jobeditdata && jobeditdata.name}
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
                    defaultValue={jobeditdata && jobeditdata.designation}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    name="date"
                    defaultValue={jobeditdata && jobeditdata.date}
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
                    defaultValue={jobeditdata && jobeditdata.witness_by_name}
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
                    defaultValue={jobeditdata && jobeditdata.witness_by_designation}
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
                    defaultValue={jobeditdata && jobeditdata.witness_by_date}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              </Row>
        </FormGroup>
      </Form>
      <Row>
      </Row>
        <ModalFooter>
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        EditJob();
                        setEditJob(false);
                      }}
                    >
                      {' '}
                      Save & Continue{' '}
                    </Button>
                    <Button
                      className="shadow-none"
                      color="secondary"
                      onClick={() => {
                        setEditJob(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
        </ModalBody>
      </Modal>
      {/* END Edit Quote Modal */}
    </>
  );
};

export default EditQuoteModal;
