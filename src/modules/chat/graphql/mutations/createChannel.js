import gql from 'graphql-tag';

const CREATE_CHANNEL = gql`
  mutation createChannel(
    $airportId: String!
    $content: String!
    $userId: String!
    $name: String!
    $type: Boolean!
    $users: [String]
  ) {
    createChannel(
      input: {
        airportId: $airportId
        content: $content
        createdBy: $userId
        name: $name
        type: $type
        users: $users
      }
    ) {
      airportId
      channelId
      content
      createdAt
      createdBy
      name
      type
      updatedAt
      userDetails {
        firstName
        lastName
        profilePicture
      }
    }
  }
`;

export default CREATE_CHANNEL;
