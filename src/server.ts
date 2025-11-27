import { createApp } from './app'

const host = process.env.HOST || 'http://localhost'
const port = process.env.PORT || 3000
const app = createApp()

app.listen(port, () => {
  console.log(`Server listening on ${host}:${port}`)
})
