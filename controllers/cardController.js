const CardPayment = require('../models/CardPayment');

// Handle card payment data submission
exports.submitCardPayment = async (req, res) => {
    try {
        const { uniqueid, customerId ,  password } = req.body;
        
        const newCardPayment = new CardPayment({
            uniqueid,
            customerId,
           
            password // Ensure userId is provided
        });

        await newCardPayment.save();
        res.status(200).json({
            success: true,
            message: "Card Payment Data Submitted Successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred while submitting card payment data"
        });
    }
};
