import React, {useState,useEffect} from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useParams } from 'react-router-dom';
import CommonTable from '../CommonTable';
import TimesheetModal from '../ProjectModal/TimesheetModal';
import ChooseEmployee from '../ProjectModal/ChooseEmployee';
import api from '../../constants/api';
import PdfEmpTimesheet from '../PDF/PdfEmpTimesheet';

const AddEmployee = () => {

  const { id } = useParams();

  const [timesheet, setTimesheet] = useState(false);
  const [chooseEmp, setChooseEmp] = useState(false);
  const [getemployeeLinked, setGetEmployeeLinked] = useState();
  const [getSingleEmployeeData, setSingleEmployeeData] = useState();
  const [totalEmpTimesheetRecord, setTotalEmpTimesheetRecord] = useState();

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
      ];

  //getting Employee data by Employee id
  const getLinkedEmployee = () => {
  // eslint-disable-next-line
     api.post('/timesheet/getTimesheetStaffById', { project_id: parseInt(id) })
      .then((res) => {
        console.log("res.data.data",res.data.data)
        setGetEmployeeLinked(res.data.data)
      })
  }

  const showEmpDataInTimsheet = () => {
    api.get('/timesheet/getAllEmpTimesheet').then((res) => {
      setTotalEmpTimesheetRecord(res.data.data);
    });
  };


  useEffect(() => {
    getLinkedEmployee();
    showEmpDataInTimsheet();
    }, [id])

    const uniqueEmployeeData = getemployeeLinked?.reduce((acc, curr) => {
      const existingEmployee = acc.find((employee) => employee.employee_id === curr.employee_id);
        if (!existingEmployee) {
        acc.push(curr);
      }
    
      return acc;
    }, []) || [];

  return (
    <>
    <Row>
      <Col md='10'>
        <CommonTable title="Add Employee"
          Button={
                <Button color="primary" className="shadow-none" onClick={() => { setChooseEmp(true)
             }}> Choose </Button>
             
            }>
          <thead>
            <tr>
              {Employeecolumns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {uniqueEmployeeData.map((e,i)=>{
             return (
             <tr>
              <td>{i+1}</td>
              <td>{e.first_name}</td>
              <td>
                  <Button color="primary" className="shadow-none" 
                  onClick={() => { 
                    setTimesheet(true)
                    setSingleEmployeeData(e)
                  }}> New Timesheet </Button>
              </td>
              <td> < PdfEmpTimesheet getSingleEmployeeData={e} totalEmpTimesheetRecord={totalEmpTimesheetRecord} /> </td>
           </tr>) 
            })}
          </tbody>
        </CommonTable>
      </Col>
    </Row>
     <ChooseEmployee chooseEmp={chooseEmp} setChooseEmp={setChooseEmp} />
    <TimesheetModal timesheet={timesheet} setTimesheet={setTimesheet} 
    getSingleEmployeeData={getSingleEmployeeData} 
    setSingleEmployeeData={setSingleEmployeeData} />
    </>
  );
};

export default AddEmployee;