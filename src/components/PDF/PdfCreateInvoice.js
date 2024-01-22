import React, { useState } from 'react';
import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import moment from 'moment';
import * as numberToWords from 'number-to-words';
//import Converter from 'number-to-words';
import api from '../../constants/api';
import message from '../Message';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';
//import PdfHeader2 from './PdfHeader2';

const PdfCreateInvoice = ({ invoiceId, projectDetail }) => {
  PdfCreateInvoice.propTypes = {
    invoiceId: PropTypes.any,
    projectDetail: PropTypes.any,
  };
  const [hfdata, setHeaderFooterData] = React.useState();
  //const [hfdata1, setHeaderFooterData1] = React.useState();
  const [cancelInvoice, setCancelInvoice] = React.useState([]);
  const [createInvoice, setCreateInvoice] = React.useState('');
  const [gTotal, setGtotal] = React.useState(0);

  //const [gstTotal, setGstTotal] = React.useState(0);
  //const [Total, setTotal] = React.useState(0);

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);
  // React.useEffect(() => {
  //   api.get('/setting/getSettingsForCompany1').then((res) => {
  //     setHeaderFooterData1(res.data.data);
  //   });
  // }, []);

  console.log('companyInvoice', projectDetail);
  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };
 

  // Gettind data from Job By Id
  const getInvoiceById = () => {
    api
      .post('/invoice/getInvoiceByInvoiceId', { invoice_id: invoiceId })
      .then((res) => {
        setCreateInvoice(res.data.data);
      })
      .catch(() => {
        message('Invoice Data Not Found', 'info');
      });
  };
  const calculateTotal = () => {
    const grandTotal = cancelInvoice.reduce((acc, element) => acc + element.amount, 0);
    const gstValue = createInvoice.gst_value || 0;
    const total = grandTotal + gstValue;
    return total;
  };
  // const calculateTotal = () => {
  //   const grandTotal = cancelInvoice.reduce((acc, element) => acc + element.total_cost, 0);
  //   const gstValue = createInvoice.gst_value || 0;
  //   const total = grandTotal + gstValue;
  //   return total;
  // };
  const [parsedQuoteCondition, setParsedQuoteCondition] = useState('');
  React.useEffect(() => {
    // Other logic you have here...

    // Update this part of your code to handle HTML content stored in the quote_condition field
    // const parseHTMLContent = (htmlContent) => {
    //   if (htmlContent) {
    //     // Remove HTML tags using a regular expression
    //     const plainText = htmlContent.replace(/<[^>]*>?/gm, '');
    //     setParsedQuoteCondition(plainText);
    //   }
    // };
    const parseHTMLContent = (htmlContent) => {
      if (htmlContent) {
        // Replace all occurrences of &nbsp; with an empty string
        const plainText = htmlContent.replace(/&nbsp;/g, '');
    
        // Remove HTML tags using a regular expression
        const plainTextWithoutTags = plainText.replace(/<[^>]*>?/gm, '');
    
        setParsedQuoteCondition(plainTextWithoutTags);
      }
    };
    // Assuming quote.quote_condition contains your HTML content like "<p>Terms</p>"
    parseHTMLContent(createInvoice.payment_terms);

    // Other logic you have here...
  }, [createInvoice.payment_terms]);

  //The quote_condition content and format it as bullet points
  const formatQuoteConditions = (conditionsText) => {
    const formattedConditions = conditionsText.split(':-').map((condition, index) => {
      const trimmedCondition = condition.trim();
      return index === 0 ? `${trimmedCondition}` : `:- ${trimmedCondition}`;
    });
    return formattedConditions;
  };

  // Format the conditions content for PDF
  const conditions = formatQuoteConditions(parsedQuoteCondition);
  // const conditionsContent = conditions.map((condition) => ({
  //   text: `${condition}`,
  //   fontSize: 10,
  //   margin: [15, 5, 0, 0],
  //   style: ['notesText', 'textSize'],
  // }));
  // / Format the conditions content for PDF
const conditionsContent = conditions.map((condition) => ({
  text: `${condition}`,
  fontSize: 10,
  margin: [15, 5, 0, 0],
  style: ['notesText', 'textSize'],
  lineHeight: 1.2,
}));
  //console.log('2', gstTotal);
  const getInvoiceItemById = () => {
    api
      .post('/invoice/getInvoiceItemByInvoiceId', { invoice_id: invoiceId })
      .then((res) => {
        setCancelInvoice(res.data.data);
        let grandTotal = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.amount;
        });

        setGtotal(grandTotal);
      })
      .catch(() => {
        message('Invoice Data Not Found', 'info');
      });
  };
  React.useEffect(() => {
    getInvoiceItemById();
    getInvoiceById();
  }, []);

  const GetPdf = () => {
    const productItems = [
      [
        {
          text: 'Sn',
          style: 'tableHead',
        },
        {
          text: 'Description',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: 'Uom',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: 'Qty',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: 'Unit Price',
          style: 'tableHead',
          alignment: 'right',
        },
        {
          text: 'Total Amount',
          style: 'tableHead',
          alignment: 'right',
        },
      ],
    ];
    cancelInvoice.forEach((element, index) => {
      productItems.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.description ? element.description : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
        {
          text: `${element.unit ? element.unit : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
        {
          text: `${element.qty ? element.qty : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
        {
          text: `${element.unit_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          style: 'tableBody1',  
          alignment: 'right',
        },
        {
          text: `${element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          style: 'tableBody1',
          alignment: 'right',
        },
      ]);
    });

    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
       pageMargins: [40, 120, 40, 10],
      //pageMargins: [40, 40, 30, 0],
      footer: PdfFooter,


      content: [
        // {
        //   columns: [
        //     {
        //       image: `${findCompany("cp.companyLogo")}`,
        //       style: 'logo', width: 80, alignment: 'left', margin: [0, -20, 0, 0]
        //     },

        //     // { text: `${findCompany("cp.companyName")}`, alignment: 'center', bold: true, fontSize: 17, color: 'Blue', margin: [0, -20, 80, 0] },
        //   ],
        // },


        // '\n\n',
        // { text: `${findCompany("cp.companyName")}`, alignment: 'center', bold: true, fontSize: 14, color: 'Blue', margin: [0, -70, 0, 0] },
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
            widths: ['101%'],
            body: [
              [
                {
                  text: `TAX INVOICE`,
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',

        {
          columns: [
            {
              stack: [
                {
                  text: `To `,
                  style: ['textSize'],
                  margin: [30, 0, 0, 0],
                },
                {
                  text: ` \n${createInvoice.cust_company_name ? createInvoice.cust_company_name : ''}`,
                  color: 'blue',
                  style: ['textSize'],
                  margin: [30, 3, 0, 0],
                },
                {
                  text: ` ${createInvoice.cust_address1 ? createInvoice.cust_address1 : ''
                    }\n ${createInvoice.cust_address2 ? createInvoice.cust_address2 : ''}\n${createInvoice.cust_address_country ? createInvoice.cust_address_country : ''
                    } ${createInvoice.cust_address_po_code ? createInvoice.cust_address_po_code : ''
                    }`,
                  style: ['textSize'],
                  margin: [30, 3, 0, 0],
                },
                '\n',
              ],
            },
            {
              stack: [
                {
                  text: ` Invoice No       : ${createInvoice.invoice_code ? createInvoice.invoice_code : ''
                    } `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                {
                  text: `Invoice Date    : ${moment(
                    createInvoice.invoice_date ? createInvoice.invoice_date : '',
                  ).format('DD-MM-YYYY')}  `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                {
                  text: `Our Ref            : ${createInvoice.project_reference ? createInvoice.project_reference : ''} `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                {
                  text: `Revision           : ${createInvoice.revision ? createInvoice.revision : ''} `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                {
                  text: ` Your Po No      : ${createInvoice.po_number ? createInvoice.po_number : ''} `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                {
                  text: ` Job Code         : ${createInvoice.job_code ? createInvoice.job_code : ''} `,
                  style: ['textSize'],
                  margin: [100, 2, 0, 0],
                },
                '\n',
              ],
            },
          ],
        },
        '\n',

        {
          columns: [
            {
              text: `ATTN : ${createInvoice.attention ? createInvoice.attention : ''
                }  `,
              style: 'textSize',
              margin: [30, 0, 0, 0],
              bold: true,
            },
          ],
        },
        '\n\n',
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
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
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
            widths: ['50%', '51%'],

            body: [
              [
                {
                  text: 'Job Details',
                  alignment: 'center',
                  style: 'tableHead',
                },
                {
                  text: 'Payment Terms',
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',
        {
          columns: [
            {
              text: `${createInvoice.title ? createInvoice.title : ''
                }`,
              alignment: 'center',
              style: ['notesText', 'textSize'],
            },
            {
              text: `${createInvoice.invoice_terms ? createInvoice.invoice_terms : ''
                } `,
              alignment: 'center',
              style: ['invoiceAdd', 'textSize'],
            },
          ],
        },

        '\n', '\n',
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
            widths: [20, 160, 38, 40, 65, 70],

            body: productItems,
          },
        },
        '\n\n',
        {
          stack: [
            {
              text: `TOTAL $ : ${gTotal.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`,
              alignment: 'right',
              margin: [0, 0, 5, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `GST ${createInvoice.gst_percentage ? createInvoice.gst_percentage : ''}% :      ${createInvoice.gst_value.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}`,
              alignment: 'right',
              margin: [0, 0, 5, 0],
              style: 'textSize',
            },
            '\n',
            {
              text: `GRAND TOTAL ($) : ${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
              alignment: 'right',
              margin: [0, 0, 5, 0],
              style: 'textSize',
            },
            '\n\n\n',
            {
              text: `TOTAL :  ${numberToWords.toWords(calculateTotal()).toUpperCase()}`, // Convert total to words in uppercase
              bold: 'true',
              fontSize: '11',
              margin: [40, 0, 0, 0],
            },

          ],
        },
        '\n\n',


        {
          text: `Terms and Conditions: `,
          fontSize: 11,
          decoration: 'underline',
          margin: [0, 5, 0, 0],
          style: ['notesText', 'textSize'],
        },
        ...conditionsContent, // Add each condition as a separate paragraph


        '\n\n',
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
          alignment: 'center',
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10,
        },
        tableBody1: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10,
        },
        tableBody2: {
          border: [false, false, false, true],
          margin: [0, 5, 35, 5],
          alignment: 'right',
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
      <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf}>
        Print Invoice
      </Button>
    </>
  );
};

export default PdfCreateInvoice;