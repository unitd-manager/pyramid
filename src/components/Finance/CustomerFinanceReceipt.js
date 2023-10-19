import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Table } from 'reactstrap';

export default function CustomerFinanceReceipt({
  receipt,
  setEditReceiptModal,
  setReceiptDataModal,
  receiptCancel,
}) {
  CustomerFinanceReceipt.propTypes = {
    receipt: PropTypes.array,
    setEditReceiptModal: PropTypes.func,
    setReceiptDataModal: PropTypes.func,
    receiptCancel: PropTypes.func,
  };

  //Structure of Receipt table
  const receiptTableColumns = [
    { name: 'Receipt Code' },
    { name: 'Status' },
    { name: 'Receipt Date' },
    { name: 'Mode Of Payment' },
    { name: 'Receipt Amount' },
    { name: 'View' },
    { name: 'Cancel' },
  ];

  return (
    //Receipt tab

    <Form>
      <div className="MainDiv">
        <div className="container">
          <Table id="example">
            <thead>
              <tr>
                {receiptTableColumns.map((cell) => {
                  return <td key={cell.name}>{cell.name}</td>;
                })}
              </tr>
            </thead>
            <tbody>
              {receipt &&
                receipt.map((element) => {
                  return (
                    <tr key={element.receipt_id}>
                      <td>{element.receipt_code}</td>
                      <td>{element.receipt_status}</td>
                      <td>{moment(element.receipt_date).format('YYYY-MM-DD')}</td>
                      <td>{element.mode_of_payment}</td>
                      <td>{element.amount}</td>
                      <td>
                        <div className="anchor">
                          <span
                            onClick={() => {
                              setEditReceiptModal(element);
                              setReceiptDataModal(true);
                            }}
                          >
                            View
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="anchor">
                          <span
                            onClick={() => {
                              receiptCancel(element);
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
        </div>
      </div>
    </Form>
  );
}
