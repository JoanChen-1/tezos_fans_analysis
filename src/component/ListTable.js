import * as React from 'react';
import EnhancedTableHead from "./shared/EnhancedTableHead";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';



const rows = [
  {
    id: "address",
    numeric: false,
    label: "address"
  },
  // {
  //   id: "balance",
  //   numeric: false,
  //   label: "balance"
  // },
  // {
  //   id: "akaDao",
  //   numeric: false,
  //   label: "akaDao"
  // },
  {
    id: "collection",
    numeric: false,
    label: "collection"
  }
];

export default function ListTable(props) {
    const { fansInfos } = props;
    return (
      <div sx={{
        overflowX: "auto",
        width: "100%"}}
      >
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead rowCount={fansInfos.length} rows={rows} />
          <TableBody>
            {fansInfos
              .map((d, idx) => (
                <TableRow hover tabIndex={-1} key={idx}>
                  <TableCell
                    component="th"
                    scope="row"
                    align='center'
                  >
                  <Grid container 
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {d.address}
                  </Grid>
                  </TableCell>
                  {/* <TableCell
                    component="th"
                    scope="row"
                    align='center'
                  >
                    {d.balance}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align='center'
                  >
                    {d.akaDao}
                  </TableCell> */}
                  <TableCell
                    component="th"
                    scope="row"
                    align='center'
                  >
                    {d.tokenList.map(token=>(token+","))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }