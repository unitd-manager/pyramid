import React, {useState} from 'react';
import { Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import CommonTable from '../CommonTable';
import TimesheetModal from '../ProjectModal/TimesheetModal';

const AddEmployee = () => {

  const [timesheet, setTimesheet] = useState(false);

    const Employeecolumns = [
        {
          name: '#',
          grow: 0,
          wrap: true,
          width: '4%',
        },
        {
          name: 'Name',
          selector: 'name',
        },
        {
          name: 'Status',
          selector: 'status',
        },
        {
          name: 'Order',
          selector: 'sort_order',
          sortable: true,
          grow: 0,
        },
      ];


  return (
    <>
    <Row>
      <Col md='10'>
        <CommonTable title="Add Employee"  
          Button={
              <Link to="/">
                <Button color="primary" className="shadow-none"> Choose </Button>
              </Link>
            }>
          <thead>
            <tr>
              {Employeecolumns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
          
          </tbody>
        </CommonTable>
      </Col>
      <Col md='2'>
          <Link to="">
            <Button color="primary" className="shadow-none" 
            onClick={() => { setTimesheet(true)
             }}> New Timesheet </Button>
          </Link>
      </Col>
    </Row>
     
    <TimesheetModal timesheet={timesheet} setTimesheet={setTimesheet} />

    </>
  );
};

export default AddEmployee;
