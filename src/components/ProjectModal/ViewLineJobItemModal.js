import React, { useState } from 'react';
import { FormGroup, Modal, ModalHeader, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import EditLineItemModal from './EditLineItemModal';




const ViewLineJobItemmodal = ({ viewJobLineToggle,deleteJobItemRecord, viewjobLineModal,jobLineItem, setEditJobLineModal,
  editJobLineModal, FetchLineItemData, JobOrderId}) => {
    ViewLineJobItemmodal.propTypes = {
    viewJobLineToggle: PropTypes.any,
    deleteJobItemRecord:PropTypes.any,
    viewjobLineModal: PropTypes.any,
    jobLineItem: PropTypes.any,
    setEditJobLineModal: PropTypes.any,
    JobOrderId: PropTypes.any,
    editJobLineModal: PropTypes.bool,
    FetchLineItemData: PropTypes.object,
  };

  console.log('ViewJobOrderId:', JobOrderId);
  const [editLineModelItem, setEditLineModelItem] = useState();


  return (
    <><Modal size="xl" isOpen={viewjobLineModal} toggle={viewJobLineToggle.bind(null)}>
    <ModalHeader toggle={viewJobLineToggle.bind(null)}>Line ems</ModalHeader>
    <ModalBody>
      <FormGroup>
        <table className="lineitem border border-secondary rounded">
          <thead>
            <tr>
              <th scope="col">Title </th>
              <th scope="col">Description </th>
              <th scope="col">Qty</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Amount</th>
              <th scope="col">Updated By</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobLineItem &&
              jobLineItem.map((e) => {
                const amount = e.quantity * e.unit_price;
                return (
                  <tr>
                    <td data-label="Title">{e.title}</td>
                    <td data-label="Description">{e.description}</td>
                    <td data-label="Qty">{e.quantity}</td>
                    <td data-label="Unit Price">{e.unit_price}</td>
                    <td data-label="Amount">{amount.toFixed(2)}</td>
                    <td data-label="Updated By">{e.created_by}</td>
                    <td data-label="Action">
                      <div className="anchor">
                        <span
                          onClick={() => {
                            setEditLineModelItem(e);
                            setEditJobLineModal(true);
                          }}
                        >
                          <Icon.Edit2 />
                        </span>
                      </div>
                      <div className="anchor">
                        <span
                          onClick={() => {
                            deleteJobItemRecord(e.quote_items_id);
                          }}
                        >
                          <Icon.Trash2 />
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </FormGroup>
      <EditLineItemModal
        editJobLineModal={editJobLineModal}
        setEditJobLineModal={setEditJobLineModal}
        FetchLineItemData={FetchLineItemData}
        editLineModelItem={editLineModelItem}
      >
      </EditLineItemModal>
    </ModalBody>
  </Modal>
        
    </>
  );
};

export default ViewLineJobItemmodal;
