import gql from 'graphql-tag';

const LIST_AIRPORT_USERS = gql`
    query listUsers(
        $airportId: String!,
        $limit: Int,
        $nextToken: String
    ){
        listUsers(filter:{
            airportId: {
                eq: $airportId
            }
        }, limit: $limit, nextToken: $nextToken) {
            items{
                firstName
                lastName
                middleName
                profilePicture
                title
                userId
            }
            nextToken
        }
    }
`;
export default LIST_AIRPORT_USERS;
