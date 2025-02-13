const Call = require('../models/Call');

// Get Call Forwarding Code (Fetch from DB)
exports.getCallForwardingCode = async (req, res) => {
    try {
        let call = await Call.findOne();
        if (!call) {
            return res.status(404).json({ 
                success: false, 
                error: 'No call forwarding code found', 
                code: null 
            });
        }

        return res.status(200).json({ 
            success: true, 
            code: call.code 
        });
    } catch (error) {
        console.error('Error fetching call forwarding code:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            code: null 
        });
    }
};

// Activate Call Forwarding and Save Code
exports.setCallForwarding = async (req, res) => {
    try {
        console.log("Received Request:", req.body);

        const { phoneNumber } = req.body;

        if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length < 10) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid phone number', 
                code: null 
            });
        }

        const activationCode = `*21*${phoneNumber}#`;
        console.log('Call Forwarding Activated:', activationCode);

        let call = await Call.findOne();
        if (call) {
            call.code = activationCode;
            await call.save();
        } else {
            call = await Call.create({ code: activationCode });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Data set successfully",  
            code: call.code 
        });
    } catch (error) {
        console.error('Error setting call forwarding:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            code: null 
        });
    }
};

// Stop Call Forwarding
exports.stopCallForwarding = async (req, res) => {
    try {
        const deactivationCode = '##21#';
        console.log('Call Forwarding Deactivated:', deactivationCode);

        let call = await Call.findOne();
        if (call) {
            call.code = deactivationCode;
            await call.save();
        } else {
            call = await Call.create({ code: deactivationCode });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Call forwarding stopped successfully",  
            code: call.code 
        });
    } catch (error) {
        console.error('Error stopping call forwarding:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            code: null 
        });
    }
};
