import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Table } from 'reactstrap';
import PdfDummy from '../PDF/PdfDummy';

export default function CustomerFinanceInvoice({
  createInvoice,
  cancelInvoice,
  invoiceCancel,
  setEditInvoiceModal,
  setEditModal,
}) {
  CustomerFinanceInvoice.propTypes = {
    createInvoice: PropTypes.array,
    cancelInvoice: PropTypes.array,
    invoiceCancel: PropTypes.func,
    setEditInvoiceModal: PropTypes.func,
    setEditModal: PropTypes.func,
  };

  //Structure of Invoice table
  const invoiceTableColumns = [
    { name: 'Invoice Code' },
    { name: 'Status' },
    { name: 'Invoice Date' },
    { name: 'Amount' },
    { name: 'Print' },
    { name: 'Edit' },
    { name: 'Cancel' },
  ];

  return (
    // Invoice Tab

    <Form>
      <div className="MainDiv">
        <div className="container">
          <Table id="example">
            <thead>
              <tr>
                {invoiceTableColumns.map((cell) => {
                  return <td key={cell.name}>{cell.name}</td>;
                })}
              </tr>
            </thead>
            <tbody>
              {createInvoice &&
                createInvoice.map((element) => {
                  return (
                    <tr key={element.invoice_id}>
                      <td>{element.invoice_code}</td>
                      <td>{element.status}</td>
                      <td>{moment(element.invoice_date).format('YYYY-MM-DD')}</td>
                      <td>{element.invoice_amount}</td>
                      <td>
                        <PdfDummy
                          createInvoice={createInvoice}
                          cancelInvoice={cancelInvoice}
                          invoiceId={element.invoice_id}
                        ></PdfDummy>
                      </td>
                      <td>
                        <div className="anchor">
                          <span
                            onClick={() => {
                              setEditInvoiceModal(element);
                              setEditModal(true);
                            }}
                          >
                            Edit
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="anchor">
                          <span
                            onClick={() => {
                              invoiceCancel(element);
                            }}
                          >
                            Cancel
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <Table id="example">
            <thead>
              <tr>
                {invoiceTableColumns.map((cell) => {
                  return <td key={cell.name}>{cell.name}</td>;
                })}
              </tr>
            </thead>
            <tbody>
              {cancelInvoice &&
                cancelInvoice.map((element) => {
                  return (
                    <tr key={element.invoice_id}>
                      <td>{element.invoice_code}</td>
                      <td>{element.status}</td>
                      <td>{moment(element.invoice_date).format('YYYY-MM-DD')}</td>
                      <td>{element.invoice_amount}</td>
                      <td>
                        <div className="anchor"><span>Print</span></div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </Form>
  );
}
