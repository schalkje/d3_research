import React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Outlet } from "react-router-dom";
import Box from '@mui/material/Box';
import './App.css';

// https://mui.com/material-ui/react-css-baseline/#global-reset
import CssBaseline from '@mui/material/CssBaseline';

// Components
import BreadcrumbExt from "../features/dashboard/BreadcrumbExt";
import SideBar from '../features/dashboard/SideBar';
import Header from '../features/dashboard/Header';

// make sure the content is moved below the header: https://mui.com/material-ui/react-app-bar/#fixed-placement
const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);


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


function App() {
  return (
    <div className="App">
      

      <CssBaseline enableColorScheme />
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          <Header />

          <SideBar />

          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Offset />
            <div>
            <BreadcrumbExt />
            </div>
            <div className='mainOutlet'>
              <Outlet />
            </div>
          </Box>
        </Box>
      </ThemeProvider>
    </div >


  );
}


export default App;
