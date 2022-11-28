import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fbLogo from "../assets/images/fbLogo.png";
import { toast } from "react-toastify";
function Layout({ children, isLoading }) {
  useEffect(() => {
    if (document.querySelector(".Toastify__close-button")) {
      document
        .querySelector(".Toastify__close-button")
        .addEventListener("click", function (e) {
          toast.dismiss();
        });
    }
    return () => {
      if (document.querySelector(".Toastify__close-button")) {
        document
          .querySelector(".Toastify__close-button")
          .removeEventListener("click", function (e) {
            toast.dismiss();
          });
      }
    };
  });
  return (
    <div style={{ position: "relative" }}>
      {children}
      {isLoading && (
        <div class="loader-wrapper">
          <div class="loader d-flex justify-content-center align-items-center">
            <span class="logo-icon">
              <img
                alt="First Bank logo"
                src={fbLogo}
                style={{
                  width: 150,
                  height: 150,
                  objectPosition: "center",
                  objectFit: "contain",
                }}
              />
              <p className={"mt-3"} style={{fontSize: 14}}>Loading, Please wait...</p>
            </span>
            
          </div>
        </div>
      )}
      
    </div>
  );
}

const mapStateToProps = (state) => {
  const { isLoading } = state.UI;
  return { isLoading };
};

export default connect(mapStateToProps, null)(Layout);
