import React from 'react';
import { Row, Col, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';

const TimesheetModal = ({ timesheet, setTimesheet }) => {
  TimesheetModal.propTypes = {
    timesheet: PropTypes.bool,
    setTimesheet: PropTypes.func,
  };
  return (
    <>
      <Modal size="xl" isOpen={timesheet}>
        <ModalHeader> Add Timesheet
          <Button
            color="secondary"
            onClick={() => {
              setTimesheet(false);
            }}
          > X
          </Button>
        </ModalHeader>

        <ModalBody>
        <Row>
          <Col md="12" className="mb-4">
            <Row>
            <Col md="2">S.No: 1</Col>
            <Col md="4">Employee Name: </Col>
              <Col md="2">
                <FormGroup>
                  <Label>Year: </Label>
                  <Input
                    type="select"
                    name="year"
                  >
                    <option value="2022">2022</option>
                    <option selected="selected" value="2023">2023</option>
                    <option value="2024">2024</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label>Month: </Label>
                  <Input
                    type="select"
                    name="month"
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option selected="selected" value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label>Timesheet Sign * </Label>
                  <Input
                    type="select"
                    name="month"
                  >
                    <option defaultValue="selected">Please Select</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
          <table className="lineitem">
            <thead>
              <tr>
                <th scope="col" colSpan="2">
                  Normal Rate / HR:
                </th>
                <th scope="col" colSpan="2">
                  OT Rate / HR:
                </th>
                <th scope="col" colSpan="2">
                  PH Rate / HR:
                </th>
                <th scope="col" colSpan="2">
                  Total Normal HRS:
                </th>
                <th scope="col" colSpan="2">
                  Total OT HRS:
                </th>
                <th scope="col" colSpan="2">
                  Total PH HRS:
                </th>
                <th scope="col">Normal Rate</th>
                <th scope="col">OT Rate Row 2</th>
                <th scope="col">PH Rate Row 3</th>
                <th scope="col">
                  <Button color="primary"> Save </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="col" className="saturday">
                  {' '}
                  SAT <br /> 1
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="sunday">
                  SUN <br /> 2
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  MON <br /> 3
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  TUE <br /> 4
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  WED <br /> 5
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  THU <br /> 6
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  FRI <br /> 7
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="saturday">
                  SAT <br /> 8
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="sunday">
                  SUN <br /> 9
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  MON <br /> 10
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  TUE <br /> 11
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  WED <br /> 12
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  THU <br /> 13
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  FRI <br /> 14
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="saturday">
                  SAT <br /> 15
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="sunday">
                  SUN <br /> 16
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
              </tr>
              <tr>
                <th scope="col">
                  MON <br /> 17
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  TUE <br /> 18
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  WED <br /> 19
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  THU <br /> 20
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  FRI <br /> 21
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="saturday">
                  SAT <br /> 22
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="sunday">
                  SUN <br /> 23
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  MON <br /> 24
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  TUE <br /> 25
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  WED <br /> 26
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  THU <br /> 27
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col">
                  FRI <br /> 28
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="saturday">
                  SAT <br /> 29
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
                <th scope="col" className="sunday">
                  SUN <br /> 30
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                  <Input type="text" name="item" />
                  <br />
                </th>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setTimesheet(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TimesheetModal;
