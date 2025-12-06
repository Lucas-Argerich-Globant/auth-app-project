import express from 'express'
import authRoutes from './routes/auth.routes.ts'
import metricsRoutes from './routes/metrics.routes.ts'
import errorMiddleware from './middlewares/error.middleware.ts'
import { auth } from './middlewares/auth.middleware.ts'

const app = express()

app.use(express.json())

app.use(auth)

app.use('/api/auth', authRoutes)
app.use('/api/metrics', metricsRoutes)

app.use(errorMiddleware)

export default app
