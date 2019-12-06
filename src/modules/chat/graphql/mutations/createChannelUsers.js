import gql from 'graphql-tag';

const ADD_USERS_TO_CHANNEL = gql `
    mutation createChannelUser(
        $channelId: String!,
        $userId: String!
    ){
        createChannelUser(
            input: {
                channelId: $channelId,
                userId: $userId
            }
        ){
            airportId
            channelId
            content
            createdAt
            createdBy
            name
            type
            updatedAt
            userDetails{
                firstName
                lastName
                profilePicture
            }
        }
    }
`;

export default ADD_USERS_TO_CHANNEL;