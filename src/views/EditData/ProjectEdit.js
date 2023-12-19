import React, { useState, useEffect } from 'react';
import { CardTitle, Row, Col, TabContent, TabPane, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import DuctingCostModal from '../../components/ProjectModal/DuctingCostModal';
//import ViewQuoteLogModal from '../../components/ProjectModal/ViewQuoteLogModal';
import ViewLineItemModal from '../../components/ProjectModal/ViewLineItemModal';
import EditQuotation from '../../components/ProjectModal/EditQuotation';
import QuotationMoreDetails from '../../components/ProjectModal/QuotationMoreDetails';
import CreateFinance from '../../components/ProjectModal/CreateFinance';
import AddPurchaseOrderModal from '../../components/ProjectModal/AddPurchaseOrderModal';
import MaterialsusedTab from '../../components/ProjectModal/MaterialsusedTab';
import EditDeliveryOrder from '../../components/ProjectModal/EditDeliveryOrder';
import EditPoModal from '../../components/ProjectModal/EditPoModal';
import EditPOLineItemsModal from '../../components/ProjectModal/EditPOLineItemsModal';
import SubConWorkOrderPortal from '../../components/ProjectModal/SubConWorkOrderPortal';
import MaterialsTransferred from '../../components/ProjectModal/MaterialsTransferred';
import FinanceTab from '../../components/ProjectModal/FinanceTab';
import message from '../../components/Message';
import api from '../../constants/api';
import ProjectButton from '../../components/ProjectTable/ProjectButton';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import CostingSummary from '../../components/ProjectTabContent/CostingSummary';
import TransferModal from '../../components/ProjectModal/TransferModal';
import AddEmployee from '../../components/ProjectTabContent/AddEmployee';
import Tab from '../../components/project/Tab';
import MaterialPurchased from '../../components/project/TabContent/MaterialPurchased';
import DeliveryOrder from '../../components/project/TabContent/DeliveryOrder';
import Claim from '../../components/project/TabContent/Claim';
import ProjectEditForm from '../../components/project/ProjectEditForm';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const applyChanges = () => {};
  const backToList = () => {
    navigate('/Project');
  }; 
  const [projectDetail, setProjectDetail] = useState();
  const [activeTab, setActiveTab] = useState('1');
  const [addDuctingCostModal, setAddDuctingCostModal] = useState(false);
  //const [viewQuotationsModal, setViewQuotationsModal] = useState(false);
  const [viewLineModal, setViewLineModal] = useState(false);
  const [editQuoteModal, setEditQuoteModal] = useState(false);
  const [addPurchaseOrderModal, setAddPurchaseOrderModal] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [tabdeliveryorder, setTabdeliveryorder] = useState();
  const [tabPurchaseOrderLineItemTable, setTabPurchaseOrderLineItemTable] = useState();
  const [checkId, setCheckId] = useState([]);
  const [editDeliveryOrder, setEditDeliveryOrder] = useState(false);
  const [editPo, setEditPo] = useState(false);
  const [editPOLineItemsModal, setEditPOLineItemsModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState('');
  const [POId, setPOId] = useState('');
  const [testJsonData, setTestJsonData] = useState(null);
  const [quotationsModal, setquotationsModal] = useState(false);
  const [lineItem, setLineItem] = useState([]);

  const [workOrderForm, setWorkOrderForm] = useState({
    work_order_date: '',
    status: '',
  });

  const [quoteForm, setQuoteForm] = useState({
    quote_date: '',
    quote_code: '',
  });
  useEffect(() => {
    api
      .post('/purchaseorder/testAPIendpoint', { project_id: id })
      .then((res) => {
        setTestJsonData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleClientForms = (e) => {
    setWorkOrderForm({ ...workOrderForm, [e.target.name]: e.target.value });
  };
  const handleQuoteForms = (e) => {
    setQuoteForm({ ...quoteForm, [e.target.name]: e.target.value });
  };
  const [selectedPoProducts, setSelectedPoProducts] = useState([]);
  const [transferModal, setTransferModal] = useState(false);
  const [transferItem, setTransferItem] = useState({});
  const [financeModal, setFinanceModal] = useState(false);
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [contactLinked, setContactLinked] = useState('');
  const [subConWorkOrdeData, setSubConWorkOrdeData] = useState([]);


  // Start for tab refresh navigation #Renuka 31-05-23
  const tabs =  [
    {id:'1',name:'Costing Summary'},
    {id:'2',name:'Quotations'},
    {id:'3',name:'Materials Purchased'},
    {id:'4',name:'Materials used'},
    {id:'5',name:'Materials Transferred'},
    {id:'6',name:'Delivery Order'},
    {id:'7',name:'Subcon Work Order'},
    {id:'8',name:'Claim'},
    {id:'9',name:'Finance'},
    {id:'10',name:'Attachment'}
  ];
  const toggle = (tab) => {
    setActiveTab(tab);
  }; 
  // End for tab refresh navigation #Renuka 31-05-23

  // Get Project By Id
  const getProjectById = () => {
    api
      .post('/project/getProjectById', { project_id: id })
      .then((res) => {
        setProjectDetail(res.data.data[0]);
      })
      .catch(() => {
        message(' project not found', 'info');
      });
  };

  const getContactById = () => {
    api
      .get('/project/getcontactById', contactLinked)
      .then((res) => {
        setContactLinked(res.data.data);
      })
      .catch(() => {
        message('Project contact not found', 'info');
      });
  };

  const UpdateData = () => {
    api.post('/project/edit-Project', projectDetail).then(() => {
      message('Record editted successfully', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
  };

  // Tab PurchaseOrder LineItem Table
  const TabPurchaseOrderLineItemTable = () => {
    api.post('/purchaseorder/TabPurchaseOrderLineItemTable', { project_id: id }).then((res) => {
      let arrayOfObj = Object.entries(res.data.data).map((e) => ({ id: e[0], data: e[1] }));
      arrayOfObj = arrayOfObj.reverse();
      setTabPurchaseOrderLineItemTable(arrayOfObj);
    });
  };

  // Tab Delivery Order
  const TabDeliveryOrder = () => {
    api
      .post('/projecttabdeliveryorder/TabDeliveryOrder', { project_id: id })
      .then((res) => {
        setTabdeliveryorder(res.data.data);
      })
      .catch(() => {
        message('Tab Delivery Order not found', 'info');
      });
  };

  // handleCheck
  const handleCheck = (e, item) => {
    let updatedList = [...checkId];
    if (e.target.checked) {
      updatedList = [...checkId, { item }];
    } else {
      const indexOfObject = updatedList.findIndex((object) => {
        return object.id === item.po_product_id;
      });

      updatedList.splice(indexOfObject, 1);
    }
    setCheckId(updatedList);
    setSelectedPoProducts(selectedPoProducts);
  };

  //Add to stocks
  const addQtytoStocks = () => {
    const isEmpty = Object.keys(checkId).length === 0;

    if (isEmpty) {
      Swal.fire('Please select atleast one product!');
    } else {
      const selectedProducts = checkId;
      setCheckId([]);
      selectedProducts.forEach((elem) => {
     
        if (elem.item.status !== 'Closed') {
          elem.item.status = 'Closed';
          elem.item.qty_updated = elem.item.qty_delivered;
          elem.item.qty_in_stock += parseFloat(elem.item.qty_delivered);

          api
            .post('/inventory/editInventoryStock', elem.item)
            .then(() => {
              message('Quantity added successfully.', 'success');
               
            })
            .catch(() => {
              message('unable to add quantity.', 'danger');
            });
        } else {
          message('This product is already added', 'danger');
        }
      });
    }
  };


  const insertDeliveryHistoryOrder = (proId, deliveryOrderId) => {
    api
      .post('/projecttabdeliveryorder/insertDeliveryHistoryOrder', {
        product_id: proId.product_id,
        purchase_order_id: proId.purchase_order_id,
        delivery_order_id: deliveryOrderId,
        status: '1',
        quantity: proId.qty,
        item_title: proId.item_title,
        creation_date: moment(),
        modification_date: moment(),
        remarks: proId.description,
      })
      .then(() => {
        message('Delivery Order Item Inserted', 'success');
      })
      .catch(() => {
        message('Unable to add Delivery Order Item', 'error');
      });
  };

  const insertDelivery = () => {
    const isEmpty = Object.keys(checkId).length === 0;

    if (isEmpty) {
      Swal.fire('Please select atleast one product!');
    } else {
      api
        .post('/projecttabdeliveryorder/insertdelivery_order', {
          project_id: id,
          company_id: projectDetail.company_id,
          purchase_order_id: '',
          date: new Date(),
          created_by: '1',
          creation_date: new Date(),
          modified_by: '1',
          modification_date: new Date(),
        })
        .then((res) => {
          const selectedProducts = checkId;
          setCheckId([]);
          selectedProducts.forEach((element) => {
            insertDeliveryHistoryOrder(element.item, res.data.data.insertId);
          });
        })
        .catch(() => {
          message('Unable to add delivery order.', 'error');
        });
    }
  };

  // deleteDeliveryOrder
  const deleteDeliveryOrder = (deliveryOrderId) => {
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/projecttabdeliveryorder/deletedelivery_order', {
            delivery_order_id: deliveryOrderId,
          })
          .then(() => {
            Swal.fire('Deleted!', 'Delivery Order has been deleted.', 'success');
            window.location.reload();
          })
          .catch(() => {
            message('Unable to Delete Delivery Order', 'info');
          });
      }
    });
  };


  const deleteData = () => {
    Swal.fire({
      title: `Are you sure? $`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post('/project/deleteProject', { project_id: id }).then(() => {
          Swal.fire('Deleted!', 'Project has been deleted.', 'success');
          window.location.reload();
        });
      }
    });
  };

  const getLineItem = (quotationId) => {
    api.post('/project/getQuoteLineItemsById', { quote_id: quotationId }).then((res) => {
      setLineItem(res.data.data);
      console.log('lineItem', res.data.data);

      //setViewLineModal(true);
    });
  };



  //Attachments
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  //Add Quote
  const insertQuote = async (code) => {
    const newQuoteId = quoteForm;
    newQuoteId.project_id = id;
    newQuoteId.quote_code = code;
    api
      .post('/projecttabquote/insertquote', newQuoteId)
      .then(() => {
        message('Quote inserted successfully.', 'success');
        window.location.reload();
      })
      .catch(() => {
        message('Network connection error.', 'error');
      });
  };

  // Work Insert
  const insertWorkOrder = async (code) => {
    const newWorkOrderId = workOrderForm;
    newWorkOrderId.project_id = id;
    newWorkOrderId.sub_con_worker_code = code;
    api
      .post('/projecttabsubconworkorder/insertsub_con_work_order', newWorkOrderId)
      .then(() => {
        message('WorkOrder inserted successfully.', 'success');
        window.location.reload();
      })
      .catch(() => {
        message('Network connection error.', 'error');
      });
  };
  const SubConWorkOrder = () => {
    api.post('/projecttabsubconworkorder/SubConWorkOrderPortal', { project_id: id }).then((res) => {
      setSubConWorkOrdeData(res.data.data);
    });
  };
  useEffect(() => {
    SubConWorkOrder();
  }, [id]);
  //generateCode
  const generateCodeQuote = (type) => {
    api
      .post('/commonApi/getCodeValue', { type })
      .then((res) => {
        insertQuote(res.data.data);
      })
      .catch(() => {
        insertQuote('');
      });
  };
  //generateCode
  const generateCode = () => {
    api
      .post('/tender/getCodeValue', { type: 'subConworkOrder' })
      .then((res) => {
        insertWorkOrder(res.data.data);
      })
      .catch(() => {
        insertWorkOrder('');
      });
  };
  useEffect(() => {
    getProjectById();
    TabDeliveryOrder();
    getLineItem();
    TabPurchaseOrderLineItemTable();
    getContactById();
  }, [id]);

  useEffect(() => {
    setTimeout(() => {
      TabPurchaseOrderLineItemTable();
    }, 2000);
  }, [addPurchaseOrderModal]);

  const getTotalOfPurchase = (pItems) => {
    let total = 0;
    pItems.forEach((a) => {
      total += parseInt(a.qty, 10) * parseFloat(a.cost_price, 10);
    });
    return total;
  };

  return (
    <>
      <BreadCrumbs />
      <ProjectButton
        UpdateData={UpdateData}
        navigate={navigate}
        applyChanges={applyChanges}
        deleteData={deleteData}
        backToList={backToList}
      ></ProjectButton>

      <ProjectEditForm projectDetail={projectDetail} setProjectDetail={setProjectDetail} />

      <ComponentCard title="More Details">
        <ToastContainer></ToastContainer>

        {/* Call Modal's */}

        <DuctingCostModal
          addDuctingCostModal={addDuctingCostModal}
          setAddDuctingCostModal={setAddDuctingCostModal}
        />
        <AddPurchaseOrderModal
          projectId={id}
          addPurchaseOrderModal={addPurchaseOrderModal}
          setAddPurchaseOrderModal={setAddPurchaseOrderModal}
        />
{/* 
        {viewQuotationsModal && (
          <ViewQuoteLogModal
            viewQuotationsModal={viewQuotationsModal}
            setViewQuotationsModal={setViewQuotationsModal}
            id={id}
          />
        )} */}
        <ViewLineItemModal viewLineModal={viewLineModal} setViewLineModal={setViewLineModal} />
        <EditQuotation editQuoteModal={editQuoteModal} setEditQuoteModal={setEditQuoteModal} />
        <EditDeliveryOrder
          editDeliveryOrder={editDeliveryOrder}
          setEditDeliveryOrder={setEditDeliveryOrder}
          data={deliveryData}
        />
        {editPo && <EditPoModal editPo={editPo} setEditPo={setEditPo} data={POId} />}
        {editPOLineItemsModal && (
          <EditPOLineItemsModal
            editPOLineItemsModal={editPOLineItemsModal}
            setEditPOLineItemsModal={setEditPOLineItemsModal}
            data={POId}
          />
        )} 
        <CreateFinance financeModal={financeModal} setFinanceModal={setFinanceModal} />
        <Tab toggle={toggle} tabs={tabs} />
        {/* Tab 1 */}
        <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1" eventkey="costingSummary">
            <CostingSummary></CostingSummary>
          </TabPane>
          {/* Tab 2 */}
          <TabPane tabId="2" eventkey="quotationMoreDetails">
            <QuotationMoreDetails
              // setViewQuotationsModal={setViewQuotationsModal}
              insertQuote={insertQuote}
              handleQuoteForms={handleQuoteForms}
              generateCodeQuote={generateCodeQuote}
              quotationsModal={quotationsModal}
              lineItem={lineItem}
              getLineItem={getLineItem}
              setquotationsModal={setquotationsModal}
              id={id}
            ></QuotationMoreDetails>
          </TabPane>
          {/* Tab 3 Materials Purchased */}
          <TabPane tabId="3" eventkey="materialPurchased">
            <MaterialPurchased
              addPurchaseOrderModal={addPurchaseOrderModal}
              setAddPurchaseOrderModal={setAddPurchaseOrderModal}
              insertDelivery={insertDelivery}
              addQtytoStocks={addQtytoStocks}
              tabPurchaseOrderLineItemTable={tabPurchaseOrderLineItemTable}
              setTabPurchaseOrderLineItemTable={setTabPurchaseOrderLineItemTable}
              testJsonData={testJsonData}
              setEditPo={setEditPo}
              setPOId={setPOId}
              setEditPOLineItemsModal={setEditPOLineItemsModal}
              getTotalOfPurchase={getTotalOfPurchase}
              handleCheck={handleCheck}
              setTransferModal={setTransferModal}
              setTransferItem={setTransferItem}
              // getCheckedPoProducts={getCheckedPoProducts}
              setViewLineModal={setViewLineModal}
            />
            {transferModal && (
              <TransferModal
                transferModal={transferModal}
                setTransferModal={setTransferModal}
                transferItem={transferItem}
              />
            )}
          </TabPane>

          {/* Tab 4 */}
          <TabPane tabId="4" eventkey="materialsusedTab">
            <MaterialsusedTab projectId={id} />
          </TabPane>

          {/* Tab 5 */}
          <TabPane tabId="5" eventkey="materialsTransferred">
            <MaterialsTransferred projectId={id} />
          </TabPane>

          {/* Start Tab Content 6  Delivery Order */}
          <TabPane tabId="6">
            <DeliveryOrder
              deleteDeliveryOrder={deleteDeliveryOrder}
              tabdeliveryorder={tabdeliveryorder}
              setTabdeliveryorder={setTabdeliveryorder}
              setDeliveryData={setDeliveryData}
              setEditDeliveryOrder={setEditDeliveryOrder}
              deliveryData={deliveryData}
              editDeliveryOrder={editDeliveryOrder}
            />
          </TabPane>

          {/* Start Tab Content 7  Subcon Work Order */}
          <TabPane tabId="7" eventkey="subConWorkOrderPortal">
            <Row className="mb-4">
              <Col md="2">
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={(e) => {
                    insertWorkOrder();
                    handleClientForms(e);
                    generateCode(e);
                  }}
                >
                  Add Work Order
                </Button>
              </Col>
            </Row>

            <Row>
              <CardTitle tag="h4" className="border-bottom bg-dark p-2 mb-0 text-white">
                {' '}
                Work Orders{' '}
              </CardTitle>
            </Row>

            <SubConWorkOrderPortal projectId={id} subConWorkOrdeData={subConWorkOrdeData} />
            {/* <SubconWorkPaymentHistory projectId={id} /> */}
          </TabPane>

          {/* Start Tab Content 8 */}
          <TabPane tabId="8" eventkey="claim">
            <Claim
              projectDetail={projectDetail}
              projectId={id}
              checkId={checkId}
              deliveryData={deliveryData}
              editPo={editPo}
              POId={POId}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              RoomName={RoomName}
              setRoomName={setRoomName}
              fileTypes={fileTypes}
              setFileTypes={setFileTypes}
              attachmentData={attachmentData}
              dataForAttachment={dataForAttachment}
            />
          </TabPane>

          {/* Start Tab Content 9 */}
          <TabPane tabId="9" eventkey="financeTab">
            <FinanceTab projectId={id} projectDetail={projectDetail}></FinanceTab>
          </TabPane>

          {/* Start Tab Content 10 */}
          <TabPane tabId="10" eventkey="addEmployee">
            <Row>
              <AddEmployee />
              <Col xs="12" md="3" className="mb-3">
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={() => {
                    setRoomName('ProjectAttach');
                    setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                    dataForAttachment();
                    setAttachmentModal(true);
                  }}
                >
                  Add
                </Button>
              </Col>
            </Row>

            <AttachmentModalV2
              moduleId={id}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              roomName={RoomName}
              fileTypes={fileTypes}
              altTagData="ProjectAttach Data"
              desc="ProjectAttach Data"
              recordType="Picture"
              mediaType={attachmentData.modelType}
            />
            <ViewFileComponentV2 moduleId={id} roomName="ProjectAttach" recordType="Picture" />
          </TabPane>

          {/* End Tab Content 10 */}
        </TabContent>
      </ComponentCard>
    </>
  );
};

export default ProjectEdit;
