import React from 'react'
import { Item } from 'semantic-ui-react'

function ChannelCard({ channel: {channelId, channels: { name } }, onClick, firstChannel, cId}){
    return (
        <Item key={channelId} onClick={() => onClick(channelId, name)}>
            <Item.Content>
                <Item.Header className={cId === channelId ? 'active-channel' : (
                    firstChannel === 0 && !cId ? 'active-channel' : ''
                )}>{name}</Item.Header>
            </Item.Content>
        </Item>
    )
}

export default ChannelCard;