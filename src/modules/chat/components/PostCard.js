import React from 'react';
import { Feed, Icon } from 'semantic-ui-react';
import moment from 'moment';
import * as defaultUser from '../icons/elliot.jpg';
import * as defaultImage from '../icons/image.png';

function PostCard({
  post: {
    postId,
    user: { profilePicture, firstName, lastName },
    content,
    attachments,
    likes,
    comments,
    createdAt,
  },
}) {
  function likePost() {
    console.log('Like Post!');
  }
  function commentOnPost() {
    console.log('Comment On Post!');
  }
  return (
    <Feed.Event key={postId}>
      <Feed.Label
        image={profilePicture || defaultUser}
        alt="avthar"
      />
      <Feed.Content>
        <Feed.Summary>
          <a href="#/">
            {firstName} {lastName}
          </a>{' '}
          posted on
          <Feed.Date>{moment(createdAt * 1000).fromNow()}</Feed.Date>
        </Feed.Summary>
        {content && <Feed.Extra text>{content}</Feed.Extra>}
        {attachments && (
          <Feed.Extra images>
            {attachments.map((attachment, key) => (
              <a href="#/" key={key}>
                <img
                  src={attachment.url ? attachment.url : defaultImage}
                  alt={attachment.name}
                />
              </a>
            ))}
          </Feed.Extra>
        )}
        <Feed.Meta>
          <Feed.Like onClick={likePost}>
            <Icon name="like" />
            {likes} Likes
          </Feed.Like>
          <Feed.Like onClick={commentOnPost}>
            <Icon name="comment" />
            {comments} Comments
          </Feed.Like>
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
}

export default PostCard;
