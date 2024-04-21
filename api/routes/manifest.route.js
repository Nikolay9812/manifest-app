import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { createManifest,getManifests,deleteManifest,updateManifest } from '../controllers/manifest.controller.js'

const router = express.Router()

router.post('/create',verifyToken, createManifest)
router.get('/getmanifests', getManifests)
router.delete('/deletemanifest/:manifestId/:userId',verifyToken,deleteManifest)
router.put('/updatemanifest/:manifestId/:userId',verifyToken,updateManifest)

export default router