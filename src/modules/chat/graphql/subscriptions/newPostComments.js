import gql from 'graphql-tag';

const NEW_POST_COMMENT = gql `
    subscription onCreateComments(
        $channelId: String,
        $iropsId: String,
        $postId: String!
    ){
        onCreateComments(channelId: $channelId, iropsId: $iropsId, postId: $postId) {
            airportId
            channelId
            commentId
            content
            createdAt
            iropsId
            likes
            parentCommentId
            postId
            updatedAt
            userId
            user{
                firstName
                lastName
                profilePicture
            }    
        }
    }
`;
export default NEW_POST_COMMENT;