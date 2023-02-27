import { GraphQLClient } from 'graphql-request'

const graphlqlRequestClient = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_API_URL}`
)

export default graphlqlRequestClient
