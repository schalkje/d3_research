import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import { useSelector, useDispatch } from 'react-redux';
import { toggle_overviewVisible, toggle_dataDomainVisible, toggle_networkVisible, toggle_recentVisible } from './SidebarSlicer';
import { selectDrawer } from './DashboardSlicer';
import { getDataDomains } from '../../data/data_domains'
import { getBusinessDomains } from '../../data/business_domains'
import { getRecentReports } from '../../data/recent_reports'
import { Link } from "react-router-dom";

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// https://mui.com/material-ui/material-icons/?msclkid=1a270260cec311ec91ae3fd5c0bc579f
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EditRoadIcon from '@mui/icons-material/EditRoad';

import BusinessIcon from '@mui/icons-material/Business';
import StorageIcon from '@mui/icons-material/Storage';

export default function MainMenu() {
  const overviewVisible = useSelector((state) => state.side_bar.overviewVisible)
  const dataDomainVisible = useSelector((state) => state.side_bar.dataDomainVisible)
  const networkVisible = useSelector((state) => state.side_bar.networkVisible)
  const recentVisible = useSelector((state) => state.side_bar.recentVisible)
  const drawer = useSelector(selectDrawer)

  console.log('MainMenu')
  console.log(dataDomainVisible)
  const dispatch = useDispatch()

  return (
    <React.Fragment>
      <ListItemButton component={Link} to="/" onClick={ () => dispatch(toggle_overviewVisible()) }>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Overview" secondary="d3 research"/>
        {overviewVisible ? <ExpandLess /> : <ExpandMore />} 
      </ListItemButton>

      
      <ListItemButton component={Link} to="/network" onClick={ () => dispatch(toggle_networkVisible()) }>
        <ListItemIcon>
          <BusinessIcon />
        </ListItemIcon>
        <ListItemText primary="Network" />
        {networkVisible ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={networkVisible} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense={!drawer}>
        {getBusinessDomains().map((domain,index) =>
            <ListItemButton key={'bm'+index} sx={{ pl: 4 }} component={Link} to={"/network/" + domain.label.substring(0, 3).toLowerCase()}>
              <ListItemIcon>
                {domain.label.substring(0, 3).toLowerCase()}
              </ListItemIcon>
              <ListItemText primary={domain.label} secundary="team:" />
            </ListItemButton>
          )}
        </List>
      </Collapse>

      <ListItemButton component={Link} to="/lineage">
        <ListItemIcon>
          <AnalyticsIcon />
        </ListItemIcon>
        <ListItemText primary="Lineage Graph" secundary="26 products"/>
      </ListItemButton>
      
    </React.Fragment>
  )
}

