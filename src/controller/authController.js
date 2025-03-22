const twilio = require("twilio");
const generateOTP = require("../utils/generateOTP");
const jwt = require("jsonwebtoken");
const User = require("../model/user-schema");
const { default: axios } = require("axios");

// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// console.log('check the client', client);


// exports.sendOTP = async (req, res) => {
//   const { phone } = req.body;
//   try {
//     const otp = generateOTP();
//     const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 2 mins expiry

//     let user = await User.findOne({ phone });
//     if (!user) {
//       user = new User({ phone, otp, otpExpires });
//     } else {
//       user.otp = otp;
//       user.otpExpires = otpExpires;
//     }

//     await user.save();
//     await client.messages
//   .create({
//     body: `Your OTP is: ${otp}`,
//     from: '+19472085480', 
//     to: `+91${phone}`,
//   })


//     res.json({ message: `OTP sent successfully to ${phone}` }); 
//   } catch (err) {
//     console.log('error====', err);
    
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// };

// exports.sendOTP = async (req, res) => {
//     const { phone } = req.body;
//     try {
//       const otp = generateOTP();
//       const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  
//       let user = await User.findOne({ phone });
//       if (!user) {
//         user = new User({ phone, otp, otpExpires });
//       } else {
//         user.otp = otp;
//         user.otpExpires = otpExpires;
//       }
  
//       await user.save();
  
//       const response = await axios.post(
//         'https://www.fast2sms.com/dev/bulkV2',
//         {
//           variables_values: otp,
//           route: 'otp',
//           numbers: phone,
//         },
//         {
//           headers: {
//             authorization: process.env.FAST2SMS_API_KEY,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//   console.log('response:::', response);
  
//       res.json({ message: `OTP sent successfully to ${phone}` });
//     } catch (err) {
//       console.log("Fast2SMS error:", err.response?.data || err.message);
//       res.status(500).json({ error: "Failed to send OTP" });
//     }
//   };

exports.sendOTP = async (req, res) => {
    const { phone } = req.body;
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 mins
  
    try {
      let user = await User.findOne({ phone });
      if (!user) user = new User({ phone, otp, otpExpires });
      else {
        user.otp = otp;
        user.otpExpires = otpExpires;
      }
  
      await user.save();
  
      const url = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/+91${phone}/${otp}/OTP`;
  
      await axios.get(url);
  
      res.json({ message: `OTP sent to ${phone}` });
    } catch (err) {
      console.error("2Factor error:", err.response?.data || err.message);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  };

exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Phone verified successfully", token });
  } catch (err) {
    console.log('err', err);
    
    res.status(500).json({ error: "OTP verification failed" });
  }
};
