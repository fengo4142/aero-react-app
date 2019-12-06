import gql from 'graphql-tag';

const LOGIN_USER = gql `
    mutation userprofile(
        $email: String!,
        $password: String!
    ){
        userprofile(
            email: $email
            password: $password
        ){
            userId
            email
            title
            firstName
            lastName
            middleName
            phone
            profilePicture
            roles {
                name
                id
                permissions {
                    name
                }
            }
            airportId
            airportDetails {
                name
                code
            }
            isActive
            isNotifications
            createdAt
            updatedAt
            password
        }
    }
`;
export default LOGIN_USER;