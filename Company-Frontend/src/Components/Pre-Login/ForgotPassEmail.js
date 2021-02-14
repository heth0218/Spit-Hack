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

const ForgotPassEmail = () => {
   
    const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [response,setResponse]= React.useState(false); //response from back end
  const [secretMessageText,setSecretMessageText]= React.useState("");
  const [answer,setAnswer]= React.useState("");
  
  
  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    fetch(`https://payroll-sys13.herokuapp.com/getSecretQuestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.success == 1)
      {
        setResponse(true); //if response from back end successfull
        setSecretMessageText(data.securityQues);
      }
      else {
        alert("Please try again")
      }
    });
    // history.push("/signup")
    
    
  }
   let secretMessage = (
        <div style={{marginTop:"1.5rem"}}>
            <form  onSubmit={onAnswerSubmit} noValidate>
            <Typography component="h3" variant="h5">
          Secret Security Question
        </Typography>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="secretQuestion"
                label=""
                name="secretquestion"
                type="text"
                autoComplete="off"
                autoFocus
                value={secretMessageText}
                disabled
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="ans"
                label="Answer"
                name="answer"
                type="text"
                autoComplete="off"
                autoFocus
                onChange={Event=>setAnswer(Event.target.value)}
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
    )
  function onAnswerSubmit(e) {
        e.preventDefault();
        fetch(`https://payroll-sys13.herokuapp.com/forgot_pass`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            secret: answer
          })
        })
        .then(res => res.json())
        .then(data => {
          if(data.success == 1)
          {
            localStorage.userEmail = email;
            localStorage.userID = data.user;
            history.push("/setNewPass");
          }
          else {
            alert("Bad input");
          }
        })
        // if(true){
        //     
        //     console.log(answer);
        // }
        
    }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Typography component="h3" variant="h5">
          Enter Email
        </Typography>
        <form className={classes.form} onSubmit={onFormSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Email"
            label="Email"
            name="email"
            type="email"
            autoComplete="off"
            autoFocus
            onChange = {
              (Event) => setEmail(Event.target.value)
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
        {
            response? secretMessage:""
            
        }
      </div>
    </Container>
  );
}

export default ForgotPassEmail;