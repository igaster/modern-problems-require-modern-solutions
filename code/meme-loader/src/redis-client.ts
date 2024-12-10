import { createClient, ErrorReply, SchemaFieldTypes, VectorAlgorithms } from 'redis'

const prefix = 'meme:twin'
const indexName = `${prefix}:index`
const redisURL = 'redis://localhost:6379'

/* Create and connect the Redis client */
const redis = await createClient({ url: redisURL })
  .on('error', error => console.error('Redis Client Error:', error))
  .connect()

/* Drop the Meme Twin index if it exists */
try {
  await redis.ft.dropIndex(indexName)
} catch (error) {
  if (error instanceof ErrorReply && error.message !== 'Unknown Index name') throw error
}

/* Create the Meme Twin index */
await redis.ft.create(
  indexName,
  {
    title: { type: SchemaFieldTypes.TEXT },
    embedding: {
      type: SchemaFieldTypes.VECTOR,
      ALGORITHM: VectorAlgorithms.FLAT,
      TYPE: 'FLOAT32',
      DIM: 512,
      DISTANCE_METRIC: 'COSINE'
    }
  },
  {
    ON: 'HASH',
    PREFIX: `${prefix}:`
  }
)

/* Export the client and index name */
export { redis, indexName, prefix }
