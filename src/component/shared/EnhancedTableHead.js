import React, { useCallback } from "react";
import classNames from "classnames";
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { withStyles } from '@mui/styles'


const styles = () => ({
  tableSortLabel: {
    cursor: "text",
    userSelect: "auto",
    color: "inherit !important"
  },
  noIcon: {
    "& path": {
      display: "none !important"
    }
  }
});

function EnhancedTableHead(props) {
  const { order, orderBy, rows, onRequestSort, classes } = props;

  const createSortHandler = useCallback(
    property => event => {
      onRequestSort(event, property);
    },
    [onRequestSort]
  );

  return (
    <TableHead>
      <TableRow>
        {rows.map((row, index) => (
          <TableCell
            key={index}
            align={row.numeric ? "right" : "center"}
            padding="none"
            sortDirection={orderBy === row.name ? order : false}
            className={null}
          >
            {onRequestSort ? (
              <Tooltip
                title="Sort"
                placement={row.numeric ? "bottom-end" : "bottom-start"}
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === row.id}
                  direction={order}
                  onClick={createSortHandler(row.id)}
                >
                  <Typography variant="body2" sx={{fontFamily: 'Karla, sans-serif'}}>
                    {row.label}
                  </Typography>
                </TableSortLabel>
              </Tooltip>
            ) : (
              <TableSortLabel
                className={classNames(classes.tableSortLabel, classes.noIcon)}
              >
                <Typography variant="body2" className={classes.label}
                sx={{fontFamily: 'Karla, sans-serif'}}>
                  {row.label}
                </Typography>
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default withStyles(styles, { withTheme: true })(EnhancedTableHead);
