import * as React from 'react';
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';


import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Flex from '@react-css/flex'
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';



import { dataDomainListItems } from '../../data/data_domains';

// Components
import mainMenu from './MainMenu';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import SideBar from './SideBar';
import Header from './Header';

// State store
// import { toggle, selectDrawer } from './DashboardSlicer';



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://thefirm.visualstudio.com/Strada/_wiki/wikis/Strada.wiki/558/STRADA-Overview">
        Strada
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


// https://material.io/inline-tools/color/
// const mdTheme = createTheme();
const mdTheme = createTheme({
  palette: {
    primary: {
      main: '#E66706'
    },
    secundary: {
      main: '#E666666'
    },
  },
});
// createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });



function DashboardContent() {
  // const drawer = useSelector(selectDrawer)
  // const dispatch = useDispatch()
  // console.log('DashboardContent')
  // console.log(drawer)

  return (
    // <ThemeProvider theme={mdTheme}>
    //   <CssBaseline />
      <Flex
        sx={{
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
        <Box>Header</Box>

        <Flex
          sx={{
            flex: 1,
            flexDirection: [
              'column',
              'row'
            ]
          }}>
          <Box
            sx={{
              flex: 1,
              minWidth: 0
            }}>
            Main Content
          </Box>
          <Box
            sx={{
              flexBasis: [
                'auto',
                64
              ],
              order: -1
            }}>
            Nav
          </Box>
          <Box
            sx={{
              flexBasis: [
                'auto',
                64
              ]
            }}>
            Ads
          </Box>
        </Flex>

        <Box>Footer</Box>
      </Flex>
    // </ThemeProvider >
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}

