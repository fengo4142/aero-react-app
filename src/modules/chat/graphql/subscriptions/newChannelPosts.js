import gql from 'graphql-tag';

const NEW_CHANNEL_POSTS = gql `
    subscription onCreatePost(
        $channelId: String,
        $iropsId: String,
    ){
        onCreatePost(channelId: $channelId, iropsId: $iropsId) {
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
        }
    }
`;
export default NEW_CHANNEL_POSTS;