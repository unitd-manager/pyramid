import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import ComponentCard from '../ComponentCard';
import PdfEmployeeContract from '../PDF/PdfEmployeeContract';

export default function Jobinformationedit({ handleInputsJobInformation, job }) {
  Jobinformationedit.propTypes = {
    handleInputsJobInformation: PropTypes.any,
    job: PropTypes.any,
  };
  return (
    <ComponentCard title="Details of Employment (KET)">
      <PdfEmployeeContract job={job}></PdfEmployeeContract>
      <ToastContainer></ToastContainer>
      <FormGroup>
        <Row>
          <Col md="6">
            <Label>Employment Start/Commencement Date</Label>
            <Input
              type="date"
              onChange={handleInputsJobInformation}
              value={job && moment(job.act_join_date).format('YYYY-MM-DD')}
              name="act_join_date"
            />
          </Col>
          <Col md="6">
            <Label>Duties & Responsibility</Label>
            <Input
              type="text"
              onChange={handleInputsJobInformation}
              value={job && job.duty_responsibility}
              name="duty_responsibility"
            />
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Label>Duration of Employment(only for employees on fixed term contract)</Label>
            <Input
              type="text"
              onChange={handleInputsJobInformation}
              value={job && job.duration_of_employment}
              name="duration_of_employment"
            />
          </Col>
          <Col md="6">
            <Label>Place of Work(if different from companys registered address)</Label>
            <Input
              type="text"
              onChange={handleInputsJobInformation}
              value={job && job.place_of_work}
              name="place_of_work"
            />
          </Col>
        </Row>
      </FormGroup>
    </ComponentCard>
  );
}
