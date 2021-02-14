import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import TimelineIcon from '@material-ui/icons/Timeline';
import Grid from '@material-ui/core/Grid'
import { SnackbarProvider, useSnackbar } from 'notistack';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Avatar, Container, CssBaseline, TextField, Typography } from '@material-ui/core';

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
    const [name, setName] = React.useState("");
    const [quantity, setQuantity] = React.useState(0)

    const onFormSubmit = (e) => {

        e.preventDefault();
        var data = JSON.stringify({ "name": name, "email": email, "stock": quantity });
        console.log(data)

        var config = {
            method: 'post',
            url: 'https://spit-hack.herokuapp.com/api/outlet/createOutlet',
            headers: {
                'x-auth-token': localStorage.getItem('jwt'),
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                const variant = 'success';
                enqueueSnackbar('Outlet added succesfully', { variant });
                setTimeout(function () {
                    history.push("/admin/dashboard");
                }, 2000);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Add a new outlet
          </Typography>
                <form className={classes.form} onSubmit={onFormSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="name"
                        label="Outlet Name"
                        id="name"
                        autoFocus
                        onChange={
                            (Event) => setName(Event.target.value)
                        }
                        autoComplete="name"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={
                            (Event) => setEmail(Event.target.value)
                        }
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type='number'
                        name="quantity"
                        label="Stock in Store"
                        id="quantity"
                        onChange={
                            (Event) => setQuantity(Event.target.value)
                        }
                        autoComplete="quantity"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Add Outlet
            </Button>
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
