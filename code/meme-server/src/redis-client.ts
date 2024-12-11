import { createClient, ErrorReply, SchemaFieldTypes, VectorAlgorithms } from 'redis'

const prefix = 'meme:twin'
const indexName = `${prefix}:index`
const redisURL = 'redis://localhost:6379'

/* Create and connect the Redis client */
const redis = await createClient({ url: redisURL })
  .on('error', error => console.error('Redis Client Error:', error))
  .connect()

/* Export the client and index name */
export { redis, indexName, prefix }
