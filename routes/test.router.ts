import { Router } from 'express';
import { testController } from '../controllers/test.controller';

const router = Router();
const controller = testController();

router.get('/', async (_, res) => {
    const tests = await controller.getAllTests();
    res.json(tests);
});

router.get('/summary', async (_, res) => {
    const summary = await controller.getTestSummary();
    res.json(summary);
});

router.get('/:processName', async (req, res) => {
    const { processName } = req.params;
    try {
        const test = await controller.getTestForProcess(processName);
        res.json(test);
    } catch (error) {
        res.status(404).json({
            error: error instanceof Error ? error.message : 'Service not found'
        });
    }
});

export default router;