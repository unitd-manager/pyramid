import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';

const ProductDetails = () => {
  //All const variables
  const [itemcode, setItemcode] = useState();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({
    title: '',
    item_code: '',
    site_id: 0,
  });
  //setting data in ProductDetails
  const handleInputs = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };
  //getting maximum of itemcode
  const getMaxItemcode = () => {
    api.get('/product/getMaxItemCode').then((res) => {
      setItemcode(res.data.data[0].itemc);
    });
  };
  //Insert Product Data
  const insertProductData = () => {
    productDetails.item_code = parseFloat(itemcode) + 1;
    if (productDetails.title !== '' && productDetails.item_code !== '') {
      productDetails.creation_date = creationdatetime;
      api
        .post('/product/insertProduct', productDetails)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Product inserted successfully.', 'success');
          api
            .post('/inventory/insertinventory', { product_id: insertedDataId })
            .then(() => {
              message('inventory created successfully.', 'success');
            })
            .catch(() => {
              message('Unable to create inventory.', 'error');
            });
          setTimeout(() => {
            navigate(`/ProductEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'warning');
    }
  };
  //useeffect
  useEffect(() => {
    getMaxItemcode();
  }, []);

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Row>
        <Col md="6">
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <Label>Product Name <span className="required"> *</span> </Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={ProductDetails && ProductDetails.title}
                      name="title"
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        insertProductData();
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/Product');
                      }}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
                      Go to List
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};
export default ProductDetails;
