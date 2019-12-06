import React, { Component } from 'react'
import { Timeline } from "vertical-timeline-component-for-react";
import UserTimelineInfo from './UserTimelineData';
import UserTimelineModule from './UserTimelineModule'
import styles from './UserTimeline.module.scss'

import { FormattedMessage } from 'react-intl';

export default class UserTimeline extends Component {
    render() {
        const UserTimelineHistory = UserTimelineInfo.map( Timeline => <UserTimelineModule key="Timeline.id" title={Timeline.title} subtitle={Timeline.subtitle} image={Timeline.image} dateandtime={Timeline.dateandtime} description={Timeline.description} />)
        return (
            <>
                <h3><FormattedMessage id="profile.info.activity" defaultMessage="Activity" /> </h3>
                <h4><FormattedMessage id="profile.info.lastAccess" defaultMessage="Last access" /> <span className={styles.accessTime}>06/04/2018 at 17:00</span></h4>
                <Timeline lineColor={"#ddd"}>
                {UserTimelineHistory}
                </Timeline>
            </>
        )
    }
}
