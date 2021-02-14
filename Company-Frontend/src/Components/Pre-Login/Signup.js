import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { SnackbarProvider, useSnackbar } from 'notistack'
import { useHistory, NavLink } from 'react-router-dom';
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUp() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const history = useHistory();
  const [name,setName] = React.useState("");
  const [email, setEmail]=React.useState("");
  const [pass, setPass]=React.useState("");

  const onFormSubmit= (e)=> {
    e.preventDefault();
    console.log(name,email,pass);
    axios.post(`https://spit-hack.herokuapp.com/api/user/register`, {
      name: name,
      email: email,
      password: pass
    }).then((result) => {
      console.log(result.data);
      const data = result.data;
      const variant = 'success';
      enqueueSnackbar('Account created successfully!', { variant });
      localStorage.jwt = data.token;
      localStorage.userID = data.user._id;
      localStorage.userName = data.user.name;
      localStorage.userEmail = data.user.email;
      
      setTimeout(function(){ 
        history.push("/dashboard"); 
      }, 2000);
    })
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                onChange={Event=>setName(Event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange ={
                  Event => setEmail(Event.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange ={
                  Event => setPass(Event.target.value)
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <NavLink exact to="/" variant="body2">
                Already have an account? Sign in
              </NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <br/>
    </Container>
  );
}


export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={1}>
      <SignUp />
    </SnackbarProvider>
  );
}