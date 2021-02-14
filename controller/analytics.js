const Analytics = require('../models/Analytics')
const pusher = require('../config/pusher');
const User = require('../models/User');
const Outlet = require('../models/Outlet')

const accountSid = 'ACd9c13445898ed1dd3eab89f9d4fb99ac';
const authToken = '1d61c5297575d818f055f6242562855d';
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

async function sms(name) {

    const message = await client.messages.create({
        to: '+918850356911',
        from: '+12057758148',
        body: `Hello, ${name} is having a little dull day as we figure out calculating % of negative score.Make ${name}'s day a little better and hope you have one too!`,
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

        res.status(200).send(newAnalysis)

        pusher.trigger('analysis', `${brandName}`, newAnalysis)

        const name = "Heth"

        sms({ name, negative })
            .then(() => {
                console.log("SMS sent!");
            })

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