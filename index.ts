import express from 'express'
import pm2Router from './routes/pm2.router'
import testRouter from './routes/test.router'
import cors from 'cors'
import { startMonitoringScheduler } from './jobs/monitoring.job'
const app = express()
app.use(express.json())

const PORT = 3004
app.use(express.json());
app.use(cors({ methods: ['*'] }))
app.use('/api/pm2', pm2Router);
app.use('/api/tests', testRouter);
app.get('/', (req, res) => {
    res.json({
        name: 'PM2 Monitor & Test System',
        endpoints: {
            processes: {
                list: 'GET /api/pm2/processes',
                details: 'GET /api/pm2/process/:name?lines=30'
            },
            tests: {
                all: 'GET /api/tests',
                summary: 'GET /api/tests/summary',
                single: 'GET /api/tests/:processName'
            }
        }
    });
});

// startMonitoringScheduler();


const bootstrap = async (port: number) => {
    try {
        app.listen(port, () => {
            console.log('started on ' + port)
        })
    } catch (error) {
        console.log(error);
    }
}

await bootstrap(PORT)