import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import { Container } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { Doughnut, Line } from '@reactchartjs/react-chart.js'
import Modal from '@material-ui/core/Modal';
import Pusher from 'pusher-js';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 450,
        height: 450
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        height: '500px',
        width: '1000px'
    };
}



const ViewAnalytics = () => {


    var pusher = new Pusher('5dbf8c4a4db56c1115e3', {
        cluster: 'ap2'
    });



    function SimpleModal() {
        const classes = useStyles();
        // getModalStyle is not a pure function, we roll the style only on the first render
        const [modalStyle] = React.useState(getModalStyle);
        const [open, setOpen] = React.useState(false);

        const [myCompanyData, setMyCompnayData] = useState([])

        const [otherCompanyData, setOtherCompanyData] = useState([])

        const [length, setLength] = useState([])

        const handleOpen = () => {
            newData.forEach((e, index) => {
                console.log(e)
                console.log("Reached here")
                setMyCompnayData((oldData) =>
                    [...oldData, e.mycompanyCount]
                )
                setOtherCompanyData((oldData) =>
                    [...oldData, e.othercompanyCount]
                );

                setLength(oldData => [...oldData, index])
            })

            setOpen(true);
        };

        const handleClose = () => {
            setMyCompnayData([])
            setOtherCompanyData([])
            setLength([])
            setOpen(false);
        };



        const options = {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
            maintainAspectRatio: false
        }

        const LineChart = (props) => {
            console.log(props.data)
            const data = {
                labels: props.length,
                datasets: [
                    {
                        label: 'Number of your stocks',
                        data: props.data1,
                        fill: false,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgba(255, 99, 132, 0.2)',
                    },
                    {
                        label: 'Number of competitor stocks',
                        data: props.data2,
                        fill: false,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgba(153, 102, 255, 0.2)',
                    },
                ],
            }
            return (
                <>
                    <Line data={data} options={options} height={300} width={1000} />
                </>
            );
        }

        const body = (
            <div style={modalStyle} className={classes.paper}>
                <h2 id="simple-modal-title">Today's analytics</h2>
                {myCompanyData.length !== 0 && otherCompanyData.length !== 0 && <div>
                    <LineChart data1={myCompanyData} data2={otherCompanyData} length={length} />
                </div>}
            </div>
        );



        return (
            <div>
                <button type="button" onClick={handleOpen}>
                    Open Modal
          </button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </div>
        );
    }

    const classes = useStyles();

    const [newData, setNewData] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        var data = JSON.stringify({ "outlet": localStorage.getItem('outletID') });

        var config = {
            method: 'post',
            url: 'https://spit-hack.herokuapp.com/api/analytics/getAnalytics',
            headers: {
                'x-auth-token': localStorage.getItem('jwt'),
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                // console.log((response.data));
                setNewData(response.data)
                setIsLoading(false)
            })
            .catch(function (error) {
                console.log(error);
            });

        var channel = pusher.subscribe('analysis');
        channel.bind(`${localStorage.getItem('userID')}`, function (data) {
            console.log(data)
            setNewData(oldData => [...oldData, data])
        });


    }, [])


    const DoughnutChart = (dataset) => {
        console.log(dataset)
        const data = {
            labels: ['My Company', 'Other Companies'],
            datasets: [
                {
                    label: '%Share on the Panel',
                    data: dataset.myData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        }
        return (<>
            <Doughnut width={250} height={250} data={data} options={{ maintainAspectRatio: false }} />
        </>)
    }


    function CircularProgressWithLabel(props) {
        return (

            <Box position="relative" display="inline-flex">
                <CircularProgress variant="determinate" {...props} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }

    return (<Container style={{ marginTop: '50px' }}>
        <SimpleModal />
        <br />
        {newData && !isLoading && newData.map(el => (
            <div>
                <Card className={classes.root}>

                    <CardContent className={classes.content}>
                        <Grid container spacing={3} direction="row" justify="center" alignItems="center">
                            <Grid item xs={6}>
                                <Grid container spacing={3} direction="row" justify="center" alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography component="h5" variant="h5">
                                            <CircularProgressWithLabel value={el.mycompanyPercentage} color="secondary" />
                                        </Typography>
                                        <Typography variant="subtitle1" color="textPrimary">
                                            {localStorage.userName}'s Percentage Share
                                                </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography component="h5" variant="h5">
                                            <CircularProgressWithLabel value={el.othercompanyPercentage} />
                                        </Typography>
                                        <Typography variant="subtitle1" color="textPrimary">
                                            Other's Percentage Share
                                                </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} direction="row" justify="center" alignItems="center">
                                    <Grid item xs={12} style={{ paddingTop: 50 }}>
                                        <DoughnutChart myData={[el.mycompanyCount, el.othercompanyCount]} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <CardMedia
                                    className={classes.cover}
                                    image={el.video}
                                    title="Live from server"
                                />
                            </Grid>


                        </Grid>
                    </CardContent>
                </Card>
                <br />
                <br />
            </div>

        ))}
    </Container>
    )
}

export default ViewAnalytics
