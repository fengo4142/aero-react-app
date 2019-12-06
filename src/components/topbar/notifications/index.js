import React from 'react';

import styles from './notifications.module.scss';
import task from '../icons/task.svg';
import chat from '../icons/chat.svg';
import notifications from '../icons/notifications.svg';

const Notifications = () => (
  <div className={styles.notifications}>
    <button><img src={task} alt="task"/></button>
    <button><img src={chat} alt="chat"/></button>
    <button><img src={notifications} alt="notifications"/></button>
  </div>
);

export default Notifications;
