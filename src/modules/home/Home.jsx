
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import AWS from 'aws-sdk';

import { connect } from 'react-redux';
import Messages from "./ChatBox/";
import styles from './home.module.scss';
import image from '../../icons/aerobot.png';
import Spinner from '../../components/spinner';
import Auth from '../../utils/Auth';
import Shortcuts from '../../components/topbar/shortcuts/shortcuts';

import { changeCurrentPage } from '../../general_redux/actions';
import Recorder from './Recorder';
import cookie from 'react-cookies';
//import { ChatBot, AmplifyTheme } from 'aws-amplify-react';

class Home extends Component {
  
  state = {
    input: '',
    response: '',
    spinner: false,
    searchTextBoxReadOnly:false,
    text: "",
    messages: [],
    member: {
      color: "#f2a520",
      username: "You"
    },
    disableVoice:false
  }
  lexUserId = `chatbot-demo${Date.now()}`;

  sessionAttributes = {};

  links = [
    { url: '/', name: 'Aerobot' },
    { url: '/todo', name: 'To Do' },
    { url: '/messenger', name: 'Messenger' },
    { url: '/settings/organization', name: 'Settings', permissions: ['can_modify_airport_settings'] }
  ]

  componentDidMount() {
    const { actionUpdateCurrentPage } = this.props;
    actionUpdateCurrentPage('home');

    // Initialize the Amazon Cognito credentials provider
    const key = `cognito-idp.${process.env.REACT_APP_REGION}.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`;
    AWS.config.region = process.env.REACT_APP_REGION; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
      Logins: {
        [key]: Auth.getInstance().getIDToken()
      }
    });
    this.botName = process.env.REACT_APP_LEX_BOTNAME;
    this.lexruntime = new AWS.LexRuntime();
    this.host = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && window.location.hostname.indexOf('app.') == -1
    ? process.env.REACT_APP_EXTERNAL_BACKEND_HOST
    : 'https://backend.' + window.location.hostname + '/api';
    this.sessionAttributes = {
      token: Auth.getInstance().getAuthToken(),
      env: 'dev',
      host: this.host
    };
  }
  
  onInputChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }

  pushChat = (event) => {
    event.preventDefault();
    this.onSendMessage(this.state.input,"human","text");
    const { input } = this.state;
    this.setState({ spinner: true });
    if (input !== '') {
      // send it to the Lex runtime
      const params = {
        botAlias: '$LATEST',
        botName: this.botName,
        inputStream: input,
        contentType: 'text/plain; charset=utf-8',
        accept:'text/plain; charset=utf-8'
      };   
      this.aeroBotRes(params,"text"); 
    }
  }

  aeroBotRes = (params,searchType) => {
    params.sessionAttributes = this.sessionAttributes;
    params.userId = this.lexUserId;
    this.setState({input: "",disableVoice:true,spinner: true});
    this.lexruntime.postContent(params, (err, data) => {
      if (err) {
        console.log(err, err.message);
      }
      if (data) {
        // capture the sessionAttributes for the next cycle
        let response = {};
        //return;
        if (data.messageFormat === 'CustomPayload') {
          response = JSON.parse(data.message);
        } else {
          response = data;
          response.link = data.sessionAttributes.link;
          if(searchType === "voice") {
            this.onSendMessage(response.inputTranscript,"human","text");
            this.setState({
              searchTextBoxReadOnly:false
            })
          }
          let botMessages = [];
          if (data.dialogState === 'ReadyForFulfillment' || data.dialogState === 'Fulfilled' || data.dialogState === "ElicitSlot") {
            try{
              let messages = JSON.parse(response.message);
              if(messages['messages']) {
                messages['messages'].forEach(message => {
                  let msg = message;
                  botMessages.push({"message":msg['message'],"type":msg['type'],"link":msg['link'],"dis_message":msg['dis_message']?msg['dis_message']:msg['message']});
                })          
              } else {
                if(messages['type'] === "link") {
                  if(messages['fdate']) {
                    localStorage.setItem('start_date', messages['fdate']);
                    localStorage.setItem('end_date', messages['tdate']);
                    console.log(messages['inspectionType']);
                    if(messages['inspectionType'] && messages['inspectionType'] != 'null'){
                      localStorage.setItem('inspectionFilter', messages['inspectionType']);
                    } else {
                      localStorage.removeItem('inspectionFilter');  
                    }
                    localStorage.removeItem('range');
                  } else if (messages['operationfdate']) {
                    localStorage.setItem('log_start_date', messages['operationfdate']);
                    localStorage.setItem('log_end_date', messages['operationtdate']);
                    localStorage.removeItem('log_range');
                  }
                }
                botMessages.push({"message":messages['message'],"type":messages['type'],"link":messages['link'],"dis_message":messages['dis_message']?messages['dis_message']:messages['message']});
              }
            } catch(e) {
              console.log(e);
              let message = response.message;
              botMessages.push({"message":message,"type":"text","link":""});
            }
          } else {
            botMessages.push({"message":response.message,"type":"text","link":""});
          }
          this.onSendMessage(botMessages,"AeroBot",response.intentName);
        }
        this.sessionAttributes = data.sessionAttributes;
        this.setState({ response, input: '', spinner: false,disableVoice:false });
      }
    });
  }

  changeSearchTextFieldReadOnlyStatus = (status) => {
    this.setState({
      searchTextBoxReadOnly:status
    })
  }

  selectMessage(message,dis_message) {
    const params = {
      botAlias: '$LATEST',
      botName: this.botName,
      inputStream: message,
      contentType: 'text/plain; charset=utf-8',
      accept:'text/plain; charset=utf-8'        
    };
    //this.onSendMessage(dis_message,"human","text");
    this.aeroBotRes(params,"text"); 
  }
  onSendMessage = (message,userType,linkTitle="") => {
    const messages = this.state.messages
    if(userType === "human") {
      messages.push({
        text: message,
        user: "human",
        member: this.state.member,
        linkTitle:linkTitle
      })
    } else {
      messages.push({
        text:  message,
        user: "AeroBot",
        member: {
          color: "#e22b4b",
          username: "AeroBot"
        },
        linkTitle:linkTitle
      })
    }
    this.setState({messages: messages})
  }
  
  render() {
    const { intl: { formatMessage } } = this.props;
    const { response, spinner, input } = this.state;
    return (
      <>
        <Shortcuts links={this.links} />
        <div className={styles.home}>
          <div className={styles.content}>
            <img src={image} alt="aerobot" style={{width:"100%"}} />
            <div className={styles.response}>
              <Messages
                messages={this.state.messages}
                currentMember={this.state.member}
                selectMessage={(message)=>this.selectMessage(message)}
              />
            </div>
            <form onSubmit={this.pushChat}>
              <Spinner active={spinner} className={styles.spinner} />
              <input
                onChange={e => this.onChange(e)}
                type="text"
                value={this.state.input}
                placeholder={formatMessage({ id: 'aerobot.placeholder' })}
                onChange={this.onInputChange}
                autoFocus={true}
                className="AeroBotInput"
                readOnly={this.state.searchTextBoxReadOnly}
              />
              {!this.state.disableVoice?
              <Recorder changeSearchTextFieldReadOnlyStatus={(status)=>this.changeSearchTextFieldReadOnlyStatus(status)} aeroBotRes={(params,searchType)=>this.aeroBotRes(params,searchType)}/>:""}
              <button className={styles.button} type="submit">
                {formatMessage({ id: 'aerobot.button' })}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

const objDiv = document.getElementsByClassName("chatboxcontainer");
objDiv.scrollTop = objDiv.scrollHeight;


Home.propTypes = {
  intl: PropTypes.shape({}).isRequired,
  actionUpdateCurrentPage: PropTypes.func
};

const mapStateToProps = state => ({
  currentModule: state.general.currentModule
});

const mapDispatchToProps = dispatch => ({
  actionUpdateCurrentPage: (page) => {
    dispatch(changeCurrentPage(page));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Home));