import React from 'react'
import { TimelineItem } from "vertical-timeline-component-for-react";

import "./UserTimeline.css";
import styles from './UserTimeline.module.scss'
export default function UserTimelineModule(props) {
    const style = { background: "#ffff",padding: "20px", borderRadius: "8px", border: "1px solid #e6eaee",margin:"-60px 0 0 10px" }
    return (
        <TimelineItem key={props.id} bodyContainerStyle={style}>
            <div className={styles.container2}>
                <div>
                    <img src={props.image} className={styles.iconDetails} />
                </div>	
                <div className={styles.container3}>
                    <h3>{props.title}<span><a href="/">View Details</a></span></h3>
                    <h5>{props.dateandtime}</h5>
                    <h4>{props.subtitle} </h4>
                    <p>{props.description}</p>
                </div>
            </div>
        </TimelineItem>
    )
}
