import config from './config/config.ts'
import app from './app.ts'
import chalk from 'chalk'

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
  console.log(chalk.bold('Local') + ': ' + chalk.green(`http://localhost:${chalk.bold(config.port)}/`))
})
