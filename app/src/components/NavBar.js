import React from 'react';
import { Link } from 'react-router-dom'
import { 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';

import { ROUTES } from "Constants";

const drawerWidth = 150;

const ROUTES_MAP = [
  {
    Icon: InboxIcon,
    label: 'Cubii',
    route: ROUTES.BLUETOOTH
  },
  {
    Icon: MailIcon,
    label: 'Settings',
    route: ROUTES.SETTINGS
  }
];

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3, 2),
  },
}));

function NavBar() {
  const classes = useStyles();
  const pathname = useSelector(state => state?.router?.location?.pathname);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerContainer}>
        <List>
          {ROUTES_MAP.map(route => {
            return (
              <ListItem
                button
                component={Link}
                key={route.route}
                selected={pathname === route.route}
                to={route.route}
              >
                <ListItemIcon><route.Icon /></ListItemIcon>
                <ListItemText primary={route.label} />
              </ListItem>
            )})
        }
        </List>
      </div>
    </Drawer>
  )
}

export default NavBar;
