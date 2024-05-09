import express from 'express'
import { create,getStations,deleteStation } from '../controllers/station.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create',verifyToken, create)
router.get('/getstantions', verifyToken, getStations)
router.delete('/delete/:stationId', verifyToken, deleteStation)

export default router