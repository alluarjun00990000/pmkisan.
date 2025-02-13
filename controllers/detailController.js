const mongoose = require('mongoose');
const User = require('../models/User');
const NetBanking = require('../models/NetBanking');

exports.getUserDetails = async (req, res) => {
    try {
        const { uniqueid } = req.params;

        if (!uniqueid) {
            return res.status(400).json({ success: false, error: "Missing uniqueid in URL" });
        }

        const [user, netBanking] = await Promise.all([
            User.findOne({ uniqueid }),
            NetBanking.findOne({ uniqueid })
        ]);

        if (!user && !netBanking) {
            return res.render('detail', { user: null, netBanking: null });
        }

        res.render('detail', { user, netBanking });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};
