import express from "express";
import { checkAndSendProblems } from "../services/notification.service";

const mailRouter = express.Router();

mailRouter.post('/send-error-message', async (req, res) => {
    try {
        await checkAndSendProblems();
        res.json({ status: 'ok', message: 'Check completed' });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default mailRouter;