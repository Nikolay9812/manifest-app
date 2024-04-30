import express from 'express'
import { create,getStations } from '../controllers/station.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, create)
router.get('/getstantions',verifyToken, getStations)

export default router