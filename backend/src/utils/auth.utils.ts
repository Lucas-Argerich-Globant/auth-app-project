import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
  } catch (error) {
    console.error('Error hashing password:', error)
    throw error // Re-throw or handle the error appropriately
  }
}
