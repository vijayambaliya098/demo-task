export const desc = (a: any, b: any, orderBy: any) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const stableSort = (array: any, cmp: any) => {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any) => el[0]);
};

export const getSorting = (order: any, orderBy: any) => {
  return order === "desc"
    ? (a: any, b: any) => desc(a, b, orderBy)
    : (a: any, b: any) => -desc(a, b, orderBy);
};

export const padNumber = (number: number, size: number) => {
  var s = String(number);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

export function formatDate(date: string) {
  const options: any = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
}
