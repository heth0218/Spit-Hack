import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useHistory,NavLink} from "react-router-dom";


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


export default function SetNewPass() {
  const classes = useStyles();
  const history = useHistory();
  const [password, setPassword] = React.useState("");
  const [reEnterPass, setReEnterPass] = React.useState("");
  const [errorM,setErrorM]= React.useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    if(password!=reEnterPass){
        setErrorM("Both the passwords don't match!");
    }else{
        fetch(`https://payroll-sys13.herokuapp.com/update_password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: localStorage.userID,
            password: password
          })
        })
        .then(res => res.json())
        .then(data => {
          if(data.success == 1)
          {
            alert("Password reset done!")
            history.push("/");
          }
          else {
            setErrorM("Server error");
          }
        })
        
    }
    
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="New Password"
            name="password"
            type="password"
            autoFocus
            onChange = {
              (Event) => setPassword(Event.target.value)
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="reEnterPass"
            label="Re-Enter New Password"
            type="password"
            id="repassword"
            onChange = {
              (Event) => setReEnterPass(Event.target.value)
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
            Change Password
          </Button>
          <Typography component="h1" variant="h5">
          {errorM}
        </Typography>
        </form>
      </div>
    </Container>
  );
}