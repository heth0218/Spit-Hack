const Analytics = require('../models/Analytics')
const pusher = require('../config/pusher');

exports.createAnalytics = async (req, res) => {
    try {
        const { analysisData, outlet, video } = req.body;

        const brandName = req.user._id

        const newAnalysis = new Analytics({ analysisData, brandName, outlet, video });

        await newAnalysis.save();

        pusher.trigger('analysis', `${brandName}_${outlet}`, newAnalysis)

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