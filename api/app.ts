/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { authMiddleware } from './src/middleware/auth.ts'
import proposalRoutes from './src/routes/proposals.ts'
import voteRoutes from './src/routes/votes.ts'
import commentRoutes from './src/routes/comments.ts'
import watchRoutes from './src/routes/watches.ts'
import userRoutes from './src/routes/user.ts'
import changelogRoutes from './src/routes/changelog.ts'
import adminRoutes from './src/routes/admin.ts'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(authMiddleware)

/**
 * API Routes
 */
app.use('/api/proposals', proposalRoutes)
app.use('/api/votes', voteRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/watches', watchRoutes)
app.use('/api/user', userRoutes)
app.use('/api/changelog', changelogRoutes)
app.use('/api/admin', adminRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
