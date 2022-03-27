import * as React from 'react';
import { useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ListTable from './ListTable';
import Footer from './Footer';
import Header from './Header';
import { getFansInfo } from '../utility/getFansInfo';
import AlertSnackbars from './shared/AlertSnackbars';
const theme = createTheme();

const productName = 'Sweetie';
const productDescription = 'Turnover rate has been an important issue for an enterprise. This system aims to predict the probability of turnover for each employee.';

export default function Home() {
  const [fansInfos, setFansInfos] = useState([{
    "address": "000",
    "balance": "000",
    "akaDao": "000",
    "collection": ["000", "000", "000"]
  }]);
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClose = (event, reason) => { // close alert snackbar
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const tokenList = data.getAll('token');
    const result = await getFansInfo(
        data.get('minBalance'),data.get('maxBalance'),tokenList
    );

    if (result === null){//there is no data
      setOpenAlert(true);
    }
    else{
      setFansInfos(result);
    }
    setLoading(false);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Header
          productName={productName}
          productDescription={productDescription}
        />
        <Container sx={{ py: 4 }}>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: 'repeat(5, 1fr)',
              mb: 2
            }}>
              <TextField
                id="minBalance"
                label="min balance"
                name="minBalance"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                autoFocus
              />
              <TextField
                id="maxBalance"
                label="max balance"
                name="maxBalance"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <TextField
                id="token"
                label="token id 1"
                name="token"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <TextField
                id="token"
                label="token id 2"
                name="token"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <TextField
                id="token"
                label="token id 3"
                name="token"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Box>
            <Button
                type="submit"
                variant="contained"
                color='secondary'
                disabled={loading}
                sx={{ mt: 3, mb: 2, fontFamily: 'Karla, sans-serif' }}
            >
                R U N
            </Button>
          </Box>
           
          <ListTable fansInfos={fansInfos}/>
          <AlertSnackbars open={openAlert} handleClose={handleClose}/> 
        </Container>
      </main>
      <Footer productName={productName}/>
    </ThemeProvider>
  );
}