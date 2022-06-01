import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import { useSelector, useDispatch } from 'react-redux';
import { toggle_overviewVisible, toggle_databaseVisible, toggle_networkVisible, toggle_flowVisible, toggle_lineageVisible } from './SidebarSlicer';
import { selectDrawer } from './DashboardSlicer';
import { getLineageGraphsByType } from '../../data/lineage_graphs'
import { Link } from "react-router-dom";

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// https://mui.com/material-ui/material-icons/?msclkid=1a270260cec311ec91ae3fd5c0bc579f
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import SchemaIcon from '@mui/icons-material/Schema';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import BusinessIcon from '@mui/icons-material/Business';

export default function MainMenu() {
  const overviewVisible = useSelector((state) => state.side_bar.overviewVisible)
  const dataDomainVisible = useSelector((state) => state.side_bar.dataDomainVisible)
  const networkVisible = useSelector((state) => state.side_bar.networkVisible)
  const lineageVisible = useSelector((state) => state.side_bar.lineageVisible)
  const flowVisible = useSelector((state) => state.side_bar.flowVisible)
  const databaseVisible = useSelector((state) => state.side_bar.databaseVisible)
  const drawer = useSelector(selectDrawer)

  console.log('MainMenu')
  console.log(dataDomainVisible)
  const dispatch = useDispatch()

  return (
    <React.Fragment>
      <ListItemButton component={Link} to="/" onClick={() => dispatch(toggle_overviewVisible())}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Overview" secondary="d3 research" />
        {overviewVisible ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>


      <ListItemButton component={Link} to="/network" onClick={() => dispatch(toggle_networkVisible())}>
        <ListItemIcon>
          <BusinessIcon />
        </ListItemIcon>
        <ListItemText primary="Network" />
        {networkVisible ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={networkVisible} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense={!drawer}>
          {getLineageGraphsByType('network').map((graph, index) =>
            <ListItemButton key={'bm' + index} sx={{ pl: 4 }} component={Link} to={"/network/" + graph.key}>
              <ListItemIcon>
                {graph.label.substring(0, 3).toLowerCase()}
              </ListItemIcon>
              <ListItemText primary={graph.label} secundary="team:" />
            </ListItemButton>
          )}
        </List>
      </Collapse>

      <ListItemButton component={Link} to="/lineage" onClick={() => dispatch(toggle_lineageVisible())}>
        <ListItemIcon>
          <AccountTreeIcon />
        </ListItemIcon>
        <ListItemText primary="Lineage Graph" secundary="26 products" />
        {lineageVisible ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={lineageVisible} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense={!drawer}>
          {getLineageGraphsByType('lineage').map((graph, index) =>
            <ListItemButton key={'bm' + index} sx={{ pl: 4 }} component={Link} to={"/lineage/" + graph.key}>
              <ListItemIcon>
                {graph.label.substring(0, 3).toLowerCase()}
              </ListItemIcon>
              <ListItemText primary={graph.label} secundary="team:" />
            </ListItemButton>
          )}
        </List>
      </Collapse>

      <ListItemButton component={Link} to="/flow" onClick={() => dispatch(toggle_flowVisible())}>
        <ListItemIcon>
          <SchemaIcon />
        </ListItemIcon>
        <ListItemText primary="React Flow" />
        {flowVisible ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={flowVisible} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense={!drawer}>
          {getLineageGraphsByType('flow').map((graph, index) =>
            <ListItemButton key={'bm' + index} sx={{ pl: 4 }} component={Link} to={"/flow/" + graph.key}>
              <ListItemIcon>
                {index}
              </ListItemIcon>
              <ListItemText primary={graph.label} />
            </ListItemButton>
          )}
        </List>
      </Collapse>


      <ListItemButton component={Link} to="/database" onClick={() => dispatch(toggle_databaseVisible())}>
        <ListItemIcon>
          <StorageIcon />
        </ListItemIcon>
        <ListItemText primary="Database" />
        {databaseVisible ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={databaseVisible} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense={!drawer}>
          {getLineageGraphsByType('database').map((graph, index) =>
            <ListItemButton key={'bm' + index} sx={{ pl: 4 }} component={Link} to={"/database/" + graph.key}>
              <ListItemIcon>
                {graph.label.substring(0, 3).toLowerCase()}
              </ListItemIcon>
              <ListItemText primary={graph.label} />
            </ListItemButton>
          )}
        </List>
      </Collapse>

    </React.Fragment >
  )
}

