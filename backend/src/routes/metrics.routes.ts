import { Router } from 'express'
import metricsController from '../controllers/metrics.controller.ts'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.ts'

const router = Router()

router.get('/user', requireAuth, metricsController.getUserMetrics)
router.get('/admin', requireAuth, requireRole('admin'), metricsController.getAdminMetrics)

export default router
