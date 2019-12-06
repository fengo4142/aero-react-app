import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, TextArea, Sticky, Message, Button } from 'semantic-ui-react';
import COMPOSE_POST from '../graphql/mutations/createPosts';
import FETCH_CHANNELS_POSTS from '../graphql/queries/channelPosts';
import { useForm } from '../util/hooks';

function ComposePost(props){
    const { errors, values, setErrors, onSubmit, onChange } = useForm(composePostCallback, {
        content: ''
    },
    {
        content: '',
        validation: ''
    });
    const [composePost, { loading }] = useMutation(COMPOSE_POST, {
        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_CHANNELS_POSTS,
                variables: {
                    channelId: props.channelId,
                    userId: props.userId,
                    limit: 100,
                    nextToken: null
                }
            });
            data.getChannelPosts.items = [...data.getChannelPosts.items, result.data.createPost];
            proxy.writeQuery({ query: FETCH_CHANNELS_POSTS, variables: {
                channelId: props.channelId,
                userId: props.userId,
                limit: 100,
                nextToken: null
            }, data});
            values.content = '';
        },
        onError(err){
            setErrors({...errors, validation: 'Please enter valid details to login.!'});
        },
        variables: {
            userId: props.userId,
            airportId: props.airportId,
            channelId: props.channelId,
            attachments: [
                {
                    url: "https://static.us.dev.aerosimple.com/media/profile/userimage.png",
                    name: "download.png",
                    type: "image/png"
                }
            ],
            content: values.content,
        }
    });
    function composePostCallback(){
        composePost();
    };
    return (
        <Sticky>
            <Form error onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <TextArea rows={2} 
                    placeholder="Post here.."
                    name="content"
                    value={values.content}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Send
                </Button>
                {errors.content.length > 0 && (
                    <Message error content={errors.content} className="custom-error-message" />
                )}
                {errors.validation.length > 0 && (
                    <Message error content={errors.validation} className="custom-error-message" />
                )}
            </Form>
        </Sticky>
    )
};
export default ComposePost;