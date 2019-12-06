import gql from 'graphql-tag';

const CREATE_IROPS = gql `
    mutation createIrop(
        $airportId: String!,
        $content: String!,
        $userId: String!,
        $name: String!,
        $typeofIncident: String!,
        $airports: [airportDetailsInput],
        $airportDetails: airportDetails
    ){
        createIrop(
            input: {
                airportId: $airportId, 
                content: $content,
                createdBy: $userId,
                name: $name,
                typeofIncident: $type,
                airports: $airports,
                airportDetails: $airportDetails
            }
        ){
            airportId
            airportDetails{
                name
                code
                logo
            }
            airports{
                name
                code
                logo
            }
            content
            createdAt
            createdBy
            iropsId
            name
            typeofIncident
            updatedAt
            userDetails{
                firstName
                lastName
                profilePicture
            }
        }
    }
`;

export default CREATE_IROPS;