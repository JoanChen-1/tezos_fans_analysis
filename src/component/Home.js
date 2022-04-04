import * as React from 'react';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AlertSnackbars from './shared/AlertSnackbars';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './Header';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ListTable from './ListTable';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Footer from './Footer';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getDatabyCollection } from '../utility/getData';
import { getDatabyCreator } from '../utility/getData';
const theme = createTheme();

const productName = 'Tezos collectors analysis';
const productDescription = '';

export default function Home() {
  const [fansInfos, setFansInfos] = useState([{
    "address": " ", "collectionList": [" ", " "]
  }]);
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertLevel, setAlertLevel] = useState('info');
  const [search, setSearch] = useState('creator_address');
  const [unionCondition, setUnionCondition] = useState('union');
  
  const handleRadioChange = (event) => {
    setSearch(event.target.value);
  };

  const handleToggleChange = (event) => {
    setUnionCondition(event.target.value);
  };

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
    let result;
    if (search === 'collection') {
      const collectionList = data.getAll('token');
      result = await getDatabyCollection(
          data.get('minBalance'),data.get('maxBalance'),collectionList
      );
    }
    else {
      const creatorList = data.getAll('creator_address');
      result = await getDatabyCreator(unionCondition, creatorList);
    }
    if (result === "fail") {
      console.log("fail");
      setOpenAlert(true);
      setAlertLevel('error');
      setFansInfos([{"address": " ", "collectionList": [" ", " "]}]);
    }
    else if (result === -1){//there is no matching data
      console.log("no data");
      setOpenAlert(true);
      setAlertLevel('info');
      setFansInfos([{"address": " ", "collectionList": [" ", " "]}]);
    }
    else{
      console.log("success");
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
          <FormControl component="fieldset" color="secondary">
            <RadioGroup 
              color="secondary"
              onChange={handleRadioChange}
              value={search}
              row
            >
              <FormControlLabel value="creator_address" control={<Radio />} label="search by creators" />
              <FormControlLabel value="collection" control={<Radio />} label="search by balances and collections" />
            </RadioGroup>
          </FormControl>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {(search === "collection") && (
              <Box sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: 'repeat(4, 1fr)',
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
                  label="collection"
                  name="token"
                  color="secondary"
                  sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  placeholder="token id 1"
                />
                <TextField
                  id="token"
                  label="collection"
                  name="token"
                  color="secondary"
                  sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  placeholder="token id 2"
                />
              </Box>
              )}
            {(search === "creator_address") && (
              <Box sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: 'repeat(4, 1fr)',
                mb: 2
              }}>
                <ToggleButtonGroup
                  color="secondary"
                  value={unionCondition}
                  onChange={handleToggleChange}
                >
                  <ToggleButton value="union">Union</ToggleButton>
                  <ToggleButton value="intersection">Intersection</ToggleButton>
                </ToggleButtonGroup>
                <TextField
                  id="creator_address"
                  label="creator's address"
                  name="creator_address"
                  color="secondary"
                  sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                  placeholder="tz..."
                />
                <TextField
                  id="creator_address"
                  label="creator's address"
                  name="creator_address"
                  color="secondary"
                  sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                  placeholder="tz..."
                />
                <TextField
                  id="creator_address"
                  label="creator's address"
                  name="creator_address"
                  color="secondary"
                  sx={{ minWidth: 10, fontFamily: 'Karla, sans-serif'}}
                  placeholder="tz..."
                />
              </Box>
            )}
            <Button
                type="submit"
                variant="contained"
                color='secondary'
                disabled={loading}
                sx={{ mt: 3, mb: 2, fontFamily: 'Karla, sans-serif' }}
            >
                S E A R C H
            </Button>
          </Box>
          <ListTable  fansInfos={fansInfos}/>
          <AlertSnackbars open={openAlert} handleClose={handleClose} level={alertLevel}/> 
        </Container>
      </main>
      <Footer productName={productName}/>
    </ThemeProvider>
  );
}