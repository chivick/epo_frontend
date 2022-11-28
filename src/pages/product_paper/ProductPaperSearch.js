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
import { downloadFile, base64ToArrayBuffer, saveByteArray } from "../../services/helpers";
import RenderProductTableRow from "../../components/RenderProductTableRow";
import moment from "moment";


function ProductPaperSearch({ startLoading }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(undefined);
  const [alert, setAlert] = useState(false);
  const [searchString, setSearchString] = useState("");
  //const [businessGroup, setBusinessGroup] = useState("");

  let isClicked = false;
  
  useEffect(() => {
    renderReport();

    // Date range effect
    window.$('input[name="daterange"]').daterangepicker(
      {
        opens: "right",
        startDate: moment().subtract(29, "days"),
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, "days"),
            moment().subtract(1, "days"),
          ],
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
        },
      },
      function (start, end, label) {
        console.log(
          "A new date selection was made: " +
            start.format("YYYY-MM-DD") +
            " to " +
            end.format("YYYY-MM-DD")
        );
      }
    );
    
    window.$("#example tbody").on("click", "button", function () {
      // var data = table.row( $(this).parents('tr') ).data();
      //window.alert(searchString);
      
      const id = window.$(this).attr("data-id");
      const dataType = window.$(this).attr("data-type");
      if (dataType === 'download') {
        const product = products.filter(x => x.Id == id);
        //console.log("product", products, product, id);
        
        if (product.length == 0) return;
        isClicked = true;
        const _file = product[0].AttachedProductPaper;
        
        //_file = _file[0];
        // convert base64 to bytes
        const fileName = _file.split(":")[0];

        var sampleArr = base64ToArrayBuffer(_file.split(":")[1]);
        saveByteArray(fileName, sampleArr);
        setTimeout(() => {
          isClicked = false;
        }, 1000);
      }
      else if (dataType === 'delete') {
        deleteProductRegister(id)
        findProduct()
      }
      else {
        window.location.href = "/form/detail?productId=" + id;
      }
      
    });
  }, [products]);
  
  
  const deleteProductRegister = async (id) => {
    try {
      startLoading(true);
      
      await App.deleteProductRegister(id)
      
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
    }
  }

    const findProduct = async (e) => {
    try {
      if (e) e.preventDefault();
      //startLoading(true);

      startLoading(true);
      
      await App.getRequest(urls.findProduct(searchString)).then(result => {
        if (result) {
          // console.log(result);
          setProducts(result.Result);
          // renderReport();
        }
      });
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
    }
  };

  // Finding products by date range
  const findProductsByDate = async (e) => {

    try {
      if (e) e.preventDefault();

      const dateSelected = window.$("#daterange").val();

      if (dateSelected.trim() === "")
        return App.showNotifiction("info", "Please choose a daterange");
      //startLoading(true);

      startLoading(true);
      
      await App.getProductPapersByDate(dateSelected.split("-")[0], dateSelected.split("-")[1]).then(result => {
        if (result) {
          // console.log(result);
          if (!result.Data) {
            setProducts([])
          } else {
            if (result.Data.length > 0) {
              setProducts(result.Data);
            }
          }
          
          // renderReport();
        }
      });
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
    }
  };

  const exportSearch = async (e) => {
    try {
      e.preventDefault();
      startLoading(true);
      
      await App.getRequestExcelData(urls.generatefindProductExcel(searchString), "product_paper_export_" + moment().format("yyyy_MM_dd_hh_mm_ss")).then(result => {
      });
    }
    catch(error)  {
      App.logError(error);
    }
    finally {
      startLoading(false);
    }
  }

  const deleteProduct = async (e) => {
    try {
      e.preventDefault();
      //startLoading(true);

      startLoading(true);
      
      await App.postRequest(urls.deleteEntity(selectedProduct.Id, selectedProduct.Name));
      
      
    } catch (error) {
      App.logError(error);
    }
    finally{
      startLoading(false);
    }
  }

  const closeAlert = () => {
    setSelectedProduct(undefined);
    setAlert(false);
  }


  const renderReport = () => {
    
    window.$("#example").DataTable({
      data: products,
      
      "aaSorting": [],
      columns: [
        {
          title: "Product Paper Name",
          render: (data, type, row, meta) => {
            
            if (type === "display") {
              return row.ProductPaperName  ;
            }
            return row.ProductPaperName ;
          },
          responsivePriority: 1000,
        },
        {
          title: "Digital Channel",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.DigitalChannel;
            }
            return row.DigitalChannel;
          },
          responsivePriority: 1000,
        },
        {
          title: "Product Launch Date",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.ProductLaunchDate;
            }
            return row.ProductLaunchDate;
          },
          responsivePriority: 2,
        },
        {
          title: "Product Approval Date",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.ProductExpiryDate;
            }
            return row.ProductExpiryDate;
          },
          responsivePriority: 5,
        },
        {
          title: "Renewal Date",
          render: (data, type, row, meta) => {
              
            if (row.OverdueAnalysisInDays > 0) {
              window.$(`tbody tr:nth-child(${(meta.row + 1)}) td:nth-child(5)`, data).css('background-color', 'red');
            }
            else {
              window.$(`tbody tr:nth-child(${(meta.row + 1)}) td:nth-child(5)`, data).css('background-color', 'green');
            }
            
            if (type === "display") {
              return row.NextRenewalExpiryDate;
            }
            return row.NextRenewalExpiryDate;
          },
          responsivePriority: 5,
        },
        {
          title: "Is Deferred",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.IsDeferred == true ? "Yes" : "No";
            }
            return row.IsDeferred == true ? "Yes" : "No";
          },
          responsivePriority: 5,
        },
        {
          title: "Operational Status",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.OperationalStatus;
            }
            return row.OperationalStatus;
          },
          responsivePriority: 5,
        },
        {
          title: "Process Owner",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.ProcessOwnerEmail;
            }
            return row.ProcessOwnerEmail;
          },
          responsivePriority: 5,
        },
        {
          title: "Product Manager Email",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.ProductManagerEmail;
            }
            return row.ProductManagerEmail;
          },
          responsivePriority: 5,
        },
        {
          title: "Product Manager Supervisor Email",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.ProductManagerSupervisorEmail;
            }
            return row.ProductManagerSupervisorEmail;
          },
          responsivePriority: 5,
        },
        {
          title: "Overdue Analysis In Days",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return row.OverdueAnalysisInDays > 0 ? row.OverdueAnalysisInDays : "";
            }
            return row.OverdueAnalysisInDays > 0 ? row.OverdueAnalysisInDays : "";
          },
          responsivePriority: 5,
        },
        
        {
          title: "View",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return `<button data-id=${row.Id} class='view-button'>View</button>`;
            }
            return `<button data-id=${row.Id} class='view-button'>View</button>`;
          },
          responsivePriority: 5,
        },
        {
          title: "Download",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return `<button data-type='download' data-id=${row.Id} class='view-button'>Download</button>`;
            }
            return `<button data-type='download' data-id=${row.Id} class='view-button'>Download</button>`;
          },
          responsivePriority: 5,
        },
        {
          title: "Delete",
          render: (data, type, row, meta) => {
            if (type === "display") {
              return `<button data-type='delete' data-id=${row.Id} class='view-button'>Delete</button>`;
            }
            return `<button data-type='delete' data-id=${row.Id} class='view-button'>Delete</button>`;
          },
          responsivePriority: 5,
        },
      ],
      dom: "Bfrtip",
      buttons: [
        "copy",
        "csv",
        "excel",
        {
          extend: "pdfHtml5",
          orientation: "landscape",
          pageSize: "LEGAL",
        },
        {
          extend: "print",
          orientation: "landscape",
          pageSize: "LEGAL",
        },
      ],
      responsive: true,
      bDestroy: true,
    });
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
                    <Header className="mb-2">Find a product paper</Header>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Label>Product Paper Name</Label>
                      <Input
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        placeholder="Search for product"
                        type="text"
                      />
                    </div>
                    <div className="col-md-6 pt-4">
                    <Button 
                      onClick={findProduct} 
                      style={{ maxWidth: 170, cursor: (searchString == "" ? "not-allowed" : "pointer") }} 
                      disabled={searchString == ""}

                    >
                      Find by name
                    </Button>
                    {
                      products?.length > 0 &&
                    
                      <Button 
                        className={"ml-2"}
                        onClick={exportSearch} 
                        style={{ maxWidth: 170, cursor: (searchString == "" ? "not-allowed" : "pointer") }} 
                        disabled={searchString == ""}

                      >
                        Export Search
                      </Button>
                      }
                    </div>
                  </div>

                  {/* Search by daterange */}
                  <div className='row'>
                    <div className="col-md-6">
                        <Label>Date Range</Label>
                        <Input type="text" id="daterange" name="daterange" />
                    </div>
                    <div className="col-md-6 pt-4">
                      <Button 
                        onClick={findProductsByDate} 
                        style={{ maxWidth: 170, /*cursor: (searchString == "" ? "not-allowed" : "pointer")*/ }} 
                        //disabled={searchString == ""}

                      >
                        Find by date
                      </Button>
                    </div>
                  </div>

                  <div>
                  <table
                          id="example"
                          className="table table-striped display responsive nowrap w-100 table-bordered"
                        ></table>
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
                  <p className="text-center">
                    Please note that by selecting No, you are accepting the claim and
                    you will be debited for the chargeback
                  </p>
                  <div className="row">
                    <Button className="ml-5" onClick={closeAlert}>Cancel</Button>
                    <Button onClick={(e) => deleteProduct(e)}>Proceed</Button>
                  </div>
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

export default connect(null, actions)(ProductPaperSearch);
