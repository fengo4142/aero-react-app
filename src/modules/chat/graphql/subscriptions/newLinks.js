import gql from 'graphql-tag';

const NEW_LINKS = gql `
    subscription onCreateLinks(
        $airportId: String!
    ){
        onCreateLinks(airportId: $airportId) {
            airportId
            createdAt
            linksId
            name
            updatedAt
            url
            userId
            userDetails{
                name
                profilePicture
                title
                userId
                isActive
            }
        }
    }
`;
export default NEW_LINKS;