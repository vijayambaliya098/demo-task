import { useEffect, useState } from "react";
import CustomTable from "../components/Table/Table";
import { formatDate, padNumber } from "../components/Table/utils";
import "./Products.css";
import { Button } from "@mui/material";
import axios from "axios";
import AddProduct from "./AddProduct";

function Products() {
  const rowsPerPage = 10;
  const [tablePage, setTablePage] = useState(1);
  const [search, setSearch] = useState("");
  const [productlist, setProductList] = useState<any>([]);
  const [showdialog, setShowDialog] = useState<any>(false);
  const [totalRecords, setTotalRecords] = useState<any>(0);
  const [id, setId] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [tableOrder, setTableOrder] = useState({
    order: "asc",
    orderBy: "createdAt",
  });

  const tableHeader = [
    {
      id: "id",
      numeric: false,
      disablePadding: false,
      label: "S. No.",
      render: (text: any, row: any, index: any, data: any) =>
        padNumber(index + 1 + rowsPerPage * (tablePage - 1), 1),
    },
    {
      id: "productName",
      numeric: false,
      disablePadding: false,
      label: "Product Name",
      sortable: true,
    },
    {
      id: "cost",
      numeric: false,
      disablePadding: false,
      label: "Price",
      sortable: true,
    },
    {
      id: "createdAt",
      numeric: false,
      disablePadding: false,
      label: "Created At",
      sortable: true,
      render: (text: any) => formatDate(text),
    },
    {
      id: "actions",
      numeric: false,
      disablePadding: false,
      label: "Actions",
      sortable: false,
      render: (text: any, row: any) => (
        <Button
          variant="outlined"
          onClick={() => {
            setShowDialog(true);
            setId(row._id);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setTablePage(page);
  };

  const handleSortChange = (order: string, orderBy: string) => {
    setTableOrder({ order: order, orderBy: orderBy });
    setTablePage(1)
  };

  const getAllProducts = async () => {
    try {
      let url = "http://localhost:8080/api/v1/product?";
      let params = [];
      if (tablePage) params.push(`page=${tablePage}`);
      if (rowsPerPage) {
        params.push(`limit=${rowsPerPage}`);
      }
      if (search) {
        params.push(`character=${search}`);
      }
      if (tableOrder.order) {
        params.push(`orderby=${tableOrder.order}`);
      }
      if (tableOrder.orderBy) {
        params.push(`sort=${tableOrder.orderBy}`);
      }
      url = url + params.join("&");
      const response = await axios.get(url, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDdlMDY5OTI3ODUwMDNjZGEwZTQ5ZiIsImVtYWlsIjoidmlqYXlAZ21haWwuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2ODI0MzIxNDIsImV4cCI6MTcxMzk2ODE0Mn0.JnCLy1tcTDKEsp5o5gv1LxOvxtntFHtGaaTpBy_CB5o",
        },
      });
      if (response && response.data && response.data.data) {
        setProductList(response.data.data.data);
        setTotalRecords(response.data.data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toSearch = () => {
    setIsSearched(true);
    setTablePage(1);
  };

  const toClear = () => {
    setIsSearched(false);
    setSearch("");
  };

  const toOpen = () => {
    setShowDialog(true);
  };

  useEffect(() => {
    getAllProducts();
  }, [tablePage, showdialog, tableOrder]);

  useEffect(() => {
    if (isSearched) {
      getAllProducts();
    }
  }, [isSearched]);

  useEffect(() => {
    if (search.trim().length === 0) {
      setIsSearched(true);
    }
  }, [search]);

  return (
    <>
      <div>
        <div className="form-detail">
          <div className="search-product-wrapper">
            <input
              placeholder="Enter Product Name"
              className="form-input search-product"
              id="productName"
              type="text"
              name="productName"
              value={search}
              onChange={(e: any) => {
                setIsSearched(false);
                setSearch(e.target.value);
              }}
            />
            <Button variant="outlined" onClick={toSearch}>
              Search
            </Button>
            <Button variant="outlined" color="error" onClick={toClear}>
              Clear
            </Button>
          </div>
          <Button className="btn-add" variant="contained" onClick={toOpen}>
            Add Product
          </Button>
        </div>
        <CustomTable
          tableHeader={tableHeader}
          tableData={productlist}
          totalRecords={totalRecords}
          sortingRequired={true}
          paginationServerSide={true}
          page={tablePage}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          sortingServerSide={true}
          order={tableOrder.order}
          orderBy={tableOrder.orderBy}
          onSortChange={handleSortChange}
          rowclickable={false}
          isLoading={false}
          paginationRequired={true}
        />
      </div>
      <AddProduct
        setShowDialog={setShowDialog}
        showdialog={showdialog}
        productId={id}
      />
    </>
  );
}

export default Products;
