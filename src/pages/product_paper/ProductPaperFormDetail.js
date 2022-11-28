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
import { getParam, appConstants } from "../../services/helpers";
import moment from "moment";
import DatePicker from 'react-date-picker';

function ProductPaperDetail({ startLoading }) {
  const [staffId, setStaffId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productLaunchDate, setProductLaunchDate] = useState("");
  const [digitalChannel, setDigitalChannel] = useState("");
  const [productExpiry, setProductExpiry] = useState("");
  const [productNextExpiry, setProductNextExpiry] = useState("");
  const [overdueAnalysis, setOverdueAnalysis] = useState("");
  const [operationalStatus, setOperationalStatus] = useState("");
  const [productManager, setProductManager] = useState("");
  const [productManagerSupervisor, setProductManagerSupervisor] = useState("");
  const [processOwner, setProcessOwner] = useState("");
  const [productPaperFile, attachProductFile] = useState(undefined);
  const [deffered, setDeffered] = useState("defferedNo");
  const [productId, setProductId] = useState("");

  

  const [directorate, setDirectorate] = useState("");
  const [businessGroup, setBusinessGroup] = useState("");
  const [department, setDepartment] = useState("");

  const [directorates, setDirectorates] = useState([]);
  const [businessGroups, setBusinessGroups] = useState([]);
  const [departments, setDepartments] = useState([]);
  //const [businessGroup, setBusinessGroup] = useState("");

  useEffect(() => {
    getForm();
    
    App.postRequest(urls.getEntity("DIRECTORATE"), new FormData()).then((result) => {
      if (result && result.Status) {
        setDirectorates(result.Result);
      }
    });
    App.postRequest(urls.getEntity("BUSINESS GROUP"), new FormData()).then((result) => {
      console.log("result", result);
      if (result && result.Status) {
        setBusinessGroups(result.Result);
        
      }
    });
    App.postRequest(urls.getEntity("DEPARTMENT"), new FormData()).then((result) => {
      if (result && result.Status) {
        setDepartments(result.Result);
      }
    });
    
  }, []);
  
  const saveForm = async (e) => {
    try {
      e.preventDefault();
      //startLoading(true);

      if (!productPaperFile) {
        App.showNotifiction("error", "Please attach a file");
        return;
      }

      startLoading(true);
      var form = new FormData();

      
      form.append("Id", productId);
      form.append("DepartmentId", department);
      form.append("BusinessGroupId", businessGroup);
      form.append("DirectorateId", directorate);
      form.append("DigitalChannel", digitalChannel);
      form.append("IsDeferred", deffered.replace("deffered","").toLowerCase() == "yes");
      form.append("NextRenewalExpiryDate", moment(productExpiry).add(1, "year").format("yyyy-MM-DD"));
      form.append("OperationalStatus", operationalStatus);
      form.append("OverdueAnalysisInDays", overdueAnalysis);
      form.append("ProcessOwnerEmail", processOwner);
      form.append("ProductDescription", productDescription);
      form.append("ProductExpiryDate", productExpiry);
      form.append("ProductLaunchDate", productLaunchDate);
      form.append("ProductManagerEmail", productManager);
      form.append("ProductManagerSupervisorEmail", productManagerSupervisor);
      form.append("ProductPaperName", productName);
      form.append("fileName", productPaperFile);

      form.append("AttachedProductPaper", true);
      
      await App.postRequestFile(urls.updateProduct, form).then(result => {
        if (result == "File Name Already Exist") {
          App.showNotifiction("success", result);
        }
        else {
         App.showNotifiction("success", result); 
        }
        
        // if (result == null) {
        //   App.showNotifiction("error", "An error occured. Please try again.");
        // }
        // else {
        //   App.showNotifiction("success", "Action successful.");
        // }
      });
      
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
    }
  };


  const getForm = async () => {
    try {
      //startLoading(true);

      startLoading(true);
      let productId = getParam("productId");
      
      if (!productId) {
        window.location.href = "/form/search";
      }
      
      let product = await App.getRequest(urls.getProduct + productId);

      if (!product) {
        App.showNotifiction("error", "Product  not found");
        setTimeout(() => {
          window.location.href = "/form/search";
        }, 1500);
        return;
      }
      product = product.Result;

      setProductId(productId);
      
      
      const defferedValue = (product.IsDeferred ? "defferedNo": "defferedYes");
      setDepartment(product.DepartmentId);
      setBusinessGroup(product.BusinessGroupId);
      setDirectorate(product.DirectorateId);
      setDigitalChannel(product.DigitalChannel);
      setDeffered(defferedValue);
      setProductNextExpiry(product.NextRenewalExpiryDate);
      setOperationalStatus(product.OperationalStatus);
      setOverdueAnalysis(product.OverdueAnalysisInDays ?? "");
      setProcessOwner(product.ProcessOwnerEmail);
      setProductDescription(product.ProductDescription);
      setProductExpiry(product.ProductExpiryDate);
      setProductLaunchDate(product.ProductLaunchDate);
      setProductManager(product.ProductManagerEmail);
      setProductManagerSupervisor(product.ProductManagerSupervisorEmail);
      setProductName(product.ProductPaperName);

      //activate operational and deffered
      onOperationalStatusChange(product.OperationalStatus);
      onDefferedStatusChange(defferedValue);
      
      setTimeout(() => {
        //disabled all form items
        disableFormElements(true);
      }, 1000);

      //form.append("AttachedProductPaper", true);
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
    }
  };

  const disableFormElements = (status) => {
    const _form = document.getElementById("product-form");
      
    for(let i = 0; i < _form.length; i++) {
      
      try {
        let currentElement = _form[i];
        if (status) {
          currentElement.setAttribute("disabled", status);
        }
        else {
          currentElement.removeAttribute("disabled");
        }
        
      }
      catch{}
    }
  }


  const onOperationalStatusChange = (e) => {
    
    let elements = document.getElementsByClassName("operationalStatus");
    for(let i = 0; i < elements.length; i++) {
      let currentElement = elements[i];
      currentElement.checked = (currentElement.getAttribute("id") == e);
    }
    
    setOperationalStatus(e);
  }

  const onDefferedStatusChange = (e) => {
    let elements = document.getElementsByClassName("defferedStatus");
    for(let i = 0; i < elements.length; i++) {
      let currentElement = elements[i];
      currentElement.checked = (currentElement.getAttribute("id") == e);
    }
    
    setDeffered(e);
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
                    <Header className="mb-2">New Product Paper</Header>
                  </div>
                  <form id={"product-form"}>
                    <div className="row">
                      <RenderDropDown 
                          disabled={department == ""}
                          selected={directorate}
                          label={"Directorate"} 
                          options={directorates.map(_directorate => {
                            return {label: _directorate.Name, value: _directorate.Id};
                          })} 
                          onChange={(e) => setDirectorate(e.target.value)}
                        />
                      <RenderDropDown 
                          disabled={directorate == ""}
                          selected={businessGroup}
                          label={"Business Group"} 
                          options={businessGroups.map(_businessGroup => {
                            if (businessGroup.DirectorateId == directorate) {
                              return {label: _businessGroup.Name, value: _businessGroup.Id};
                            }
                          })}
                          onChange={(e) => setBusinessGroup(e.target.value)}
                        />
                                            
                    </div>
                    <div className="row">
                      <RenderDropDown 
                        selected={department}
                        label={"Department"} 
                        options={departments.map(_department => {
                          if (_department.BusinessGroupId == businessGroup) {
                            return {label: _department.Name, value: _department.Id};
                          }
                        })}
                        onChange={(e) => setDepartment(e.target.value)}
                      />
                      
                      <div className="col-md-6">
                        <Label>Product Paper Name</Label>
                        <Input
                          value={productName}
                          onChange={(e) => {
                            if (e.target.value.length < 501) {
                              setProductDescription(e.target.value)
                            }
                            //setProductName(e.target.value)
                          }}
                          placeholder="Product Name"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Label>Product Description</Label>
                        <TextArea  
                          value={productDescription}
                          rows={5}
                          onChange={(e) => setProductDescription(e.target.value)}
                          placeholder="Product Description"
                          maxLength={500}
                      >{productDescription}</TextArea>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Label>Product Launch Date</Label>
                        <div className={"clearfix"}> </div>
                        <DatePicker 
                          value={productLaunchDate}
                          format="dd-MM-yyyy" 
                          maxDate={new Date()} 
                          onChange={(e) => {
                            setProductLaunchDate(e);
                          }}
                        />
                        {/* <Input
                          value={productLaunchDate}
                          onChange={(e) => setProductLaunchDate(e.target.value)}
                          placeholder=""
                          type="date"
                        /> */}
                      </div>
                      <div className="col-md-6">
                        <Label>Digital Channel (s)</Label>
                        <Input
                          value={digitalChannel}
                          onChange={(e) => setDigitalChannel(e.target.value)}
                          placeholder="Digital Channel(s)"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Label>Product Approval Date</Label>
                        <div className={"clearfix"}> </div>
                        <DatePicker 
                          value={productExpiry}
                          format="dd-MM-yyyy" 
                          // minDate={new Date()} 
                          maxDate={new Date()} 
                          onChange={(e) => {
                            setProductExpiry(e);
                          }}
                        />
                        {/* <Input
                          value={productExpiry}
                          onChange={(e) => setProductExpiry(e.target.value)}
                          placeholder=""
                          type="date"
                        /> */}
                      </div>
                      <div className="col-md-6">
                        <Label>Next Renewal (Expiry) Date</Label>
                        <div className={"clearfix"}> </div>
                        <DatePicker 
                          value={productNextExpiry}
                          format="dd-MM-yyyy" 
                          disabled={true}
                        />
                        {/* <Input
                          value={productNextExpiry}
                          onChange={(e) => setProductNextExpiry(e.target.value)}
                          placeholder=""
                          type="date"
                        /> */}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Label>Overdue Analysis (Days)</Label>
                        <Input
                          value={(overdueAnalysis > 0) ? overdueAnalysis : ""}
                          onChange={(e) => setOverdueAnalysis(e.target.value)}
                          placeholder=""
                          type="text"
                        />
                      </div>
                      <div className="col-md-6">
                        {
                          App.getUserRole() == appConstants.teamLead[0] &&
                          <>
                          <Label>Operational Status</Label>
                          <div className="row">
                            <Checkbox 
                              checkboxId={"Closed"}
                              checkboxClass={"operationalStatus"}
                              label={"Closed"} 
                              handleCheckboxChange={(e) => {
                                onOperationalStatusChange("Closed");
                              }} 
                            />
                            <Checkbox 
                              checkboxId={"Open"}
                              checkboxClass={"operationalStatus"}
                              label={"Open"} 
                              handleCheckboxChange={(e) => {
                                onOperationalStatusChange("Open");
                              }} 
                            />
                            {/* <Checkbox 
                              checkboxId={"Renewed"}
                              checkboxClass={"operationalStatus"}
                              label={"Renewed"} 
                              handleCheckboxChange={(e) => {
                                onOperationalStatusChange("Renewed");
                              }} 
                            /> */}
                          </div>
                          </>
                        }
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Label>Product Manager</Label>
                        <Input
                          value={productManager}
                          onChange={(e) => setProductManager(e.target.value)}
                          placeholder=""
                          type="email"
                        />
                      </div>
                      <div className="col-md-6">
                        <Label>Process Owner</Label>
                        <Input
                          value={processOwner}
                          onChange={(e) => setProcessOwner(e.target.value)}
                          placeholder=""
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Label>Deffered</Label>
                        <div className="row">
                          <Checkbox 
                            label={"Yes"} 
                            checkboxId="defferedYes"
                            checkboxClass={"defferedStatus"}
                            handleCheckboxChange={(e) => {
                              onDefferedStatusChange("defferedYes");
                            }} 
                          />
                          <Checkbox 
                            label={"No"} 
                            checkboxId="defferedNo"
                            checkboxClass={"defferedStatus"}
                            handleCheckboxChange={(e) => {
                              onDefferedStatusChange("defferedNo");
                            }} 
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <Label>Product Manager Supervisor</Label>
                        <Input
                          value={productManagerSupervisor}
                          onChange={(e) => setProductManagerSupervisor(e.target.value)}
                          placeholder="Product Manager Supervisor"
                          type="input"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Label>Attach Product Paper</Label>
                        <Input
                          accept={".pdf,.docx,.doc"}
                          onChange={(e) => {
                            
                            let _file = e.target.files[0];

                            if (_file && (!_file.name.endsWith(".pdf") && !_file.name.endsWith(".docx") && !_file.name.endsWith(".doc"))) {
                              App.showNotifiction("error", "Please upload a WORD/PDF file.");
                              return;
                            }
                            attachProductFile(_file);
                          }}
                          placeholder=""
                          type="file"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <Button 
                        onClick={saveForm} 
                        style={{ maxWidth: 170, cursor: (!isEdit? "not-allowed": "pointer") }}
                        className="mr-2"
                      >
                        Update
                      </Button>
                      {
                        (operationalStatus.toLowerCase() == "open") 
                        ?
                          (!isEdit) &&
                          <a href="#" onClick={() => {
                            disableFormElements(false);
                            setIsEdit(!isEdit);
                          }}>Edit Product</a>
                        :
                          App.getUserRole() == appConstants.teamLead[0] && (!isEdit) &&
                          <a href="#" onClick={() => {
                            disableFormElements(false);
                            setIsEdit(!isEdit);
                          }}>Edit Product</a>
                      }
                    </div>
                  </form>
                </div>
              </div>
            </SummaryBox>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default connect(null, actions)(ProductPaperDetail);
