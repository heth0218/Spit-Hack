import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';


const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function SimpleCard() {
    const classes = useStyles();
    const history = useHistory();
    const [outlets, setOutlets] = useState([{}]);
    useEffect(() => {
        const config = {
            method: "GET",
            url: `https://spit-hack.herokuapp.com/api/outlet/getOutlets`,
            headers: {
                'x-auth-token': localStorage.jwt,
                'Content-Type': 'application/json',
            }
        };

        axios(config).then(response => {
            console.log(response.data)
            setOutlets(response.data);
            localStorage.setItem('outlet1', response.data[0]._id);
            localStorage.setItem('outlet2', response.data[1]._id);
            localStorage.setItem('outlet1_name', response.data[0].name);
            localStorage.setItem('outlet2_name', response.data[1].name);
        })
    }, []);

    const showAnalytics = (id) => {
        console.log(id);
        localStorage.outletID = id;
    }
    return (
        <>
            <Grid container justify="center">
                <Grid xs={12}>
                    <Typography variant="h5" component="h4">
                        My Outlets
                    </Typography>
                </Grid>
                <br /><br />
                {outlets.map((outlet) => (
                    <Grid item xs={4} key={outlet._id} style={{ margin: 10 }}>
                        <Card className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h4">
                                    {outlet.name}
                                </Typography>
                                <br />
                                <Typography className={classes.pos} color="textSecondary">
                                    <strong>Email: </strong>{outlet.email} <br />
                                    <strong>Current Stocks: </strong> {outlet.stock}
                                </Typography>


                            </CardContent>
                            <br />
                            <CardActions>
                                <a href='/my-analytics'>
                                    <Button onClick={() => showAnalytics(outlet._id)} size="small" color="primary">
                                        View Analytics
                                    </Button>
                                </a>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}