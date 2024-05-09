import express from 'express'
import { create,getPlates,deletePlate } from '../controllers/plate.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, create)
router.get('/getplates',verifyToken, getPlates)
router.delete('/delete/:plateId', verifyToken, deletePlate)
export default router