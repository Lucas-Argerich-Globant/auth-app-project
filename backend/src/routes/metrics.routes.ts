import { Router } from 'express'
import metricsController from '../controllers/metrics.controller'

const router = Router()

router.get('/user', metricsController.getUserMetrics)
router.get('/admin', metricsController.getAdminMetrics)

export default router
