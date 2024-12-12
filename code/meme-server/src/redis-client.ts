import 'dotenv/config'

import { createClient } from 'redis'

const redisHost = process.env.REDIS_HOST || 'localhost'
const redisPort = process.env.REDIS_PORT || 6379

const prefix = 'meme:twin'
const indexName = `${prefix}:index`
const redisURL = `redis://${redisHost}:${redisPort}`

/* Create and connect the Redis client */
const redis = await createClient({ url: redisURL })
  .on('error', error => console.error('Redis Client Error:', error))
  .connect()

/* Export the client and index name */
export { redis, indexName, prefix }
