import gql from 'graphql-tag';

const COMPOSE_POST = gql `
    mutation createPost(
        $airportId: String!,
        $channelId: String!,
        $userId: String!,
        $content: String!,
        $attachments: [attachmentsInput]
    ){
        createPost(
            input: {
                airportId: $airportId, 
                channelId: $channelId,
                userId: $userId,
                content: $content,
                attachments: $attachments
            }
        ){
            airportId
            attachments{
                name
                url
                type
            }
            channelId
            content
            createdAt
            iropsId
            likes
            postId
            updatedAt
            userId
            comments
            isLiked
            user{
                firstName
                lastName
                profilePicture
            }
        }
    }
`;

export default COMPOSE_POST;