import express from 'express'
import { create,getTors } from '../controllers/tor.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, create)
router.get('/gettors',verifyToken, getTors)

export default router