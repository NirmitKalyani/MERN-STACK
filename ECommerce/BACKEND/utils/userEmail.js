require("dotenv").config()
const nodeEmailer = require("nodemailer");

async function sendEmail(userEmail, productArray) {
    const transporter = nodeEmailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.NODE_EMAIL,
            pass:process.env.NODE_PASS
        }
    });

    const productDetails = productArray.map((product, index)=>{
        `${index + 1}.Name: ${product.Name}, Price: ${product.price}`
    })

    const mailOptions = {
        from:process.env.NODE_EMAIL,
        to:userEmail,
        subject:"Your Order Details",
        text:`Thank you for your purchase \n\n here is your product details ${productDetails}`
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmail,
}