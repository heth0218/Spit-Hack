import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LockIcon from '@material-ui/icons/Lock';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PeopleIconAdd from '@material-ui/icons/AddOutlined'
import PeopleIcon from '@material-ui/icons/People';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { NavLink, Link } from "react-router-dom";
import StoreIcon from '@material-ui/icons/Store';

export const mainListItems = (

  <div>
    <a href='/get-outlet' style={{ "color": "black", "textDecoration": "none" }}>
      <ListItem button>
        <ListItemIcon>
          <StoreIcon />
        </ListItemIcon>
        <ListItemText primary="My Outlets" />
      </ListItem>
    </a>
    <a href='/add-outlet' style={{ "color": "black", "textDecoration": "none" }}>
      <ListItem button>
        <ListItemIcon>
          <PeopleIconAdd />
        </ListItemIcon>
        <ListItemText primary="Add Outlet" />
      </ListItem>
    </a>
    <NavLink exact style={{ "color": "black", "textDecoration": "none" }} to="/add-outlet">
      <ListItem button>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Tax Calculator" />
      </ListItem>
    </NavLink>
    <NavLink exact style={{ "color": "black", "textDecoration": "none" }} to="/admin/salary">
      <ListItem button>
        <ListItemIcon>
          <MonetizationOnIcon />
        </ListItemIcon>
        <ListItemText primary="Salary Page" />
      </ListItem>
    </NavLink>
    <NavLink exact style={{ "color": "black", "textDecoration": "none" }} to="/admin/deposit">
      <ListItem button>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Deposit Page" />
      </ListItem>
    </NavLink>
    <NavLink exact style={{ "color": "black", "textDecoration": "none" }} to="/admin/taxFile">
      <ListItem button>
        <ListItemIcon>
          <ContactMailIcon />
        </ListItemIcon>
        <ListItemText primary="Tax Filing" />
      </ListItem>
    </NavLink>
  </div>
);

const logout = () => {
  alert("Hey");
  localStorage.jwt = '';
  localStorage.userID = '';
  localStorage.userName = '';
  localStorage.userEmail = '';
};

export const secondaryListItems = (
  <div>
    <NavLink exact style={{ "color": "black", "textDecoration": "none" }} to="/" onClick={logout}>
      <ListItem button>
        <ListItemIcon>
          <LockIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </NavLink>
  </div>
);