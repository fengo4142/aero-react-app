import gql from 'graphql-tag';

const FETCH_CHANNELS_QUERY = gql `
    query listUserChannels(
        $userId: String!,
        $airportId: String!,
        $limit: Int,
        $nextToken: String
    ){
        listUserChannels(userId: $userId, airportId: $airportId, limit: $limit, nextToken: $nextToken) {
            items{
                channelId
                channelUsersId
                createdAt
                unreadCount
                userId
                channels{
                    name
                    content
                    createdAt
                    createdBy
                    type
                }
            },
            nextToken
        }
    }
`;
export default FETCH_CHANNELS_QUERY;