import { Router } from 'express'
import authController from '../controllers/auth.controller.ts'

const router = Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/me', authController.getUser)

export default router
