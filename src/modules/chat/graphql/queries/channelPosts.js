import gql from 'graphql-tag';

const FETCH_CHANNELS_POSTS = gql `
    query getChannelPosts(
        $channelId: String!,
        $userId: String!,
        $limit: Int,
        $nextToken: String
    ){
        getChannelPosts(channelId: $channelId, userId: $userId, limit: $limit, nextToken: $nextToken) {
            items{
                attachments{
                    name
                    url
                    type
                }
                content
                createdAt
                likes
                postId
                userId
                comments
                user{
                    firstName
                    lastName
                    profilePicture
                }
                airportId
                channelId
                updatedAt
                isLiked
            }
            nextToken
        }
    }
`;
export default FETCH_CHANNELS_POSTS;