import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Sticky, Grid, Responsive, Segment } from "semantic-ui-react";
import jwtDecode from "jwt-decode";

import CREATE_CHANNEL from "../../graphql/mutations/createChannel";
import LIST_AIRPORT_USERS from "../../graphql/queries/listAirportUsers";
import styles from "../../chat.module.scss";
import { Wrapper } from "./CreateChannel.styles";
import { CreateChannelForm } from "./CreateChannelForm";
import { UsersList, UserType } from "../../types";

export type UsersArray = {
  listUsers: {
    items: UserType[];
  };
};

type CreateChannelProps = {
  userId: string;
  airportId: string;
};

const CreateChannel: React.FC<CreateChannelProps> = props => {
  const [userIDs, setUserID] = useState([]);

  const decodedToken = jwtDecode(localStorage.getItem("idtoken"));
  const userId = decodedToken["cognito:username"];
  const airportId = localStorage.getItem("airportId");

  const { loading: dataLoading, data: usersData } = useQuery<
    UsersArray,
    UsersList
  >(LIST_AIRPORT_USERS, {
    variables: {
      airportId,
      limit: 100,
      nextToken: null
    }
  });

  const [createChannel, { loading }] = useMutation(CREATE_CHANNEL);

  const onUserSelect = (userID: string | string[] ): void => {
    const userIDsArr: string[] = Array.isArray(userID) ? userID : [userID];
    setUserID(prevState => [...new Set([...prevState, ...userIDsArr])]);
  };

  const onRemove = (userID: string): void => {
    setUserID(prevState => prevState.filter(user => user !== userID));
  };

  return (
    <Wrapper>
      <Grid className="home-screen">
        <Grid.Column
          width={12}
          className={`channels-posts no-padding-botton ${styles.chat_wrapper}`}
        >
          <Responsive as={Segment} className="no-padding-botton">
            <Sticky>
              <h1>New Channel</h1>
              <hr />
              <CreateChannelForm
                onUserSelect={onUserSelect}
                onRemove={onRemove}
                createChannel={createChannel}
                userIDs={userIDs}
                userId={userId}
                airportId={airportId}
                items={(usersData && usersData.listUsers.items) || []}
              />
            </Sticky>
          </Responsive>
        </Grid.Column>
      </Grid>
    </Wrapper>
  );
};
export default CreateChannel;
