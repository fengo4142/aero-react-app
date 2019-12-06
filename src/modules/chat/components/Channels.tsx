import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  Grid,
  Responsive,
  Item,
  Header,
  Loader,
  Segment,
} from 'semantic-ui-react';
import ChannelCard from './ChannelCard';
import FETCH_CHANNELS_QUERY from '../graphql/queries/userChannels';
import Posts from './Posts';
import { CreateChannel } from './CreateChannel';

import jwtDecode from "jwt-decode";

function Channels(props) {
  const [createChannel, setCreateChannel] = useState(false);
  const [cId, setChannelId] = useState(null);
  const [cName, setchannelName] = useState(null);

  const decodedToken = jwtDecode(localStorage.getItem("idtoken"));
  const userId = decodedToken["cognito:username"];
  const airportId = localStorage.getItem("airportId");

  const { loading, data } = useQuery(FETCH_CHANNELS_QUERY, {
    variables: {
      userId,
      airportId,
      limit: 100,
      nextToken: null,
    },
  });

  let channelId = null;
  let channelName = null;

  if (data && data.listUserChannels.items) {
    channelId = data.listUserChannels.items[0]
      ? data.listUserChannels.items[0].channelId
      : null;
    channelName = data.listUserChannels.items[0]
      ? data.listUserChannels.items[0].channels.name
      : null;
  }

  const handleChannel = (id, name) => {
    channelId = id;
    channelName = name;
    setChannelId(channelId);
    setchannelName(channelName);
  };

  const handleCreateChannel = () => {
    setCreateChannel(true);
  };

  return (
    <Grid columns={2} divided="vertically" className="home-screen">
      <Grid.Column width={4} className="channels-posts">
        <Responsive as={Segment} className="no-border">
          <Header
            as="h2"
            content="Channels"
            textAlign="center"
            onClick={handleCreateChannel}
          />
          {loading && (
            <Loader active inline="centered">
              Loading
            </Loader>
          )}

          {data && (
            <Item.Group link>
              {data.listUserChannels.items.map((channel, key) => (
                <ChannelCard
                  channel={channel}
                  firstChannel={key}
                  key={key}
                  onClick={handleChannel}
                  cId={cId}
                />
              ))}
            </Item.Group>
          )}

          {!data && loading && (
            <Item.Group link>
              <Item>
                <Item.Content>
                  <Item.Header>
                    You havn't joined any Channels yet...!
                  </Item.Header>
                </Item.Content>
              </Item>
            </Item.Group>
          )}
        </Responsive>
      </Grid.Column>
      <Grid.Column width={12} className="channels-posts">
        {createChannel ? (
          <Responsive as={Segment} className="no-border">
            <CreateChannel
              userId={userId}
              airportId={airportId}
            />
          </Responsive>
        ) : (
          <Responsive as={Segment} className="no-border">
            {cId && cName ? (
              <Posts
                channelId={cId}
                channelName={cName}
                airportId={airportId}
                userId={userId}
              />
            ) : (
              <Posts
                channelId={channelId}
                airportId={airportId}
                userId={userId}
                channelName={channelName}
              />
            )}
          </Responsive>
        )}
      </Grid.Column>
    </Grid>
  );
}
export default Channels;
export { Channels };
