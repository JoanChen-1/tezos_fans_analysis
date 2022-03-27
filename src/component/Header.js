import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useIsWidthUp } from './width';

export default function Header(props) {
    const { productName, productDescription } = props;
    const isMdUp = useIsWidthUp("md");

    return (
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 0,
          pb: 10,
          pt: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${process.env.PUBLIC_URL}/header1.jpg)`,
          opacity: 0.8
        }}
      >
        <Container maxWidth="md">
            <Typography
              component="h1"
              variant={ isMdUp ? "h2": "h4"}
              align="center"
              color="#2d102c"
              gutterBottom
              sx={{fontFamily: 'Karla, sans-serif', fontWeight: 'bold'}}
              >
              {productName}
            </Typography>
          <Box sx={{backgroundColor: 'rgba(255, 255, 255, 1)', mt: -7, py: 2}}>
          </Box>
            <Typography variant="h5" align="center" color="#2d102c" paragraph
              sx={{fontFamily: 'Karla, sans-serif'}}>
              {productDescription}<br/><br/><br/><br/><br/><br/>
            </Typography>
        </Container>
      </Box>
    );
}