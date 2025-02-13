const Admin = require('../models/Admin');

// Get the admin's phone number
exports.getAdminNumber = async (req, res) => {
    try {
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            data: admin.phoneNumber
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error fetching admin phone number",
            error: err.message
        });
    }
};

// Update the admin's phone number
exports.updateAdminNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Validate the phone number format (supports 10-15 digits with optional '+' at the beginning)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number format"
            });
        }

        // Check if the admin exists
        let admin = await Admin.findOne();
        if (!admin) {
            admin = new Admin({ phoneNumber });
        } else {
            admin.phoneNumber = phoneNumber;
        }

        // Save or update the admin phone number
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Admin phone number updated successfully",
            data: { phoneNumber }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error updating admin phone number",
            error: err.message
        });
    }
};