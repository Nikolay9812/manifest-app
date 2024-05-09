import express from 'express'
import { create,getTors,deleteTor } from '../controllers/tor.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, create)
router.get('/gettors', verifyToken, getTors)
router.delete('/delete/:torId', verifyToken, deleteTor)


export default router