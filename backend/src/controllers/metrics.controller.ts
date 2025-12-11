import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.ts'

async function getUserMetrics(req: Request, res: Response) {
  const lastLoginMetricPromise = prisma.loginMetric.findFirst({
    where: {
      user_id: req.user!.id,
      success: true
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  const successfulLoginMetricsPromise = prisma.loginMetric.count({
    where: {
      user_id: req.user!.id,
      success: true
    }
  })

  const unsuccessfulLoginMetricsPromise = prisma.loginMetric.count({
    where: {
      user_id: req.user!.id,
      success: false
    }
  })

  // Run the queries on parallel to avoid unnecessary waits
  const [lastLoginMetric, successfulLoginMetrics, unsuccessfulLoginMetrics] = await Promise.all([
    lastLoginMetricPromise,
    successfulLoginMetricsPromise,
    unsuccessfulLoginMetricsPromise
  ])

  return res.status(200).json({
    status: 'success',
    data: {
      lastLogin: lastLoginMetric?.created_at ?? null,
      logins: {
        successful: successfulLoginMetrics,
        unsuccessful: unsuccessfulLoginMetrics
      }
    }
  })
}

async function getAdminMetrics(req: Request, res: Response) {
  const totalAccountsPromise = prisma.user.count()

  const activeAccountsPromise = prisma.user.count({
    where: {
      logins: {
        some: {
          created_at: {
            // Logged in within one week
            gt: new Date(Date.now() - new Date(0).setHours(24 * 7))
          }
        }
      }
    }
  })

  const successfulLoginMetricsPromise = prisma.loginMetric.count({
    where: {
      success: true
    }
  })

  const unsuccessfulLoginMetricsPromise = prisma.loginMetric.count({
    where: {
      success: false
    }
  })

  const accountNotFoundErrorsPromise = prisma.loginMetric.count({
    where: {
      success: false,
      error: 'EMAIL_ACCOUNT_NOT_FOUND'
    }
  })

  const incorrectPasswordErrorsPromise = prisma.loginMetric.count({
    where: {
      success: false,
      error: 'INCORRECT_PASSWORD'
    }
  })

  // Run the queries on parallel to avoid unnecessary waits
  const [
    totalAccounts,
    activeAccounts,
    successfulLoginMetrics,
    unsuccessfulLoginMetrics,
    accountNotFoundErrors,
    incorrectPasswordErrors
  ] = await Promise.all([
    totalAccountsPromise,
    activeAccountsPromise,
    successfulLoginMetricsPromise,
    unsuccessfulLoginMetricsPromise,
    accountNotFoundErrorsPromise,
    incorrectPasswordErrorsPromise
  ])

  return res.status(200).json({
    status: 'success',
    data: {
      account: {
        total: totalAccounts,
        active: activeAccounts
      },
      logins: {
        successful: { total: successfulLoginMetrics },
        unsuccessful: {
          total: unsuccessfulLoginMetrics,
          accountNotFound: accountNotFoundErrors,
          incorrectPassword: incorrectPasswordErrors
        }
      }
    }
  })
}

export default { getUserMetrics, getAdminMetrics }
