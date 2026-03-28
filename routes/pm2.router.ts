import { Router } from 'express';
import { pm2Controller } from '../controllers/pm2.controller';

const router = Router();
const controller = pm2Controller();

router.get('/processes', async (req, res) => {
    const processes = await controller.getProcesses();
    res.json({ status: 'ok', processes });
});

router.get('/process/:pm2Id', async (req, res) => {
    const { pm2Id } = req.params;
    const { lines } = req.query;

    const details = await controller.getProcessDetails(pm2Id, lines as string);
    res.json({ status: 'ok', ...details });
});

router.get('/health/:processName', async (req, res) => {
    const { processName } = req.params;
    const report = await controller.checkHealth(processName);
    res.json(report);
});

export default router;