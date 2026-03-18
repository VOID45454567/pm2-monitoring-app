import express from 'express'
import pm2Router from './routes/pm2.router'
import testRouter from './routes/test.router'
const app = express()
app.use(express.json())

const PORT = 3000
app.use(express.json());
app.use('/api/pm2', pm2Router);
app.use('/api/tests', testRouter);

app.get('/', (_, res) => {
    res.json({
        name: 'PM2 Monitor & Test System',
        version: '1.0.0',
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


const bootstrap = (port: number) => {
    try {
        app.listen(port, () => {
            console.log('started on ' + port);
        })
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

bootstrap(PORT)