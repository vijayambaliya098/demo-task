import React, { useEffect, useState } from "react";
import "./AddProducts.css";
import { Alert, AlertColor, Button, Snackbar } from "@mui/material";
import axios from "axios";
import CustomDialog from "../components/Dialog";

type Props = {
  showdialog: any;
  setShowDialog: any;
  productId: any;
};

const AddProduct = React.forwardRef((props: any, ref: any) => {
  const { showdialog, setShowDialog, productId } = props;
  const initialState = {
    productName: "",
    productPrice: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState<any>(null);
  const [showAlert, setShowAlert] = useState<{
    message: string;
    type: AlertColor | undefined;
  }>({
    message: "",
    type: undefined,
  });

  const getProductById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/product/${productId}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDdlMDY5OTI3ODUwMDNjZGEwZTQ5ZiIsImVtYWlsIjoidmlqYXlAZ21haWwuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2ODI0MzIxNDIsImV4cCI6MTcxMzk2ODE0Mn0.JnCLy1tcTDKEsp5o5gv1LxOvxtntFHtGaaTpBy_CB5o",
          },
        }
      );
      if (res && res.data && res.data.data) {
        setFormData({
          ...formData,
          productName: res.data.data.productName,
          productPrice: res.data.data.cost,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productId) {
      getProductById();
    }
  }, [productId]);

  const onChange = (e: any) => {
    if (e.target.name === "productPrice") {
      const regex = /^[0-9\b]+$/;
      if (regex.test(e.target.value) || e.target.value.trim().length === 0) {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value.trim().length
            ? parseInt(e.target.value)
            : "",
        });
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  useEffect(() => {
    setError(null);
  }, [showdialog]);

  const validateForm = () => {
    if (!formData.productName.trim().length) {
      return {
        has_error: true,
        message: "This is required field",
        field: "productName",
      };
    }
    if (!formData.productPrice) {
      return {
        has_error: true,
        message: "This is required field",
        field: "productPrice",
      };
    }

    return { has_error: false, error: null, field: null };
  };

  const handleSubmit = async () => {
    try {
      // e.preventDefault();
      const { has_error, message, field }: any = validateForm();
      if (has_error) {
        setError({ message, field });
        return;
      }
      const payload: any = {
        productName: formData.productName,
        cost: formData.productPrice.toString(),
      };

      if (productId) {
        payload["_id"] = productId;
      }
      let url = productId
        ? `http://localhost:8080/api/v1/product/update`
        : "http://localhost:8080/api/v1/product/create";

      let result = await axios({
        url,
        method: productId ? "PUT" : "POST",
        data: payload,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDdlMDY5OTI3ODUwMDNjZGEwZTQ5ZiIsImVtYWlsIjoidmlqYXlAZ21haWwuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2ODI0MzIxNDIsImV4cCI6MTcxMzk2ODE0Mn0.JnCLy1tcTDKEsp5o5gv1LxOvxtntFHtGaaTpBy_CB5o",
        },
      });
      if (result && result.status === 200) {
        setShowAlert({
          message: productId
            ? "Product edited successfully"
            : "Product added successfully",
          type: "success",
        });
        setFormData(initialState);
        setShowDialog(false);
        setTimeout(() => {
          setShowAlert({
            message: "",
            type: undefined,
          });
        }, 3000);
      }
    } catch (error) {
      setShowAlert({
        message: "Something went wrong",
        type: "error",
      });
      console.log(error);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <div className="form-wrepper">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!showAlert.message}
        autoHideDuration={6000}
        onClose={() =>
          setShowAlert({
            message: "",
            type: undefined,
          })
        }
      >
        <Alert severity={showAlert.type}>{showAlert.message}</Alert>
      </Snackbar>{" "}
      <CustomDialog
        setShowDialog={setShowDialog}
        showdialog={showdialog}
        dialogTitle={productId ? "Edit Product" : "Add Product"}
        dialogActions={
          <>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              className="add-product__btn"
            >
              Submit
            </Button>
          </>
        }
      >
        <form>
          <div className="form-fieldset">
            <label className="form-label" htmlFor="productName">
              Product Name
            </label>
            <input
              placeholder="Enter Product Name"
              className="form-input"
              id="productName"
              type="text"
              name="productName"
              value={formData.productName}
              onChange={onChange}
            />
            {error && error.field && error.field === "productName" && (
              <span className="error-field">{error.message}</span>
            )}
          </div>
          <div className="form-fieldset">
            <label className="form-label" htmlFor="productPrice">
              Product Price
            </label>
            <input
              placeholder="Enter Product Price"
              className="form-input"
              id="productPrice"
              type="text"
              name="productPrice"
              value={formData.productPrice}
              onChange={onChange}
            />
            {error && error.field && error.field === "productPrice" && (
              <span className="error-field">{error.message}</span>
            )}
          </div>
        </form>
      </CustomDialog>
    </div>
  );
});

export default AddProduct;
