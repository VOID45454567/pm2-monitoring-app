import cron from 'node-cron';
import { mailController } from '../controllers/mail.controller';

const controller = await mailController()

export const startMonitoringScheduler = () => {
    console.log('Запуск планировщика мониторинга');

    cron.schedule('*/30 * * * *', async () => {
        await controller.checkAndSendProblems()
    });
    console.log('Планировщик запущен. Проверка каждые 30 минут');
};

// export const startMonitoringForTest = () => {
//     console.log('Тестовый режим - каждые 5 минут');
//     cron.schedule('*/5 * * * *', async () => {
//         await checkAndSendProblems();
//     });
// };