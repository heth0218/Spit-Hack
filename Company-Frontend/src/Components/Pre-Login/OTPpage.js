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
import {useHistory} from "react-router-dom";
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

const OTPpage = () => {
    const classes = useStyles();
  const history = useHistory();
  const [OTP, setOTP] = React.useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(OTP);
    fetch(`https://payroll-sys13.herokuapp.com/verifyToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: localStorage.userEmail,
        token: OTP
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.success == 1)
        history.push("/admin/existingEmp")
      else
        alert("Wrong OTP")
    })
    // history.push("/signup")
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enter OTP
        </Typography>
        <br/>
        <Typography component="h3" variant="h5">
          OTP has been sent to your email
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="otp"
            label="One Time Pass"
            name="otp"
            type="password"
            autoComplete="off"
            autoFocus
            onChange = {
              (Event) => setOTP(Event.target.value)
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default OTPpage;