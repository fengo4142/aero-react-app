import gql from 'graphql-tag';

const NEW_MESSAGE = gql `
    subscription onCreateMessages(
        $toUserId: String!,
        $fromUserId: String!
    ){
        onCreateMessages(toUserId: $toUserId, fromUserId: $fromUserId) {
            createdAt
            fromUserId
            message
            messageId
            readStatus
            fromRead
            toRead
            fromDelete
            toDelete
            toUserId
            updatedAt
            attachments{
                url
                name
                type
            }  
            fromUser{
                firstName
                lastName
                profilePicture
            }
            toUser{
                firstName
                lastName
                profilePicture
            }
        }
    }
`;
export default NEW_MESSAGE;