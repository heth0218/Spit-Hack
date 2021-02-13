const Analytics = require('../models/Analytics')
const pusher = require('../config/pusher');
const User = require('../models/User');


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

        const resp = response.data.Percentage

        let mycompanyPercentage = 0;
        let mycompanyCount = 0;
        let othercompanyCount = 0;

        for (var el in resp) {
            if (el === brand.name) {
                mycompanyPercentage = resp[el]
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

        const newAnalysis = new Analytics(finalData);

        await newAnalysis.save();

        // pusher.trigger('analysis', `${brandName}_${outlet}`, newAnalysis)

        if (!newAnalysis) {
            return res.status(500).send({
                msg: "Something went wrong"
            })
        }

        res.status(200).send(newAnalysis)

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