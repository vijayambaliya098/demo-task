import { useEffect, useState } from "react";
import CustomTable from "../components/Table/Table";
import { formatDate, padNumber } from "../components/Table/utils";
import "./Products.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Products() {
  const rowsPerPage = 10;
  const [tablePage, setTablePage] = useState(1);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [productlist, setProductList] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState<any>(0)
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
      sortable: false,
    },
    {
      id: "cost",
      numeric: false,
      disablePadding: false,
      label: "Price",
      sortable: false,
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
            navigate(`/${row._id}`);
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
    setTableOrder({ order, orderBy });
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/?page=${tablePage}&limit=${rowsPerPage}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDdlMDY5OTI3ODUwMDNjZGEwZTQ5ZiIsImVtYWlsIjoidmlqYXlAZ21haWwuY29tIiwidHlwZSI6InVzZXIiLCJpYXQiOjE2ODI0MzIxNDIsImV4cCI6MTcxMzk2ODE0Mn0.JnCLy1tcTDKEsp5o5gv1LxOvxtntFHtGaaTpBy_CB5o",
          },
        }
      );
      console.log(response);
      if (response && response.data && response.data.data) {
        setProductList(response.data.data.products);
        setTotalRecords(response.data.data.count)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [tablePage]);

  return (
    <div>
      <div className="form-fieldset search-product-wrapper">
        <input
          placeholder="Enter Product Name"
          className="form-input search-product"
          id="productName"
          type="text"
          name="productName"
          value={search}
          onChange={(e: any) => {
            setSearch(e.target.value);
          }}
        />
        <Button variant="outlined" onClick={() => {}}>
          Search
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
  );
}

export default Products;
