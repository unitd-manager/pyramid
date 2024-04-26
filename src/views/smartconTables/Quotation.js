import React, { useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import moment from 'moment';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import PdfQuotation from '../../components/PDF/PdfQuotation';

const Quotation = () => {
  const [tenders, setTenders] = useState(null);
  const [loading, setLoading] = useState(false);
  //const [Quotations, setQuotation] = useState(false);
//const {id}=useParams();
  const getTenders = () => {
    api
      .get('/projecttabquote/getTabQuote')
      .then((res) => {
        setTenders(res.data.data);
        $('#example').DataTable({
          pagingType: 'full_numbers',
          pageLength: 20,
          processing: true,
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'print',
              text: 'Print',
              className: 'shadow-none btn btn-primary',
            },
          ],
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

//   const getQuotations = () => {
//     api.post('/projecttabquote/getTabQuoteById', { project_id: id }).then((res) => {
//       setQuotation(res.data.data);
//     });
//   };
 // console.log("quotation",Quotations);
  useEffect(() => {
    getTenders();
    //getQuotations();
  }, []);

  

  const columns = [
    {
      name: '#',
      selector: 'opportunity_id',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
        name: 'Project Name',
        selector: 'opportunity_code',
        sortable: true,
        grow: 0,
        wrap: true,
      },
      {
        name: 'Quote Date',
        selector: 'opportunity_code',
        sortable: true,
        grow: 0,
        wrap: true,
      },
    {
      name: 'Quote No',
      selector: 'opportunity_code',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Quote Status',
      selector: 'title',
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Quote Ref No',
      selector: 'office_ref_no',
      sortable: true,
      grow: 0,
    },
    {
      name: 'Discount',
      selector: 'discount',
      sortable: true,
      width: 'auto',
      grow: 3,
    },
    {
      name: 'Amount',
      selector: 'actual_closing',
      sortable: true,
      grow: 2,
      width: 'auto',
    },
    {
      name: 'Pdf',
      selector: 'status',
      sortable: true,
      grow: 2,
      wrap: true,
    },

  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />
        <CommonTable
          loading={loading}
          title="Quotation List"
        
        >
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {tenders &&
              tenders.map((element, index) => {
                return (
                  <tr key={element.opportunity_id}>
                    <td>{index + 1}</td>
                    <td>{element.title}</td>
              
                    <td>{element.quote_date ? moment(element.quote_date).format('DD-MM-YYYY') : ''}</td>
                    <td>{element.quote_code}</td>
                    <td>{element.quote_status}</td>
                    <td>{element.ref_no_quote}</td>
                    <td>{element.discount}</td>
                    <td>{element.totalamount}</td>
                    <Col md="3">
                          <span>
                            <PdfQuotation id={element.quote_id} quoteId={element.quote_id}></PdfQuotation>
                          </span>
                        </Col>
                    {/* <td>{element.quote_ref}</td> */}
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Quotation;
