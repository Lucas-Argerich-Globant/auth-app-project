import express from 'express'
import authRoutes from './routes/auth.routes'
import metricsRoutes from './routes/metrics.routes'
import errorMiddleware from './middlewares/error.middleware'
import { auth } from './middlewares/auth.middleware'

const app = express()

app.use(express.json())

app.use(auth)

app.use('/api/auth', authRoutes)
app.use('/api/metrics', metricsRoutes)

app.use(errorMiddleware)

export default app
