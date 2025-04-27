const cron = require('node-cron');
const { subDays, startOfToday, endOfDay } = require('date-fns');
const connRequest = require('../models/connRequest');
const sendEmail = require('../utils/sendEmail');


cron.schedule('0 8 * * *', async () => {
    try {
        const yesterday = subDays(startOfToday(), 1);

        const startOfYesterday = startOfToday(yesterday);
        const endOfYesterday = endOfDay(yesterday);

        const pendingConnections = await connRequest.find({
            status: 'interested',
            createdAt: {
                $gte: startOfYesterday,
                $lt: endOfYesterday,
            },
        }).populate('fromUserId', 'toUserId');

        const listOfEmails = [...new Set(pendingConnections.map((req) => req.toUserId.emailId))];

        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run(
                    "New Friend Requests pending for " + email,
                    "Ther eare so many frined reuests pending, please login to DevTinder.in and accept or reject the reqyests."
                );
                console.log(`Email sent to ${email}:`, res);
            } catch (error) {
                console.error(`Error sending email to ${email}:`, error);
            }

        }


    } catch (error) {
        console.error('Error in cron job:', error);
    }
})