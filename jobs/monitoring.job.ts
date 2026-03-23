import cron from 'node-cron';
import { checkAndSendProblems } from '../services/notification.service';

export const startMonitoringScheduler = () => {
    console.log('Запуск планировщика мониторинга');

    cron.schedule('0 * * * *', async () => {
        await checkAndSendProblems();
    });

    setTimeout(() => {
        console.log('Первоначальная проверка');
        checkAndSendProblems();
    }, 5000);

    console.log('Планировщик запущен. Проверка каждые 1 час');
};

export const startMonitoringForTest = () => {
    console.log('Тестовый режим: проверка каждые 5 минут');
    cron.schedule('*/5 * * * *', async () => {
        await checkAndSendProblems();
    });
};