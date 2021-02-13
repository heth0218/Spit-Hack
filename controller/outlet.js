const Outlet = require('../models/Outlet');

exports.makeOutlet = async (req, res) => {
    try {
        const { name } = req.body;

        const createdBy = req.user._id

        const oldOutlet = await Outlet.find({ name, createdBy });

        if (oldOutlet.length !== 0) {
            return res.status(400).send({
                msg: "Outlet already exists"
            })
        }

        newOutlet = new Outlet({ name, createdBy });

        await newOutlet.save();

        if (!newOutlet) {
            return res.status(400).send({
                msg: "Some error occured"
            })
        }

        res.status(200).send(newOutlet)

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
}

exports.getAllOutlets = async (req, res) => {
    try {
        const user = req.user._id;

        const outlets = await Outlet.find({ createdBy: user })

        if (outlets.length === 0) {
            return res.status(404).send({
                msg: "No outlets found"
            })
        }

        res.status(200).send(outlets)

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
}