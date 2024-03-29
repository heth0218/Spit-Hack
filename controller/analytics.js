const Analytics = require('../models/Analytics')
const pusher = require('../config/pusher');
const User = require('../models/User');
const Outlet = require('../models/Outlet')

const accountSid = 'AC831e04a54d1d1bb5200754644c81217d';
const authToken = '488e92d447cb7dab48975ee02d1387a9';
const client = require('twilio')(accountSid, authToken);

const datamanipulation = async (response, brand, brandName, video) => {

    const resp = response.data.Percentage

    let mycompanyPercentage = 0;
    let mycompanyCount = 0;
    let othercompanyCount = 0;
    let othercompanyPercentage = 0;

    for (var el in resp) {
        if (el === brand.name) {
            mycompanyPercentage = resp[el]
        } else {
            othercompanyPercentage = othercompanyPercentage + resp[el]
        }
    }

    const res2 = response.data['Total Count'];

    for (var el in res2) {
        if (el !== brand.name) {
            othercompanyCount = othercompanyCount + res2[el]
        }
        else {
            mycompanyCount = res2[el]
        }

    }

    const finalData = {
        mycompanyPercentage,
        mycompanyCount,
        othercompanyPercentage: 100 - mycompanyPercentage,
        othercompanyCount,
        brandName,
        video,
        outlet: '6027ce39fbddf00ac016e39d'
    }

    return finalData

}

const sms = async (name) => {
    console.log(name)
    const message = await client.messages.create({
        messagingServiceSid: 'MG6f2e8e0a58c510249dc608ba0bbe58ab',
        to: '+919082974316',
        body: `Hey the company ${name} stock has been reduced below the threshhold limits`,
        // mediaUrl: 'https://climacons.herokuapp.com/clear.png',
    });
    return message;
};

exports.createAnalytics = async (req, res) => {
    try {
        const { video } = req.body;

        const brandName = req.user._id;

        const brand = await User.findById(brandName)

        console.log(brand.name)

        const axios = require('axios')
        var FormData = require('form-data');
        var data = new FormData();
        data.append('query', video);

        var config = {
            method: 'post',
            url: 'https://final-lead.herokuapp.com/uploader',
            headers: {
                ...data.getHeaders()
            },
            data: data
        };

        const response = await axios(config)

        console.log(response.data)

        const finalData = await datamanipulation(response, brand, brandName, video)

        const newAnalysis = new Analytics(finalData);

        await newAnalysis.save();


        if (!newAnalysis) {
            return res.status(500).send({
                msg: "Something went wrong"
            })
        }



        if (newAnalysis.mycompanyPercentage <= 25) {
            sms(brand.name)
                .then(() => {
                    console.log("SMS sent!");
                })
        }


        res.status(200).send(newAnalysis)

        pusher.trigger('analysis', `${brandName}`, newAnalysis)


    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
}

exports.getAnalytics = async (req, res) => {
    try {

        const { outlet } = req.body

        const user = req.user._id;

        if (!user) {
            return res.status(400).send({
                msg: "Token not attached"
            })
        }

        const analytics = await Analytics.find({ brandName: user, outlet })

        if (analytics.length === 0) {
            return res.status(404).send({
                msg: "No analytics found"
            })
        }

        res.status(200).send(analytics)

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
}

exports.getLatestAnalytics = async (req, res) => {
    try {
        const { companyName, outlets } = req.body;

        console.log(req.body)

        const company = await User.findOne({ name: companyName });

        const companyOutlet = await Outlet.findOne({ name: outlets })

        const latestDetails = await Analytics.find({ brandName: company._id, outlet: companyOutlet._id });

        if (latestDetails.length === 0) {
            return res.status(404).send({
                msg: "No data found"
            })
        }

        res.status(200).send(latestDetails[latestDetails.length - 1])

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
}