import React, { useEffect, useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import * as Icon from 'react-feather';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import ProductEditButtons from '../../components/Product/ProductEditButtons';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';

const ProductUpdate = () => {
  // All state variables

  const [productDetails, setProductDetails] = useState();
  const [categoryLinked, setCategoryLinked] = useState([]);
  const [description, setDescription] = useState('');
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  const [pictureData, setDataForPicture] = useState({
    modelType: '',
  });
const [update, setUpdate] = useState(false);
// const [updatepic, setUpdatePic] = useState(false);
  // Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();

  //Setting data in productDetails
  const handleInputs = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };
  //setting data in Description Modal productDetails
  const handleDataEditor = (e, type) => {
    setProductDetails({
      ...productDetails,
      [type]: draftToHtml(convertToRaw(e.getCurrentContent())),
    });
  };
  //Description Modal
  const convertHtmlToDraft = (existingQuoteformal) => {
    const contentBlock = htmlToDraft(existingQuoteformal && existingQuoteformal);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setDescription(editorState);
    }
  };
  // Get Product data By product id
  const getProductById = () => {
    api
      .post('/product/getProduct', { product_id: id })
      .then((res) => {
        setProductDetails(res.data.data[0]);
        convertHtmlToDraft(res.data.data[0].description);
      })
      .catch(() => {
        message('Product Data Not Found', 'info');
      });
  };
  //Edit Product
  const editProductData = () => {
    if (productDetails.title !== '') {
      productDetails.modification_date = creationdatetime;
      api
        .post('/product/edit-Product', productDetails)
        .then(() => {
          message('Record edited successfully', 'success');
        })

        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  // getting data from Category
  const getCategory = () => {
    api
      .get('/product/getCategory')
      .then((res) => {
        setCategoryLinked(res.data.data);
      })
      .catch(() => {
        message('Unable to get categories', 'error');
      });
  };

  //Attachments
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };
  //Pictures
  const dataForPicture = () => {
    setDataForPicture({
      modelType: 'picture',
    });
  };
  //useEffect
  useEffect(() => {
    getCategory();
    getProductById();
  }, [id]);

  return (
    <>
      <BreadCrumbs heading={productDetails && productDetails.title} />
      <Form>
        <FormGroup>
          <ProductEditButtons id={id} editProductData={editProductData} navigate={navigate} />
          {/* Content Details Form */}
          <ComponentCard title="Product Details" creationModificationDate={productDetails}>
            <ToastContainer></ToastContainer>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label> Item code </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.item_code}
                    name="item_code"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Product Name <span className="required"> *</span> </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.title}
                    name="title"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* Category title from Category table */}
                  <Label>Category</Label>
                  <Input
                    type="select"
                    name="category_id"
                    value={productDetails && productDetails.category_id}
                    onChange={handleInputs}
                  >
                    <option defaultValue="selected">Please Select</option>
                    {categoryLinked &&
                      categoryLinked.map((ele) => {
                        return (
                          <option key={ele.category_id} value={ele.category_id}>
                            {ele.category_title}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Type</Label>
                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={productDetails && productDetails.product_type}
                    name="product_type"
                  >
                    <option defaultValue="selected"> Please Select </option>
                    <option value="materials">Materials</option>
                    <option value="tools">Tools</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label> Quantity in Stock </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.qty_in_stock}
                    name="qty_in_stock"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> List Price </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.price}
                    name="price"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Unit </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.unit}
                    name="unit"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Short Description </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.description_short}
                    name="description_short"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <Label>Published</Label>
                <FormGroup>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="published"
                    value="1"
                    type="radio"
                    defaultChecked={productDetails && productDetails.published === 1 && true}
                    onChange={handleInputs}
                  />
                  &nbsp; &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="published"
                    value="0"
                    type="radio"
                    defaultChecked={productDetails && productDetails.published === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
          {/* Product Details Form */}
          <ComponentCard title="Product details">
            <Row>
              {/* Description form */}
              <ComponentCard title="Description">
                <Editor
                  editorState={description}
                  wrapperClassName="demo-wrapper mb-0"
                  editorClassName="demo-editor border mb-4 edi-height"
                  onEditorStateChange={(e) => {
                    handleDataEditor(e, 'description');
                    setDescription(e);
                  }}
                />
              </ComponentCard>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>

      {/* Picture and Attachments Form */}

      <Form>
              <FormGroup>
              <ComponentCard title="Picture">
                  <Row>
                    <Col xs="12" md="3" className="mb-3">
                      <Button
                        className="shadow-none"
                        color="primary"
                        onClick={() => {
                          setRoomName('ProductPic');
                          setFileTypes(['JPG','JPEG', 'PNG', 'GIF']);
                          dataForPicture();
                          setAttachmentModal(true);
                        }}
                      >
                        <Icon.File className="rounded-circle" width="20" />
                      </Button>
                    </Col>
                  </Row>
                  <AttachmentModalV2
                    moduleId={id}
                    attachmentModal={attachmentModal}
                    setAttachmentModal={setAttachmentModal}
                    roomName={RoomName}
                    fileTypes={fileTypes}
                    altTagData="Product Data"
                    desc="Product Data"
                    recordType="Picture"
                    mediaType={pictureData.modelType}
                    update={update}
                    setUpdate={setUpdate}
                  />
                  <ViewFileComponentV2 moduleId={id} roomName="ProductPic" recordType="Picture" update={update}
                    setUpdate={setUpdate}/>
                    </ComponentCard>
              </FormGroup>
            </Form>
      
      <Form>
              <FormGroup>
              <ComponentCard title="Attachments">
                  <Row>
                    <Col xs="12" md="3" className="mb-3">
                      <Button
                        className="shadow-none"
                        color="primary"
                        onClick={() => {
                          setRoomName('Product');
                          setFileTypes(['JPG','JPEG', 'PNG', 'GIF', 'PDF']);
                          dataForAttachment();
                          setAttachmentModal(true);
                        }}
                      >
                        <Icon.File className="rounded-circle" width="20" />
                      </Button>
                    </Col>
                  </Row>
                  <AttachmentModalV2
                    moduleId={id}
                    attachmentModal={attachmentModal}
                    setAttachmentModal={setAttachmentModal}
                    roomName={RoomName}
                    fileTypes={fileTypes}
                    altTagData="ProductRelated Data"
                    desc="ProductRelated Data"
                    recordType="RelatedPicture"
                    mediaType={attachmentData.modelType}
                    update={update}
                    setUpdate={setUpdate}
                  />
                  <ViewFileComponentV2 moduleId={id} roomName="Product" recordType="RelatedPicture" update={update}
                    setUpdate={setUpdate}/>
                    </ComponentCard>
              </FormGroup>
            </Form>
      <br />
    </>
  );
};
export default ProductUpdate;
