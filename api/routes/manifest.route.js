import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { createManifest,  } from '../controllers/manifest.controller.js'

const router = express.Router()

router.post('/create',verifyToken, createManifest)

export default router