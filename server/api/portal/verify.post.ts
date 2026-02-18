import { defineEventHandler, readBody } from 'h3'
import fs from 'fs'
import path from 'path'

// Default access code (should be overridden via environment variable)
const DEFAULT_ACCESS_CODE = 'admin2024'

// Get access code from environment or use default
const PORTAL_ACCESS_CODE = process.env.PORTAL_ACCESS_CODE || DEFAULT_ACCESS_CODE

// Log directory
const LOG_DIR = path.join(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'portal-access.log')

function logAccess(ip: string, success: boolean) {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true })
    }

    const timestamp = new Date().toISOString()
    const logEntry = `${timestamp} | IP: ${ip} | Success: ${success}\n`

    fs.appendFileSync(LOG_FILE, logEntry)
  } catch (error) {
    console.error('Failed to log access:', error)
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code } = body

  // Get client IP
  const clientIP =
    event.node.req.headers['x-forwarded-for'] ||
    event.node.req.headers['x-real-ip'] ||
    event.node.req.socket?.remoteAddress ||
    'unknown'

  const success = code === PORTAL_ACCESS_CODE

  // Log the access attempt
  logAccess(String(clientIP), success)

  return {
    success,
  }
})
