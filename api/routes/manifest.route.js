import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { createManifest, getManifests, deleteManifest, updateManifest, getUserManifests, getAllManifests } from '../controllers/manifest.controller.js'

const router = express.Router()

router.post('/create', verifyToken, createManifest)
router.get('/getmanifests',verifyToken, getManifests)
router.get('/getallmanifests',verifyToken, getAllManifests)
router.get('/getusermanifests',verifyToken, getUserManifests)
router.delete('/deletemanifest/:manifestId/:userId', verifyToken, deleteManifest)
router.put('/updatemanifest/:manifestId/:userId', verifyToken, updateManifest)

export default router