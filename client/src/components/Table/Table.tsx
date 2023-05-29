import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material/";
import { Pagination, PaginationItem } from "@mui/material";
import React, { useEffect } from "react";
import { getSorting, stableSort } from "./utils";
import TableHeader from "../TableHeader/TableHeader";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import "./Table.css";

const CustomTable = (props: any) => {
  const { page, rowsPerPage, order, orderBy, isLoading, dragSort, extra } =
    props;
  const [tableCurrentPage, setTableCurrentPage] = React.useState(page);
  const [tableRowsPerPage, setTableRowsPerPage] = React.useState(rowsPerPage);
  const [tableOrder, setTableOrder] = React.useState(order); //asc or desc
  const [tableOrderBy, setTableOrderBy] = React.useState(orderBy); //property name

  useEffect(() => {
    setTableCurrentPage(page);
    setTableRowsPerPage(rowsPerPage);
    setTableOrder(order);
    setTableOrderBy(orderBy);
  }, [page, rowsPerPage, order, orderBy]);

  //execute on every page change
  const handleChangePage = (event: any, newPage: any) => {
    if (!props.paginationServerSide) {
      setTableCurrentPage(newPage);
    } else {
      props.onPageChange(newPage);
    }
  };

  //execute on sorting
  const handleRequestSort = (event: any, property: any) => {
    const isDesc = tableOrderBy === property && tableOrder === "desc";
    const direction = isDesc ? "asc" : "desc";
    if (!props.sortingServerSide) {
      setTableOrder(direction);
      setTableOrderBy(property);
    } else {
      props.onSortChange(direction, property);
    }
  };

  const handleRowclick = (row: any) => {
    if (props.rowclickable) {
      props.onRowClickHandler(row);
    }
  };

  let tableData = props.tableData;
  if (props.sortingRequired && !props.sortingServerSide) {
    tableData = stableSort(tableData, getSorting(tableOrder, tableOrderBy));
  }

  if (props.paginationRequired && !props.paginationServerSide) {
    tableData = tableData.slice(
      tableCurrentPage * tableRowsPerPage,
      tableCurrentPage * tableRowsPerPage + tableRowsPerPage
    );
  }
  const getPaginationComponent = (item: any) => {
    switch (item.type) {
      case "first":
        return (
          <PaginationItem
            {...item}
            component={(props: any) => (
              <button {...props} className={`${props.className}`}>
                <KeyboardArrowLeftOutlined />
              </button>
            )}
          />
        );
      case "previous":
        return (
          <PaginationItem
            {...item}
            component={(props: any) => (
              <button {...props} className={`${props.className} navigation`}>
                Prev
              </button>
            )}
          />
        );
      case "next":
        return (
          <PaginationItem
            {...item}
            component={(props: any) => (
              <button {...props} className={`${props.className} navigation`}>
                Next
              </button>
            )}
          />
        );
      case "last":
        return (
          <PaginationItem
            {...item}
            component={(props: any) => (
              <button {...props} className={`${props.className}`}>
                <KeyboardArrowRightOutlined />
              </button>
            )}
          />
        );
      default:
        return <PaginationItem {...item} />;
    }
  };
  return (
    <div className="table-container position-relative">
      <Table aria-label="table">
        <TableHeader
          headCells={props.tableHeader}
          order={tableOrder}
          orderBy={tableOrderBy}
          sortingRequired={props.sortingRequired}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={props.tableHeader && props.tableHeader.length}
              >
                <CircularProgress />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && tableData?.length == 0 && (
            <TableRow>
              <TableCell
                colSpan={props.tableHeader && props.tableHeader.length}
                className="table-empty-placeholder"
              >
                No Data
              </TableCell>
            </TableRow>
          )}
          {!isLoading && tableData?.length > 0 && (
            <>
              {tableData.map((row: any, index: any) => (
                <TableRow
                  key={row.id}
                  onClick={(event: any) => handleRowclick(row)}
                  hover={props.rowclickable}
                >
                  {props.tableHeader.map((headCell: any) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.numeric ? "right" : "left"}
                      padding={headCell.disablePadding ? "none" : "normal"}
                      width={headCell?.width}
                      className={props?.tableDataClass}
                    >
                      {headCell.render && (
                        <>
                          {headCell.render(
                            row[headCell.id],
                            row,
                            index,
                            tableData
                          )}
                        </>
                      )}
                      {!headCell.render && <>{row[headCell.id]}</>}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
      <Grid container style={{ marginTop: "30px", justifyContent: "flex-end" }}>
        <Grid item>{extra}</Grid>
        <Grid item>
          {props.paginationRequired && (
            <div>
              <Pagination
                count={Math.ceil(
                  (!props.paginationServerSide
                    ? props.tableData.length
                    : props.totalRecords) / tableRowsPerPage
                )}
                renderItem={getPaginationComponent}
                page={tableCurrentPage || 1}
                shape="rounded"
                onChange={handleChangePage}
                showFirstButton
                showLastButton
              />
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomTable;
