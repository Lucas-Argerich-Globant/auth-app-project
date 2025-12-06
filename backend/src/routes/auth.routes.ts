import { Router } from 'express'
import authController from '../controllers/auth.controller.ts'
import { requireAuth } from '../middlewares/auth.middleware.ts'

const router = Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/me', requireAuth, authController.getUser)

export default router
