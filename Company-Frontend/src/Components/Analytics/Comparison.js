import React, { useEffect, useState } from 'react'
import { Container } from '@material-ui/core';
import { Doughnut, Line } from '@reactchartjs/react-chart.js'


const Comparison = () => {

    const [outlet1, setOutlet1] = useState();
    const [outlet2, setOutlet2] = useState()
    const [myCompanyData, setMyCompnayData] = useState([])

    const [otherCompanyData, setOtherCompanyData] = useState([])

    const [myCompanyData1, setMyCompnayData1] = useState([])

    const [otherCompanyData1, setOtherCompanyData1] = useState([])

    const [length, setLength] = useState([])
    const [length1, setLength1] = useState([])


    const hello = async () => {
        var axios = require('axios');
        var data = JSON.stringify({ "outlet": localStorage.getItem('outlet1') });

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
            .then(async function (response) {
                console.log((response.data));
                setOutlet1(response.data)
                response.data.forEach((e, index) => {
                    console.log(e)
                    console.log("Reached here")
                    setMyCompnayData((oldData) =>
                        [...oldData, e.mycompanyPercentage]
                    )
                    setOtherCompanyData((oldData) =>
                        [...oldData, e.othercompanyPercentage]
                    );

                    setLength(oldData => [...oldData, index])
                })
                console.log(outlet1)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const hello2 = async () => {
        var axios = require('axios');
        var data = JSON.stringify({ "outlet": localStorage.getItem('outlet2') });

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
            .then(async function (response) {
                console.log((response.data));
                setOutlet2(response.data)
                response.data.forEach((e, index) => {
                    console.log(e)
                    console.log("Reached here")
                    setMyCompnayData1((oldData) =>
                        [...oldData, e.mycompanyPercentage]
                    )
                    setOtherCompanyData1((oldData) =>
                        [...oldData, e.othercompanyPercentage]
                    );

                    setLength1(oldData => [...oldData, index])
                })
                console.log(outlet2)
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    useEffect(() => {
        hello()
        hello2()
    }, [])

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
                    label: 'Percentage of your stocks',
                    data: props.data1,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    label: 'Percentage of competitor stocks',
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


    return (
        <div>
            <Container>
                <h2 id="simple-modal-title"> Comparison Analysis of { localStorage.getItem('outlet1_name') } and { localStorage.getItem('outlet2_name') } </h2>
                <br/>
                {myCompanyData.length !== 0 && otherCompanyData.length !== 0 && <div>
                    <LineChart data1={myCompanyData} data2={otherCompanyData} length={length} />
                </div>}
                <br/>
                {myCompanyData1.length !== 0 && otherCompanyData1.length !== 0 && <div>
                    <LineChart data1={myCompanyData1} data2={otherCompanyData1} length={length1} />
                </div>}
            </Container>
        </div>
    )
}

export default Comparison
