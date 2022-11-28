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
import { RenderDropDown } from "../../components/dropdown.controller";
import Checkbox from "../../components/checkbox.component";
import { urls } from "../../services/urls";

function ProductPaperNewEntity({ startLoading }) {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  
  const [entityName, setEntityName] = useState("");
  const [entityDescription, setEntityDescription] = useState("n/a");
  const [entity, setEntity] = useState("");
  
  const [digitalChannel, setDigitalChannel] = useState("digitalChannel");
  const [productExpiry, setProductExpiry] = useState("2021-08-21");
  const [productNextExpiry, setProductNextExpiry] = useState("2021-08-28");
  const [overdueAnalysis, setOverdueAnalysis] = useState("overDueAnalysis");
  // const [operationalStatus, setOperationalStatus] = useState("Renewed");
  const [operationalStatus, setOperationalStatus] = useState("Closed");
  const [productManager, setProductManager] = useState("James");
  const [productManagerSupervisor, setProductManagerSupervisor] = useState("John");
  const [processOwner, setProcessOwner] = useState("John");
  const [productPaperFile, attachProductFile] = useState(undefined);
  const [deffered, setDeffered] = useState("defferedNo");

  

  const [directorate, setDirectorate] = useState("1");
  const [businessGroup, setBusinessGroup] = useState("1");
  const [department, setDepartment] = useState("1");
  const [fK, setFK] = useState("0");

  const [entities, setEntities] = useState([]);
  const [businessGroups, setBusinessGroups] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [directorates, setDirectorates] = useState([]);
  
  //const [businessGroup, setBusinessGroup] = useState("");

  useEffect(() => {
    App.getRequest(urls.getEntityNames).then((result) => {
      if (result) {
        setEntities(result.Result);
      }
    });
    App.postRequest(urls.getEntity("DIRECTORATE"), new FormData()).then((result) => {
      if (result && result.Status) {
        setDirectorates(result.Result);
      }
    });
    App.postRequest(urls.getEntity("DEPARTMENT"), new FormData()).then((result) => {
      if (result && result.Status) {
        setDepartments(result.Result);
      }
    });
    App.postRequest(urls.getEntity("BUSINESS GROUP"), new FormData()).then((result) => {
      console.log("result", result);
      if (result && result.Status) {
        setBusinessGroups(result.Result);
        
      }
    });
  }, []);
  
  const saveForm = async (e) => {
    try {
      e.preventDefault();
      //startLoading(true);

      if (!entity) {
        App.showNotifiction("error", "Please enter a name.");
        return;
      }
      if (!entityName) {
        App.showNotifiction("error", "Please select an entity name.");
        return;
      }

      startLoading(true);
      
      //await App.postRequest(urls.addEntity(entity,entityName,entityDescription, directorate)
      await App.postRequest(urls.addEntity(entity,entityName,entityDescription, fK), new FormData()).then(result => {
        if (result.Status) {
          App.showNotifiction("success", "Entity Saved.");
          setEntity("");
          setEntityDescription("");
          setFK("");
        }
        else {
          App.showNotifiction("error", result.Message || "An error occurred, please try again.");
        }
      });
      
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
    }
  };


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
                    <Header className="mb-2">New Product Entity</Header>
                  </div>
                  <div className="row">
                    <RenderDropDown 
                      className="col-md-4"
                      label={"Select Entity"} 
                      options={entities && entities.map(_entity => {
                        return {label: _entity, value: _entity};
                      })} 
                      onChange={(e) => setEntityName(e.target.value)}
                    />
                    {
                      entityName == "DEPARTMENT" &&
                      <>
                        <RenderDropDown 
                          className="col-md-4"
                          selected={businessGroup}
                          label={"Business Group"} 
                          options={businessGroups.map(_businessGroup => {
                            return {label: _businessGroup.Name, value: _businessGroup.Id};
                          })}
                          //onChange={(e) => setBusinessGroup(e.target.value)}
                          onChange={(e) => {
                            setFK(e.target.value);
                            setBusinessGroup(e.target.value);
                          }}
                        />
                      </>
                    }
                    {
                      entityName == "BUSINESS GROUP" &&
                      <>
                        <RenderDropDown 
                          className="col-md-4"
                          selected={directorate}
                          label={"Directorate"} 
                          options={directorates.map(_directorate => {
                            return {label: _directorate.Name, value: _directorate.Id};
                          })} 
                          //onChange={(e) => setDirectorate(e.target.value)}
                          onChange={(e) => {
                            setFK(e.target.value);
                            setDirectorate(e.target.value);
                          }}
                          
                        />
                      </>
                    }
                    <div className="col-md-4">
                      <Label>Entity Name</Label>
                      <Input
                        value={entity}
                        onChange={(e) => setEntity(e.target.value)}
                        placeholder="Name"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Label>Entity Description</Label>
                      <TextArea  
                        value={entityDescription}
                        rows={5}
                        onChange={(e) => setEntityDescription(e.target.value)}
                        placeholder="Product Description"
                      />
                    </div>
                    {/* {
                      entityName == "DIRECTORATE" &&
                      <div className="col-md-6">
                        <RenderDropDown 
                          label={"Department"} 
                          options={departments.map(_department => {
                            return {label: _department.Name, value: _department.Id};
                          })}
                          onChange={(e) => setDirectorate(e.target.value)}
                        />
                        
                      </div>
                    } */}
                    {/* {
                      entityName == "BUSINESS GROUP" &&
                      <div className="col-md-6">
                        {/* <RenderDropDown 
                          label={"Business Group"} 
                          options={businessGroups.map(_businessGroup => {
                            return {label: _businessGroup.Name, value: _businessGroup.Id};
                          })}
                          onChange={(e) => {
                            setDirectorate(e.target.value);
                          }}
                        /> */}
                        {/* <RenderDropDown 
                          label={"Directorate"} 
                          options={directorates.map(_directorate => {
                            return {label: _directorate.Name, value: _directorate.Id};
                          })} 
                          onChange={(e) => {
                            setDirectorate(e.target.value);
                          }}
                        />
                      </div>
                    } */}
                  </div>

                  <div className="col-md-6">
                    <Button 
                      onClick={saveForm} 
                      disabled={(entity == "") ? true: false}
                      
                      style={{ maxWidth: 170, cursor: (entity == "") ? "not-allowed": "pointer" }} disabled={entity == ""}
                    >
                      Save Entity
                    </Button>
                  </div>
                </div>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(ProductPaperNewEntity);
