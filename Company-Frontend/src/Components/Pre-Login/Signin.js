import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { SnackbarProvider, useSnackbar } from 'notistack'
import {useHistory,NavLink} from "react-router-dom";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


function SignIn() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    axios.post(`https://spit-hack.herokuapp.com/api/user/login`, {
      email: email,
      password: pass
    })
    .then(response => {
      const variant = 'success';
      enqueueSnackbar('Logged in successfully!', { variant });
      const data = response.data;
      localStorage.jwt = '';
      localStorage.userID = '';
      localStorage.userName = '';
      localStorage.userEmail = '';
      localStorage.jwt = data.token;
      localStorage.userID = data.user._id;
      localStorage.userName = data.user.name;
      localStorage.userEmail = data.user.email;

      setTimeout(function(){ 
        history.push("/dashboard"); 
      }, 2000);
      console.log(data);
    });
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange = {
              (Event) => setEmail(Event.target.value)
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange = {
              (Event) => setPass(Event.target.value)
            }
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <NavLink exact to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}


export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={1}>
      <SignIn />
    </SnackbarProvider>
  );
}