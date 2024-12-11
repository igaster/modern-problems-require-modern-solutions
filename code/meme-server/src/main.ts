import cors from 'cors'
import express, { Express } from 'express'

import { findMatch } from './matcher.js'

/* Create the Express app */
const app: Express = express()

/* Use JSON */
app.use(express.json())

/* Enable CORS */
app.use(cors())
app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

/* Home route with a status message */
app.get('/', (_req, res) => {
  res.json({ staus: 'OK' })
})

/* Search for matching memes */
app.get('/match', async (req, res) => {
  // get the image from the request body
  const image = req.body.image

  const searchResult = await findMatch(image)
  res.json(searchResult)
})

/* Start the server */
const server = app.listen(8080, () => {
  console.log('Server is running on port 8080')
})
