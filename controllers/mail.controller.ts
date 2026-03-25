import { getHtmlForMessage, mailOptions, sendMail, transporter } from "../utils/mail"
import { testController } from "./test.controller"

const testsController = testController()

export const mailController = async () => ({
    async checkAndSendProblems() {
        console.log(`[${new Date().toISOString()}] проверка состояния`);
        const summary = await testsController.getTestSummary()

        if (summary.problems.length === 0) {
            console.log('problems not found, no message');
        }

        mailOptions.html = getHtmlForMessage(summary)
        sendMail(transporter, mailOptions)
    }
})