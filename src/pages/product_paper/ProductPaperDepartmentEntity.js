import React, { useState, useEffect } from "react";
import Dashboard from "../../hoc/Dashboard";
import {
  SummaryBox,
  BoxShadow,
  Header,
  Label,
  Input,
  Button,
  Select,
  TextArea,
  Hr,
} from "../../custom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";

import App from "../../services";
import { urls } from "../../services/urls";
import RenderEntityItem from "../../components/RenderEntityGroupRow";


function ProductPaperDepartmentEntity({ startLoading }) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [alert, setAlert] = useState(false);
  const [searchString, setSearchString] = useState("");
  //const [businessGroup, setBusinessGroup] = useState("");

  useEffect(() => {
    getEntity();
  }, []);
  
  const getEntity = async () => {
    try {
      
      startLoading(true);

      
      await App.postRequest(urls.getEntity("DEPARTMENT")).then(result => {
        
        if (result) {
          setItems(result.Result);
        }
      });
      
      
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
    }
  };

  const deleteItem = async (e) => {
    try {
      e.preventDefault();
      //startLoading(true);

      startLoading(true);
      
      await App.postRequest(urls.deleteEntity(selectedItem.Id, "DEPARTMENT"));
      getEntity();
      
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
      closeAlert();
    }
  }

  const closeAlert = () => {
    setSelectedItem(undefined);
    setAlert(false);
  }
  
  return (
    <Dashboard>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <SummaryBox
              className=""
              style={{ maxHeight: "75vh", height: "75vh", overflowX: "hidden" }}
            >
              <div className="row h-100">
                <div className="col-md-1 h-100">
                </div>
                <div
                  className="col-md-11 pr-5"
                  style={{ height: "100%", overflowY: "scroll" }}
                >
                  <div className="px-1 py-2">
                    <Header className="mb-2">Departments</Header>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      {/* <Label>Business Group Entity</Label>
                      <Input
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        placeholder="Search for product"
                        type="text"
                      /> */}
                    </div>
                    <div className="col-md-6 pt-4"></div>
                  </div>
                  <div>
                    <table className="logs-table" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Description</th>
                          <th></th>
                        </tr>
                      </thead>
                      {
                        items.map(item => {
                          return (
                            <RenderEntityItem 
                            item={item}
                            onDelete={() => {
                              setSelectedItem(item);
                              setAlert(true);
                            }} 
                            />
                          );
                        })
                      }
                    </table>
                  </div>
                </div>
              </div>
            </SummaryBox>
            <div>
            {alert && (
              <div className="alert-box">
                <div className="alert-box-wrap shadow bg-white">
                  <span className="close-alert" onClick={closeAlert}>
                    &times;
                  </span>
                  <p className="text-center pt-4">
                    Please confirm, would you like to proceed with this delete?
                    <div className="mt-5">
                      <Button onClick={(e) => deleteItem(e)}>Proceed</Button>
                      <Button className="" onClick={closeAlert}>Cancel</Button>
                    </div>
                    
                  </p>
                </div>
                
                
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(ProductPaperDepartmentEntity);
