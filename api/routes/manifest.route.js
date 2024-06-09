import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { createManifest, getManifests,deleteCurrentManifest, deleteManifest,approveManifest, updateManifest, getUserManifests, getAllManifests } from '../controllers/manifest.controller.js'

const router = express.Router()

router.post('/create', verifyToken, createManifest)
router.put('/approvemanifest/:manifestId/:userId',verifyToken, approveManifest);
router.get('/getmanifests',verifyToken, getManifests)
router.get('/getallmanifests',verifyToken, getAllManifests)
router.get('/getusermanifests',verifyToken, getUserManifests)
router.delete('/deletemanifest/:manifestId/:userId', verifyToken, deleteManifest)
router.delete('/delete/:manifestId', verifyToken, deleteCurrentManifest)
router.put('/updatemanifest/:manifestId/:userId', verifyToken, updateManifest)

export default router