import React from 'react';
import pdfMake from 'pdfmake';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import api from '../../constants/api';
//.import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';

const PdfMaterialRequestOrder = ({tabPurchaseOrderLineItemTable,purchasePoOrder}) => {
  PdfMaterialRequestOrder.propTypes = {
    tabPurchaseOrderLineItemTable: PropTypes.any,
    purchasePoOrder:PropTypes.any,
    };

  const { id } = useParams();
  const [hfdata, setHeaderFooterData] = React.useState();
  //const [addPurchaseOrderModal, setAddPurchaseOrderModal] = React.useState();
  // const [tabPurchaseOrderLineItemTable, setTabPurchaseOrderLineItemTable] = React.useState();
  //const [gTotal, setGtotal] = React.useState(0);
  

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);
  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };
  const getPoProduct = () => {
    api
      .post('/materialrequest/getProjectMaterialRequestByPdf', { project_id: id })
      .then(() => {
        //setAddPurchaseOrderModal(res.data.data[0]);
      })
      .catch(() => {
         
      });
  };
  console.log("0",purchasePoOrder);
  const calculateTotal = () => {
    const grandTotal = tabPurchaseOrderLineItemTable.reduce(
      (acc, element) => acc + element.quantity * element.cost_price,
      0
    );
  
    return grandTotal;
  };
  const calculateGSTTotal = () => {
    const gstValue = (purchasePoOrder.gst_percentage / 100) * calculateTotal() ;
    console.log("PO1",gstValue);
    
    return gstValue;
  };
   const calculateGSTAmount = () => {
    const gstAmountValue = calculateTotal() + calculateGSTTotal();
    return gstAmountValue;
  };
  const getPurchaseOrderId = () => {
    api
      .post('/materialrequest/getProjectMaterialRequestByPdf', { project_id: id })
      .then(() => {
        //setTabPurchaseOrderLineItemTable(res.data.data);
        //grand total
        // let grandTotal = 0;
        //     res.data.data.forEach((elem) => {
        //   grandTotal += elem.amount;
        // });
        // setGtotal(grandTotal);
        
      })
      .catch(() => {
         
      });
  };
  React.useEffect(() => {
    getPurchaseOrderId();
    getPoProduct();
  }, []);

  const GetPdf = () => {
    const productItems = [
      [
        {
          text: 'S.NO',
          style: 'tableHead',
        },
        {
          text: 'Product Name',
          style: 'tableHead',
        },
        {
          text: 'Supplier',
          style: 'tableHead',
        },
        {
          text: 'Uom',
          style: 'tableHead',
        },
        {
          text: 'Qty',
          style: 'tableHead',
        },
        {
          text: 'Unit Price S$ ',
          style: 'tableHead',
        },
        {
          text: 'Amount S$',
          style: 'tableHead',
        },
      ],
    ];
    tabPurchaseOrderLineItemTable.forEach((element, index) => {
      const quantity = element.quantity || 0;
      const unitPrice = element.cost_price || 0;
      const amount11 = quantity * unitPrice;
      productItems.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.item_title ? element.item_title : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.company_name ? element.company_name : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.unit ? element.unit : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
        },
        {
          text: `${element.quantity ? element.quantity : ''}`,
          border: [false, false, false, true],
          style: 'tableBody2',
        },
        {
          text: `${element.cost_price?element.cost_price.toLocaleString('en-IN', { minimumFractionDigits: 2 }):''}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          style: 'tableBody1',
        },
        {
          border: [false, false, false, true],
          text: `${amount11.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          fillColor: '#f5f5f5',
          style: 'tableBody1',
        },
      ]);
    });
    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 150, 40, 80],
    //  footer: PdfFooter({ findCompany }),
      content: [
        {
          columns: [
            {
              stack: [
                { text: ``, style: ['textSize'] },
                '\n',

                {
                  text: ``,
                  style: ['textSize'],
                },
              ],
            },
            {
              stack: [
                {
                  text: `MR Number :${
                    purchasePoOrder.mr_code ? purchasePoOrder.mr_code : ''
                  } `,
                  style: ['textSize'],
                  margin: [120, 0, 0, 0],
                },
                {
                  text: ` MR Date : ${
                    purchasePoOrder.mr_date
                      ? moment(purchasePoOrder.mr_date).format('DD-MM-YYYY')
                      : ''
                  } `,
                  style: ['textSize'],
                  margin: [120, 0, 0, 0],
                },
                {
                  text: ` Request Date :${
                    purchasePoOrder.request_date
                      ? moment(purchasePoOrder.request_date).format('DD-MM-YYYY')
                      : ''
                  } `,
                  style: ['textSize'],
                  margin: [120, 0, 0, 0],
                },
                {
                  text: ` Request By : ${
                    purchasePoOrder.request_by
                      ? purchasePoOrder.request_by
                      : ''
                  }`,
                  style: ['textSize'],
                  margin: [120, 0, 0, 0],
                },
                { text: ` Site Ref : ${
                  purchasePoOrder.site_reference
                    ? purchasePoOrder.site_reference
                    : ''
                }`, style: ['textSize'], margin: [120, 0, 0, 0] },
              ],
            },
          ],
        },
        '\n',
      
       
      

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['8%', '31%','14%', '10%', '10%', '20%', '20%', '14%'],

            body: productItems,
          },
        },
        '\n',
        '\n',

        {
          columns: [
            {
              text: `Approved By :${ purchasePoOrder.approved_by ? purchasePoOrder.approved_by : ''}`,
              alignment: 'left',
              style: ['invoiceAdd', 'textSize'],
            },
            {
              stack: [
                {
                  text: `SubTotal $ :    ${calculateTotal().toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  style: ['textSize'],
                  margin: [130, 0, 0, 0],
                },
                '\n',
               

                {
                  text: `GST:        ${calculateGSTTotal().toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  style: ['textSize'],
                  margin: [160, 0, 0, 0],
                },
                '\n',
                {
                  text: `Total $ :     ${calculateGSTAmount().toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  style: ['textSize'],
                  margin: [145, 0, 0, 0],
                },
              ],
            },
          ],
        },
        '\n',
      ],
      margin: [0, 50, 50, 50],

      styles: {
        logo: {
          margin: [-20, 20, 0, 0],
        },
        address: {
          margin: [-10, 20, 0, 0],
        },
        invoice: {
          margin: [0, 30, 0, 10],
          alignment: 'right',
        },
        invoiceAdd: {
          alignment: 'right',
        },
        textSize: {
          fontSize: 10,
        },
        notesTitle: {
          bold: true,
          margin: [0, 50, 0, 3],
        },
        tableHead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          fontSize: 10,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 10,
        },
        tableBody1: {
          border: [false, false, false, true],
          margin: [10, 5, 0, 5],
          alignment: 'right',
          fontSize: 10,
        },
        tableBody2: {
          border: [false, false, false, true],
          margin: [15, 5, 0, 5],
          alignment: 'center',
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <span onClick={GetPdf}>
        Print Pdf
      </span>
    </>
  );
};

export default PdfMaterialRequestOrder;
