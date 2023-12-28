/* eslint-disable */
import React from 'react';
import { Row, Col, Form, FormGroup, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { HasAccess ,usePermify} from '@permify/react-role';
import ComponentCardV2 from './ComponentCardV2';

const ApiButton = ({ editData, navigate, backToList, module,deleteData, setFormSubmitted, tenderDetails }) => {
  ApiButton.propTypes = {
    editData: PropTypes.func,
    navigate: PropTypes.any,
    //applyChanges: PropTypes.func,
    backToList: PropTypes.func,
    deleteData: PropTypes.any,
    module: PropTypes.string,
    setFormSubmitted: PropTypes.any,
    tenderDetails: PropTypes.any,
  };
  const { isAuthorized, isLoading } = usePermify();

  const fetchData = async (type) => {
    // Pass roles and permissions accordingly
    // You can send empty array or null for first param to check permissions only
    if (await isAuthorized(null, `${module}-${type}`)) {
       return true
    }else{
      return false
    }
};

const handleSave = () => {
  // Validate Title
  const trimmedCompanyName = tenderDetails?.title?.trim();
  if (!trimmedCompanyName) {
    // If validation fails, show an error message or take appropriate action
    console.error('Company name cannot be empty. Current value:', trimmedCompanyName);
    // You can also show an error message to the user using a toast or other UI element
    return;
  }

  // If validation passes, proceed with setting formSubmitted to true
  setFormSubmitted(true);
  editData();
  backToList();
};

  return (
    <Form>
    <FormGroup>
      <ComponentCardV2>
          <Row>
            <Col >
         
              {/* <HasAccess
                roles={null}
                permissions={`${module}-edit`}
                renderAuthFailed={<p></p>}
        > */}
                <Button
                  onClick={() => {
                    handleSave()
                    setFormSubmitted(true);
                      // setTimeout(()=>{
                      //   backToList();
                      // },1000)
                    
                  }}
                  color="primary">
                  Save
                </Button>
              {/* </HasAccess> */}
            </Col>
            <Col >
              {/* <HasAccess
                roles={null}
                permissions={`${module}-edit`}
                renderAuthFailed={<p></p>}
              > */}
                <Button
                  onClick={() => {
                    setFormSubmitted(true);
                    editData();
                    //applyChanges();
                  }}
                  color="primary"
                >
                  Apply
                </Button>
              {/* </HasAccess> */}
            </Col>
            <Col>
              <Button
                onClick={() => {
                  backToList();
                }}
                color="dark"
              >
                Back To List
              </Button>
            </Col>
            <Col>
              {/* <HasAccess
                roles={null}
                permissions={`${module}-remove`}
                renderAuthFailed={<p></p>}
              > */}
                <Button color="danger" onClick={() => {deleteData();
                //  setTimeout(()=>{
                //   //backToList();
                // },1000)
                }}>
                  Delete
                </Button>
              {/* </HasAccess> */}
            </Col>
          </Row>
        </ComponentCardV2>
      </FormGroup>
    </Form>
  );
};

export default ApiButton;
