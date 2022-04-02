import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
// import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ListTable from './ListTable';
import Footer from './Footer';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import Header from './Header';
import { getFansInfo } from '../utility/getFansInfo';
import AlertSnackbars from './shared/AlertSnackbars';
const theme = createTheme();

const productName = 'Fansis-Tezos fans analysis';
const productDescription = 'Find your fans who have any of the specific collection.';

export default function Home() {
  const [fansInfos, setFansInfos] = useState([{
    "address": "000",
    "balance": "000",
    "akaDao": "000",
    "tokenList": ["000", "000", "000"]
  }]);
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertLevel, setAlertLevel] = useState('info');
  // const [checked, setChecked] = useState(false);

  // const handleCheckboxChange = (event) => {
  //   setChecked(event.target.checked);
  // };
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
    const CollectionList = data.getAll('token');
    const CreatorList = data.getAll('creator_address');
    const fansInfos = await getFansInfo(
        data.get('minBalance'),data.get('maxBalance'),CollectionList,CreatorList
    );
    if (fansInfos === "fail") {
      console.log("fail");
      setOpenAlert(true);
      setAlertLevel('error');
      setFansInfos([{"address": "000",
      "tokenList": ["000", "000", "000"]}]);
    }
    if (fansInfos === -1) {
      console.log("no creations");
      setOpenAlert(true);
      setAlertLevel('info');
      setFansInfos([{"address": "000",
      "tokenList": ["000", "000", "000"]}]);
    }
    else if (fansInfos.length <= 0){//there is no matching data
      console.log("no data");
      setOpenAlert(true);
      setAlertLevel('info');
      setFansInfos([{"address": "000",
      "tokenList": ["000", "000", "000"]}]);
    }
    else{
      console.log("success");
      setFansInfos(fansInfos);
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
                label="min balance (10^-6 xtz)"
                name="minBalance"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                autoFocus
                required
                placeholder="default:0000000"

              />
              <TextField
                id="maxBalance"
                label="max balance (10^-6 xtz)"
                name="maxBalance"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                required
                placeholder="default:10000000"

              />
              <TextField
                id="token"
                label="collection(optional)"
                name="token"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                placeholder="token id 1"
              />
              <TextField
                id="token"
                label="collection(optional)"
                name="token"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                placeholder="token id 2"
              />
              <TextField
                id="token"
                label="collection(optional)"
                name="token"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                placeholder="token id 3"
              />
              <TextField
                id="creator_address"
                label="creator address"
                name="creator_address"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                placeholder="creator address"
              />
              <TextField
                id="creator_address"
                label="creator address"
                name="creator_address"
                color="secondary"
                sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                placeholder="creator address"
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
            {/* <FormGroup sx={{pb: 2}}>
              <FormControlLabel 
              control={
                <Checkbox 
                  color="secondary" checked={checked}
                  onChange={handleCheckboxChange}
                />
              } 
              label="show fans with at least one collection" />
            </FormGroup> */}
          </Box>
          <ListTable  fansInfos={fansInfos}/>
          {/* checked={checked}  */}
          <AlertSnackbars open={openAlert} handleClose={handleClose} level={alertLevel}/> 
        </Container>
      </main>
      <Footer productName={productName}/>
    </ThemeProvider>
  );
}