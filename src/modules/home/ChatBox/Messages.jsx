import {Component} from "react";
import React from "react";
import './ChatBox.css'
import { Link } from 'react-router-dom';

class Messages extends Component {

  render() {
    const {messages} = this.props;
    return (
      <div className="chatboxContainer"> 
          <ul className="Messages-list" key={Date.now()}>
            {messages.map(m => this.renderMessage(m))}
          </ul>
        </div>
    );
  }
  renderMessage(message) {
    const {member, user,text,messageType,linkTitle} = message;
    const messageFromMe = user === member.username;
    const className = messageFromMe ? "Messages-message" : "Messages-message currentMember" ;
    return (
      <li className={className} key={text}>
        <span
          className="avatar"
          style={{backgroundColor: member.color}}
        />
        <div className="Message-content">
          <div className="username">
            {member.username}
          </div>
          {member.username === "You"?
            <div className="text">
              {text}
            </div>:
            text.map((message)=> 
              <>
                {message.type === "text"?
                  message.message:
                  message.type === "plaintext"?<p>{message.message}</p>:message.type === "link"?
                  <span style={{cursor:"pointer"}} className="text"><Link to={message.link} target="_blank" style={{color:"#FFFF"}}>{message.message}</Link></span>:
                  <span onClick={()=>this.props.selectMessage(message.message,message.dis_message)} style={{cursor:"pointer"}} className="text">{message.message}</span>
                }
              </>
            )
          }
        </div>
      </li>
    );
  }
}


export default Messages;
