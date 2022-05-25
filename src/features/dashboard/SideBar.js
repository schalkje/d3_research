import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


import MainMenu from './MainMenu';
import { toggle, selectDrawer } from './DashboardSlicer';
import logo from '../../resources/logo.png'

const drawerWidth = 300;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);



export default function SideBar() {
  const drawer = useSelector(selectDrawer)
  const dispatch = useDispatch()

  return (
    <Drawer variant="permanent" open={drawer} >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1]

        }}
      >
        {drawer ?
          <>
            <img src={logo} className='logo_header' alt='Logo' />
            <span style={{ fontSize: 12, color: 'lightgrey' }}>v</span>
            <span style={{ fontSize: 14, color: 'grey' }}><b>0.1</b></span>
            <div style={{width: 200}}/>
          </>
        : <MenuIcon />}
        <IconButton onClick={() => dispatch(toggle())}>
          {drawer ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List >
        {/* component="nav"> */}
        <MainMenu />
        <Divider sx={{ my: 1 }} />
      </List>

      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1]

        }}
      >
      </Toolbar>
    </Drawer>
  );
}
