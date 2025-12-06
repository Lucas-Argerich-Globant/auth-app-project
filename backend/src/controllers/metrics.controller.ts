import type { Request, Response } from 'express'

async function getUserMetrics(req: Request, res: Response) {
  // Handle fetching user metrics logic here
}

async function getAdminMetrics(req: Request, res: Response) {
  // Handle fetching admin metrics logic here
}

export default { getUserMetrics, getAdminMetrics }
