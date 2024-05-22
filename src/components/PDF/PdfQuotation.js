import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import Converter from 'number-to-words';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import moment from 'moment';
import api from '../../constants/api';
// import PdfFooter from './PdfFooter';
// import PdfHeader from './PdfHeader';

const PdfQuotation = ({ id, quoteId }) => {
  PdfQuotation.propTypes = {
    id: PropTypes.any,
    quoteId: PropTypes.any,
  };
  const [hfdata, setHeaderFooterData] = React.useState();
  const [quote, setQuote] = React.useState([]);
  //const [projectDetail, setProjectDetail] = useState();
  const [lineItem, setLineItem] = useState([]);
  const [gTotal, setGtotal] = React.useState(0);
//   const [parsedQuoteCondition, setParsedQuoteCondition] = useState('');
  // const [gstTotal, setGsttotal] = React.useState(0);
  // const [Total, setTotal] = React.useState(0);
  //const [lineItem, setLineItem] = useState(null);

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };


  // Get Quote By Id
  const getQuote = () => {
    api.post('/project/getQuotePdfById', { quote_id: id }).then((res) => {
      setQuote(res.data.data[0]);
      console.log('quote2', res.data.data[0]);
    });
  };

  const calculateTotal = () => {
    const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
    const discount = quote.discount || 0; // Get the discount from the quote or default to 0 if not provided
    const total = grandTotal - discount; // Deduct the discount from the grand total

    return total;
  };
  const getQuoteById = () => {
    api
      .post('/project/getQuoteLineItemsById', { quote_id: quoteId })
      .then((res) => {
        setLineItem(res.data.data);
        console.log('quote1', res.data.data);
        let grandTotal = 0;
        // let grand = 0;
        // let gst = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.amount;
          //  grand += elem.actual_value;
        });
        setGtotal(grandTotal);
        // gst = grandTotal * 0.07;
        // setGsttotal(gst);
        // grand = grandTotal + gst;
        // setTotal(grand);
        //setViewLineModal(true);
      })
      .catch(() => { });
  };
  React.useEffect(() => {
    getQuote();
    getQuoteById();
    //getProjectById();
  }, []);

//   React.useEffect(() => {
//     const parseHTMLContent = (htmlContent) => {
//       if (htmlContent) {
//         // Replace all occurrences of &nbsp; with an empty string
//         const plainText = htmlContent.replace(/&nbsp;/g, '');

//         // Remove HTML tags using a regular expression
//         const plainTextWithoutTags = plainText.replace(/<[^>]*>?/gm, '');

//         setParsedQuoteCondition(plainTextWithoutTags);
//       }
//     };
//     // Assuming quote.quote_condition contains your HTML content like "<p>Terms</p>"
//     parseHTMLContent(quote.quote_condition);

//     // Other logic you have here...
//   }, [quote.quote_condition]);

//   //The quote_condition content and format it as bullet points
//   const formatQuoteConditions = (conditionsText) => {
//     const formattedConditions = conditionsText.split(':-').map((condition, index) => {
//       const trimmedCondition = condition.trim();
//       return index === 0 ? `${trimmedCondition}` : `:- ${trimmedCondition}`;
//     });
//     return formattedConditions;
//   };

//   // Format the conditions content for PDF
//   const conditions = formatQuoteConditions(parsedQuoteCondition);

//   // / Format the conditions content for PDF
//   const conditionsContent = conditions.map((condition) => ({
//     text: `${condition}`,
//     fontSize: 10,
//     margin: [15, 5, 0, 0],
//     style: ['notesText', 'textSize'],
//     lineHeight: 1.2,
//   }));

  const GetPdf = () => {
    const lineItemBody = [
      [
        {
          text: 'SN',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Description',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Qty',
          style: 'tableHead',
          alignment: 'center'
        },
        {
            text: 'Unit Price',
            style: 'tableHead',
            alignment: 'center'
          },
        {
          text: 'Amount $',
          style: 'tableHead',
          alignment: 'right'
        },
      ]
    ]
    lineItem.forEach((element, index) => {
      lineItemBody.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          alignment: 'center'

        },
        {
          text: `${element.description}`,
          style: 'tableBody',
          alignment: 'center'
        },

        {
          text: `${element.quantity}${element.unit}`,
          // border: [false, false, false, true],
          alignment: 'center',
          style: 'tableBody',
        },
        {
            text: `${element.unit_price}`,
            // border: [false, false, false, true],
            alignment: 'center',
            style: 'tableBody',
          },

        {
          text: `${(element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }))}`,
          // border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'right'
        },

      ]);
    });


    const dd = {
      pageSize: 'A4',
      // header: PdfHeader({ findCompany }),
      pageMargins: [40, 40, 30, 0],
      // footer: PdfFooter,
      content: [      

        {
            columns: [
              {
                image: `${findCompany('cp.companyLogo')}`,
                style: 'logo',
                width: 80,
                alignment: 'left',
                margin: [0, -20, 0, 0],
              },
  
              {
                text: `${findCompany('cp.companyName')}`,
                alignment: 'center',
                bold: true,
                fontSize: 17,
                color: 'green',
                margin: [0, -20, 80, 0],
              },
            ],
          },
  
          {
            text: `${findCompany('cp.companyAddress1')}, ${findCompany(
              'cp.companyAddress2',
            )}, ${findCompany('cp.companyAddress3')}`,
            alignment: 'center',
            fontSize: 11,
            color: 'blue',
            margin: [55, 0, 50, 10],
          },
          {
            text: `Tel No:${findCompany('cp.companyPhone')}, Fax:${findCompany(
              'cp.companyEmail',
            )}, Email:${findCompany('cp.companyEmail')}`,
            style: 'textSize',
            margin: [45, -8, 50, 10],
            color: 'blue',
            alignment: 'center',
            fontSize: 11,
          },
          {
            text: `Registration No:${findCompany('cp.companyUEN')}, ${findCompany('cp.gstNumber')}`,
            style: 'textSize',
            margin: [45, -8, 50, 10],
            color: 'blue',
            alignment: 'center',
            fontSize: 11,
          },
          {
            canvas: [{ type: 'line', x1: 480, y1: 0, x2: 0, y2: 0, lineWidth: 1 }],
            margin: [15, -9, 0, 20],
          },
  
          {
            text: `Quotation`,
            alignment: 'center',
            fontSize: 12,
            decoration: 'underline', // Underline added here
            style: 'tableHead',
          },
          '\n',
          {
            columns: [
              {
                stack: [
                  {
                    text: `To : `,
                    bold: true,
                    style: ['textSize'],
                    margin: [0, 0, 0, 0],
                  },
  
                  {
                    text: ` ${quote.company_name ? quote.company_name : ''}\n${
                      quote.billing_address_flat ? quote.billing_address_flat : ''
                    }\n ${quote.billing_address_street ? quote.billing_address_street : ''}\n${
                      quote.billing_address_country ? quote.billing_address_country : ''
                    }\n${
                      quote.billing_address_po_code ? quote.billing_address_po_code : ''
                    }`,
                    style: ['textSize'],
                    margin: [20, -5, 0, 0],
                  },
                ],
              },
              {
                stack: [
                  {
                    text: `QUOTE DATE  : ${(quote.quote_date) ? moment(quote.quote_date).format('DD-MM-YYYY') : ''}  `,
                    bold: true,
                    fontSize: 9,
                    margin: [90, 0, 0, 0],
                  },
                  {
                    text: `REF NO            : ${
                      quote.ref_no_quote ? quote.ref_no_quote : ''
                    } `,
                    fontSize: 9,
                    alignment:'left',
                    bold: true,
                    margin: [90, 3, 0, 0],
                  },
                 
                  '\n',
                ],
              },
            ],
          },
          '\n',

        '\n',
        { text: `Project :${quote.title ? quote.title : ''}`, style: ['notesText', 'textSize'] },

        '\n',
 
        {
          text: `
           Dear Sir,

           Thank you for your consideration and opportunity to render our services, we strongly believe our quote match your expectation. One (1) time erection and Modification preliminary quote for NFE-FLNG Demolition(0109J110039) for phase II.`,

          style: ['notesText', 'textSize']
        },
        '\n',

        {
          layout: {
            defaultBorder: true,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return 'black';
              }
              return 'black';
            },
            vLineColor: (i) => {
              if (i === 1 || i === 0) {
                return 'black';
              }
              return 'black';
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
              return 'white';
            },
          },
          table: {
            headerRows: 1,
            widths: ['18%', '35%', '15%', '14%','17%'],

            body: lineItemBody
          },
        },
        '\n',
        {
          stack: [
            { text: `Total ($) :  ${(gTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }))}`, style: ['textSize'], margin: [0, 0, 15, 0], alignment: 'right',bold:true },
            '\n',
            {
                text: `Discount  :       ${quote.discount ? quote.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0'}`,
                alignment: 'right',
                margin: [0, 0, 15, 0],
                style: 'textSize',
              },
              '\n',
              {
                text: `Grand Total $ :   ${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                alignment: 'right',
                margin: [0, 0, 15, 0],
                style: 'textSize',
              },
        
          ]
        },
        '\n\n',       
        
          
             {
              text: `Terms and Condition:-`,
              decoration: 'underline',
              alignment:'Left',
              
                         },'\n',
            {
              text: `${findCompany("cp.quoteTermsAndCondition")}`,
              style: ['notesText', 'textSize'],
              margin:[30,0,0,0]
            },

            // {
            //     text: `Terms and Conditions: `,
            //     fontSize: 11,
            //     decoration: 'underline',
            //     margin: [0, 5, 0, 0],
            //     style: ['notesText', 'textSize'],
            //   },
            //   ...conditionsContent, // Add each condition as a separate paragraph
      
            //   '\n',
            //   '\n',
      
            


        '\n',
        {
          text: 'Yours Truly,',
          style: 'textSize',
          margin: [0, 10, 0, 0],
        },
        '\n\n',
        {
          text: 'DIRECTOR',
          style: 'textSize',
          margin: [0, 10, 0, 0],
        },
        '\n\n',
        {
          text: `Tel No:${findCompany("cp.companyPhone")}`,
          style: 'textSize',
          decoration: 'underline',
          margin: [0, 0, 0, 0],
          alignment: 'left'
        },
        '\n',
        {
          text: `Email:${findCompany("cp.companyEmail")}`,
          style: 'textSize',
          margin: [0, -24, 20, 0],
          decoration: 'underline',
          color:'blue',
          alignment: 'right'
        },

        // {
        //   canvas: [{ type: 'line', x1: 105, y1: 0, x2: 0, y2: 0, lineWidth: 1 }],
        //   margin: [100, 0, -150, 0],
        // },
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
          alignment: 'left',
        },
        textSize: {
          fontSize: 10,
        },
        textSize1: {
          fontSize: 10,
          alignment: 'right',
          margin: [0, 0, 200, 0]
        },
        textSize2: {
          fontSize: 15,
          bold: 'true',
          alignment: 'left',
          margin: [100, 0, 0, 0]
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
      <span onClick={GetPdf}><Icon.Printer /></span>
    </>
  );
};


export default PdfQuotation;
