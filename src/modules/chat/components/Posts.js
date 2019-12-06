import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Feed, Header, Loader } from 'semantic-ui-react';
import PostCard from './PostCard';
import FETCH_CHANNELS_POSTS from '../graphql/queries/channelPosts';
import NEW_CHANNEL_POSTS from '../graphql/subscriptions/newChannelPosts';
import ComposePost from './composePost';
import ScrollToBottom from 'react-scroll-to-bottom';
import mqtt from 'mqtt';

function Posts(props) {
    const [newPost, setNewPost] = useState();

    const mqttClient = (url, clientId) => mqtt.connect(url, {
        clientId: clientId
    });

    const createSubscriptionUpdater = (subscribeToMore) => (
        () => subscribeToMore({
            document: NEW_CHANNEL_POSTS,
            variables:{
                channelId: props.channelId,
            },
            updateQuery: (prev, { subscriptionData }) => {
                const mqttConnections = subscriptionData.extensions.subscription.mqttConnections[0];
                const client = mqttClient(mqttConnections.url, mqttConnections.client);
                client.on('connect', function() {
                    client.subscribe(mqttConnections.topics[0])
                });
                client.on('message', function(topic, message, packet) {
                    const postData = JSON.parse(message.toString());
                    setNewPost(postData.data.onCreatePost);
                });
                client.on('disconnect', function() {
                    client.unsubscribe(mqttConnections.topics[0]);
                });
            }
        })
    );
        
    const { loading, data, subscribeToMore } = useQuery(FETCH_CHANNELS_POSTS, {
        variables: {
            channelId: props.channelId,
            userId: props.userId,
            limit: 100,
            nextToken: null
        }
    });

    useEffect(() => {
        if (props.channelId) {
            createSubscriptionUpdater(subscribeToMore)();
        }
    }, [props.channelId]);

    if(data){
        if(newPost){
            const postExists = data.getChannelPosts.items.find(({ postId }) => postId === newPost.postId);
            if(!postExists){
                data.getChannelPosts.items = [...data.getChannelPosts.items, newPost];
            }
            setNewPost('');
        }
    }
    
    return(
        <div>
            <Header
                as='h2'
                content={props.channelName ? props.channelName : 'Channels'}
                textAlign='center'
            />
            {loading &&
                <Loader active inline='centered' >Loading</Loader>
            }

            {data &&
                <ScrollToBottom className="posts-height">
                    <Feed>
                        {data.getChannelPosts.items.map((post, key) => (
                            <PostCard post={post} key={key}/>
                        ))}
                    </Feed>
                </ScrollToBottom>
            }
            
            {!data && loading && 
                <Feed className="posts-height">
                    <Feed.Event>
                        <Feed.Content>
                            <Feed.Summary>
                                No Posts are posted in this channel
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                </Feed>
            }
            <ComposePost {...props}/>
        </div>
    ) 
};

export default Posts;