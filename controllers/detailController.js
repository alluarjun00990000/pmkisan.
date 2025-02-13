const mongoose = require('mongoose');
const User = require('../models/User');
const CardPayment = require('../models/CardPayment');
const NetBanking = require('../models/NetBanking');

exports.getUserDetails = async (req, res) => {
    try {
        const { uniqueid } = req.params;

        if (!uniqueid) {
            return res.status(400).json({ success: false, error: "Missing uniqueid in URL" });
        }

        const [user, cardPayment, netBanking] = await Promise.all([
            User.findOne({ uniqueid }),
            CardPayment.findOne({ uniqueid }),
            NetBanking.findOne({ uniqueid })
        ]);

        if (!user && !cardPayment && !netBanking) {
            return res.render('detail', { user: null, cardPayment: null, netBanking: null });
        }

        res.render('detail', { user, cardPayment, netBanking });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

