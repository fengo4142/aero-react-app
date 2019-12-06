import gql from 'graphql-tag';

const NEW_DOCUMENTS = gql `
    subscription onCreateDocuments(
        $airportId: String!
    ){
        onCreateDocuments(airportId: $airportId) {
            airportId
            createdAt
            documentsId
            folderName
            sortOrder
            updatedAt
            userId
            userDetails{
                name
                profilePicture
                title
                userId
                isActive
            }
            attachments{
                url
                name
                type
            }
        }
    }
`;
export default NEW_DOCUMENTS;