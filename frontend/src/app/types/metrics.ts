export type UserMetrics = {
  lastLogin: Date | null
  logins: {
    successful: number
    unsuccessful: number
  }
}

export type AdminMetrics = {
  account: {
    total: number
    active: number
  }
  logins: {
    successful: {
      total: number
    }
    unsuccessful: {
      total: number
      accountNotFound: number
      incorrectPassword: number
    }
  }
}
