import gql from 'graphql-tag';

const REGISTER_USER = gql `
    mutation createUser(
        $firstName: String!,
        $lastName: String!,
        $email: String!,
        $airportId: String!,
        $password: String!,
        $phone: String!,
        $title: String!,
        $roles: [rolesInput],
        $airportDetails: [airportDetailsInput],
        $profilePicture: String!,
        $langauge: String!
    ){
        createUser(
            input: {
                firstName: $firstName
                lastName: $lastName
                email: $email
                airportId: $airportId
                password: $password
                phone: $phone
                title: $title
                roles: $roles
                airportDetails: $airportDetails
                profilePicture: $profilePicture
                langauge: $langauge
            }
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

export default REGISTER_USER;