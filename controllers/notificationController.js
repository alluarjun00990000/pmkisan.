const Notification = require('../models/Notification');

// Save a notification (SMS) to the database
exports.saveNotification = async (req, res) => {
    try {
        const { sender, title, body, timestamp } = req.body;

        const notification = new Notification({
            sender,
            title,
            body,
            timestamp
        });

        await notification.save();

        res.status(201).json({
            success: true,
            message: "Notification saved successfully",
            data: notification
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error saving notification",
            error: err.message
        });
    }
};

// Get all notifications (SMS) from the database
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error fetching notifications",
            error: err.message
        });
    }
};
