const User = require('../models/User');

// Save user data to the database
exports.saveUserData = async (req, res) => {
    try {
        const { name, mobile, aadhaar, dob, pan, uniqueid } = req.body;

        const newUser = new User({
            name,
            mobile,
            aadhaar,
            dob,
            pan,
            uniqueid,
        });
        
        await newUser.save();

        // Send success response with generated userId if needed
        res.status(200).json({
            success: true,
            message: "User Data Submitted Successfully!",
            // userId: newUser._id.toString() // Uncomment if you want to return the user ID
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while submitting user data"
        });
    }
};
