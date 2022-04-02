import * as React from 'react';
import { useState, useEffect } from 'react';
import EnhancedTableHead from "./shared/EnhancedTableHead";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';

const rows = [
  {
    id: "id",
    numeric: false,
    label: "id"
  },
  {
    id: "address",
    numeric: false,
    label: "user address"
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
    const { fansInfos } = props;//checked, 
    // const [renderedFansInfos, setRenderedFansInfos] = useState(fansInfos);

    // useEffect(() => {
    //   if(checked){
    //     const array = fansInfos.filter(fansInfo => fansInfo.tokenList.length > 0);
    //     setRenderedFansInfos(array);
    //   }
    //   else{
    //     setRenderedFansInfos(fansInfos);
    //   }
    // }, [fansInfos, checked]);

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
                      {idx+1}
                    </Grid>
                  </TableCell>
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
                  <TableCell
                    component="th"
                    scope="row"
                    align='center'
                  >
                    {d.tokenList.map(token=>(token+" "))}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }