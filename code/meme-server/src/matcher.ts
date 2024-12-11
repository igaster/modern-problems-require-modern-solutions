import { embed } from './embedder.js'
import { indexName, redis, prefix } from './redis-client.js'

import { SearchOptions } from 'redis'

type Match = {}

async function findMatch(imageData: string): Promise<Match> {
  /* Build the Redis search query */
  const searchQuery = '*'
  const vectorQuery = `KNN 1 @embedding $BLOB`
  const redisQuery = `(${searchQuery})=>[${vectorQuery}]`

  /* Embed the user query*/
  const embedding = await embed(imageData)

  /* Execute the Redis search */
  const options: SearchOptions = {
    DIALECT: 2,
    PARAMS: { BLOB: embedding },
    SORTBY: '__embedding_score',
    LIMIT: { from: 0, size: 1 },
    RETURN: ['image', 'title', '__embedding_score']
  }

  const results = await redis.ft.search(indexName, redisQuery, options)

  /* Return the search results */
  const articles: Article[] = results.documents.map((result: any) => {
    const slug = result.value.url.split('/').pop()
    return {
      slug: slug,
      title: result.value.title,
      description: result.value.description,
      publicationDate: Number(result.value.publicationDate),
      url: result.value.url,
      imageUrl: result.value.imageUrl,
      score: result.value.__embedding_score
    }
  })

  return articles
}

async function fetchArticle(id: string): Promise<Article> {
  const results = (await redis.hGetAll(`${prefix}:${id}`)) as any
  delete results.embedding

  const article = { slug: id, ...results, publicationDate: Number(results.publicationDate), score: 0 } as Article
  return article
}

export { search, fetchArticle }
