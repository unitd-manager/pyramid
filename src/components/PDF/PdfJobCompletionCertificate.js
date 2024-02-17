import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import moment from 'moment';
import api from '../../constants/api';
import PdfHeader from './PdfHeader';

const PdfProjectQuote = ({ id, quoteId }) => {
  PdfProjectQuote.propTypes = {
    id: PropTypes.any,
    quoteId: PropTypes.any,
  };
  const [hfdata, setHeaderFooterData] = React.useState();
  const [quote, setQuote] = React.useState([]);
  const [projectDetail, setProjectDetail] = useState();
  const [lineItem, setLineItem] = useState([]);
//   const [gTotal, setGtotal] = React.useState(0);
//   const [parsedQuoteCondition, setParsedQuoteCondition] = useState('');
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

  const getProjectById = () => {
    api
      .post('/project/getProjectAndJobOrderById', { project_id: id })
      .then((res) => {
        setProjectDetail(res.data.data[0]);
        console.log('projectdetails', res.data.data)
      })
      .catch(() => { });
  };

  // Get Quote By Id
  const getQuote = () => {
    api.post('/project/getTabQuoteById', { project_id: id }).then((res) => {
      setQuote(res.data.data[0]);
      console.log('quote2', res.data.data[0]);
    });
  };
//   const calculateTotal = () => {
//     const grandTotal = lineItem.reduce((acc, element) => acc + element.amount, 0);
//     const discount = quote.discount || 0; // Get the discount from the quote or default to 0 if not provided
//     const total = grandTotal - discount; // Deduct the discount from the grand total

//     return total;
//   };
  const getQuoteById = () => {
    api
      .post('/project/getJobLineItemsById', { job_order_id: quoteId })
      .then((res) => {
        setLineItem(res.data.data);
        // let grandTotal = 0;
        // res.data.data.forEach((elem) => {
        //   grandTotal += elem.amount;
        // });
        // setGtotal(grandTotal);
        console.log('quote1', res.data.data);
        //setViewLineModal(true);
      })
      .catch(() => { });
  };
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

  //The quote_condition content and format it as bullet points
//   const formatQuoteConditions = (conditionsText) => {
//     const formattedConditions = conditionsText.split(':-').map((condition, index) => {
//       const trimmedCondition = condition.trim();
//       return index === 0 ? `${trimmedCondition}` : `:- ${trimmedCondition}`;
//     });
//     return formattedConditions;
//   };

  // Format the conditions content for PDF
//   const conditions = formatQuoteConditions(parsedQuoteCondition);
  // const conditionsContent = conditions.map((condition) => ({
  //   text: `${condition}`,
  //   fontSize: 10,
  //   margin: [15, 5, 0, 0],
  //   style: ['notesText', 'textSize'],
  // }));
  // / Format the conditions content for PDF
//   const conditionsContent = conditions.map((condition) => ({
//     text: `${condition}`,
//     fontSize: 10,
//     margin: [15, 5, 0, 0],
//     style: ['notesText', 'textSize'],
//     lineHeight: 1.2,
//   }));


  React.useEffect(() => {
    getQuote();
    getQuoteById();
    getProjectById();
  }, []);

  const GetPdf = () => {
    const lineItemBody = [
      [
        {
          text: 'S.no',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Work Description',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Qty',
          style: 'tableHead',
          alignment: 'center'
        },
        {
          text: 'Unit',
          style: 'tableHead',
          alignment: 'right'
        },
      ],
    ];
    lineItem.forEach((element, index ) => {
      lineItemBody.push([
        {
            text: `${index + 1}`, // index + 1 for 1-based numbering
            border: [false, false, false, true],
            style: 'tableBody',
            alignment: 'center'
        },
        {
          text: `${element.description}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center'
        },
        {
          text: `${element.quantity}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center'
        },
        {
            text: `${element.unit}`,
            border: [false, false, false, true],
            style: 'tableBody',
            alignment: 'center'
          },
        
      ]);
    });
    

    const dd = {
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 120, 40, 80],
      pageSize: 'A4',
      content: [
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
            widths: ['105%', '51%'],

            body: [
              [
                {
                  text: 'JOB COMPLETION CERTIFICATE',
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',
        {
          table: {
            headerRows: 1,
            widths: ['70%', '30%'],
            body: [
              [
                {
                  text: `
                         Client             :     ${projectDetail.company_name ? projectDetail.company_name : ''}
                      \n Project           :    ${projectDetail.title ? projectDetail.title : ''}
                      \n Location       :      ${projectDetail.project_location ? projectDetail.project_location : ''}
                      \n Date              :      ${projectDetail.witness_by_date ? moment(projectDetail.witness_by_date).format('YYYY-MM-DD') : ''}`,
                  style: ['notesText', 'textSize'],
                  bold: false,
                  // border: [true, true, true, true],
                },
                {
                  text: `
                         JCC No              :  ${projectDetail.job_order_code ? projectDetail.job_order_code : ''}
                      \n PO Number        :  ${projectDetail.po_number ? projectDetail.po_number : ''}
                      \n Quote Number  :  ${quote.quote_code ? quote.quote_code : ''}
                      \n Date                  :      ${projectDetail.date ? moment(projectDetail.date).format('YYYY-MM-DD') : ''}`,
                  style: ['notesText', 'textSize'],
                  bold: false,
                  // border: [true, true, true, true],
                }
              ]
            ]
          },
        },
        // {
        //   text: `Client                     :     ${projectDetail.company_name ? projectDetail.company_name : ''}`,
        //   style: ['notesText', 'textSize'],
        //   bold: 'true',
        // },
        // '\n',
        
        // {
        //   text: `Project                   :    ${projectDetail.title ? projectDetail.title : ''}`,
        //   style: ['notesText', 'textSize'],
        //   bold: 'true',
        // },
        // '\n',
        // {
        //     text: `Location                :      ${projectDetail.project_location ? projectDetail.project_location : ''}`,
        //     style: ['notesText', 'textSize'],
        //     bold: 'true'
        //   },
  
        //   '\n',
        //   {
        //     text: `Scope of Work     :       ${projectDetail.scope_of_work ? projectDetail.scope_of_work : ''}`,
        //     style: ['notesText', 'textSize'],
        //     bold: 'true',
        //   },
          

        // {
        //   text: `JCC No       :  ${projectDetail.job_order_code ? projectDetail.job_order_code : ''}`,

        //   style: ['invoiceAdd', 'textSize'],
        //   margin: [0, -90, 0, 0],
        // },
        // '\n',  
        // {
        //   text: `PO Number     :  ${projectDetail.po_number ? projectDetail.po_number : ''
        //     }`,

        //   style: ['invoiceAdd', 'textSize'],

        // },
        // '\n',
        // {
        //   text: `Quote Number   :  ${quote.quote_code ? quote.quote_code : ''
        //     }`,

        //   style: ['invoiceAdd', 'textSize'],

        // }, '\n',
        // {
        //     text: `Date               :   ${(projectDetail.job_completion_date) ? moment(projectDetail.job_completion_date).format('DD-MM-YYYY') : ''} `,
        //     style: ['invoiceAdd', 'textSize'],
  
        //   },
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
            widths: [30, 270, 65, 65],

            body: lineItemBody,
          },
        },
        '\n',
        '\n',
        '\n',
// Content below the table
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
    widths: ['50%', '50%'],
    body: [
      [
        {
          text: `${findCompany("cp.companyName")}
              \n Name                     :     ${projectDetail.name ? projectDetail.name : ''}
              \n Designation           :    ${projectDetail.designation ? projectDetail.designation : ''}
              \n Signature               :      ${projectDetail.signature ? projectDetail.signature : ''}
              \n Date                        :      ${projectDetail.witness_by_date ? moment(projectDetail.witness_by_date).format('YYYY-MM-DD') : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'false',
          // border: [true, true, true, true],
        },
        {
          text: `Witness By 
              \n Name                     :     ${projectDetail.witness_by_name ? projectDetail.witness_by_name : ''}
              \n Designation           :    ${projectDetail.witness_by_designation ? projectDetail.witness_by_designation : ''}
              \n Signature               :      ${projectDetail.witness_by_signature ? projectDetail.witness_by_signature : ''}
              \n Date                        :      ${projectDetail.witness_by_date ? moment(projectDetail.witness_by_date).format('YYYY-MM-DD') : ''}`,
          style: ['notesText', 'textSize'],
          bold: 'false',
          // border: [true, true, true, true],
        }
      ]
    ]
  }

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
          alignment: 'center',
          fontSize: 10,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10.5,
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
      <span onClick={GetPdf}>
        <Icon.Printer />
      </span>
    </>
  );
};

export default PdfProjectQuote;
