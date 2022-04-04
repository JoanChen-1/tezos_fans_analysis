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
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getDatabyCollection } from '../utility/getData';
import { getDatabyCreator } from '../utility/getData';
const theme = createTheme();

const productName = 'Fansis-Tezos fans analysis';
const productDescription = 'Find your fans who have any of the specific collection.';

export default function Home() {
  const [fansInfos, setFansInfos] = useState([{
    "address": "000", "collectionList": ["000", "000", "000"]
  }]);
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertLevel, setAlertLevel] = useState('info');
  const [search, setSearch] = useState('creator_address');
  const [unionCondition, setUnionCondition] = useState('union');
  const handleRadioChange = (event) => {
    console.log(event.target.value);
    setSearch(event.target.value);
  };
  const handleToggleChange = (event) => {
    console.log(event.target.value);
    setUnionCondition(event.target.value);
  };
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
      setFansInfos([{"address": "000", "collectionList": ["000", "000", "000"]}]);
    }
    else if (fansInfos.length <= 0){//there is no matching data
      console.log("no data");
      setOpenAlert(true);
      setAlertLevel('info');
      setFansInfos([{"address": "000", "collectionList": ["000", "000", "000"]}]);
    }
    else{
      console.log("success");
      console.log(result);
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
        <FormControl component="fieldset">
          <FormLabel component="legend">search</FormLabel>
          <RadioGroup 
            onChange={handleRadioChange}
            value={search}
            row aria-label="search" name="controlled-radio-buttons-group"
          >
            <FormControlLabel value="creator_address" control={<Radio />} label="searh by collection's creator" />
            <FormControlLabel value="collection" control={<Radio />} label="search by collection" />
          </RadioGroup>
        </FormControl>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {(search === "collection") && (
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
            </Box>
            )}
            {(search === "creator_address") && (
              <Box sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: 'repeat(5, 1fr)',
                mb: 2
              }}>
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
                <ToggleButtonGroup
                  color="primary"
                  value={unionCondition}
                  exclusive
                  onChange={handleToggleChange}
                >
                  <ToggleButton value="union">Union</ToggleButton>
                  <ToggleButton value="intersection">Intersection</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}
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