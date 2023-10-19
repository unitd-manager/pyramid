import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, Col,CardHeader, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ExportReport from '../../components/Report/ExportReport';

const InvoiceBYYear = () => {
  //All state variable
 // const [invoiceReport, setInvoiceReport] = useState(null);
  const [userSearchData, setUserSearchData] = useState('');
  const [companyName, setCompanyName] = useState('project');
  const exportValue="InvoiceByYearReport"

  const thisYear=new Date().getFullYear();

  console.log('thisyear',thisYear)
  //Get data from Training table
 
  const handleSearch = () => {
    const queryParams = companyName ? `?recordType=${companyName}` : '';

    api
    .get(`/reports/getInvoiceByYearReport${queryParams}`)
    .then((res) => {
      const data=[]
     let obj = {invoice_year:'' ,invoice_amount_yearly:''}
        let total=0
      res.data.data.filter((x) => parseFloat(x.invoice_year) === thisYear).forEach((el)=>{
        total +=el.invoice_amount_yearly
      })
      obj={invoice_year:thisYear ,invoice_amount_yearly:total}
      data.push(obj);
      //setInvoiceReport(res.data.data);
      setUserSearchData(data);
    })
    .catch(() => {
      message('Project Data Not Found', 'info');
    });
  };
  
  useEffect(() => {
       handleSearch();
  }, []);
  const [page, setPage] = useState(0);

  const employeesPerPage = 20;
  const numberOfEmployeesVistited = page * employeesPerPage;
  const displayEmployees = userSearchData.slice(
    numberOfEmployeesVistited,
    numberOfEmployeesVistited + employeesPerPage,
  );
  console.log("displayEmployees",displayEmployees)
  const totalPages = Math.ceil(userSearchData.length / employeesPerPage);
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  //structure of Training list view
  const columns = [
    {
      name: 'SN',
      selector:'s_no'
    },
    {
      name: 'Year',
      selector:'invoice_year'
    },
    {
      name: 'Amount',
      selector:'invoice_amount_yearly'
    },
    // {
    //   name: 'Category',
    //   selector: 'record_type',
    // },   
     ];
  return (
    <>
        <BreadCrumbs />
        <ToastContainer></ToastContainer>
        <Card>
          <CardBody>
            <Row>
              <Col>
                {/* <ExportReport columns={columns} data={userSearchData}/> */}
              </Col>
              <Col> 
              <FormGroup>
                <Label>Select Category</Label>
                <Input
                  type="select"
                  name="record_type"
                  onChange={(e) => setCompanyName(e.target.value)}
                > 
                <option defaultValue="selected" value="project">
                Project
                  </option>
                  <option value="tenancy project">Tenancy Project</option>
                  <option value="tenancy work">Tenancy Work</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="crm">Crm</option>

                </Input>
              </FormGroup>
            </Col>
             <Col md="1" className='mt-3'>
              <Button color="primary" className="shadow-none" onClick={() => handleSearch()}>Go</Button>
            </Col>
            </Row>
          </CardBody>
        </Card>

        <Card>
        <CardHeader className="card p-2 text-center">
        <b>Summary</b>
      </CardHeader>
        <CardBody>
          <Row>
            <Col md="3">
              <Label>
                <b>Category:</b> {companyName}
              </Label>
            </Col>
           </Row>
        </CardBody>
      </Card>


     <Card>
        <CardBody>
          <Row>
            <Col>
              <ExportReport columns={columns} data={userSearchData} exportValue={exportValue} />
            </Col>
          </Row>
        </CardBody>
      
        <CardBody>
          <Table>
  
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
          {displayEmployees &&
              displayEmployees.map((element,index) => {
                return (
                  <tr key={element.invoice_id}>
                    <td>{index+1}</td>
                    <td>{element.invoice_year}</td>
                    <td>{element.invoice_amount_yearly}</td>
                    {/* <td>{element.record_type}</td> */}
                  </tr>
                );
              })} 
          </tbody>
        </Table>
        <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={totalPages}
            onPageChange={changePage}
            containerClassName="navigationButtons"
            previousLinkClassName="previousButton"
            nextLinkClassName="nextButton"
            disabledClassName="navigationDisabled"
            activeClassName="navigationActive"
          />
                </CardBody>
      </Card>
    </>
  );
};
export default InvoiceBYYear;
