import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from './Copyright';
 
export default function Footer(props){
    const { productName } = props;
    return(
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
          sx={{fontFamily: 'Karla, sans-serif'}}
        >
          測試版 Open Beta
        </Typography>
        <Copyright productName={productName}/>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
          sx={{fontFamily: 'Karla, sans-serif'}}
        >
          Powered by TzKT API
        </Typography>
      </Box>
    );
}