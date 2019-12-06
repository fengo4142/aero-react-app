/* global FormData */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link , withRouter} from 'react-router-dom';
import Toggle from 'react-toggle';
import "react-toggle/style.css"; 
import './toggle.scss';
import UserImg from '../../../../icons/default_avatar.jpg'
import { FormattedMessage } from 'react-intl';
import ImageUploader from './components/ImageUploader';
import Button from '../../../button';
import FormattedMessageWithClass from '../../../formattedMessageWithClass';
import SectionHeader from '../../../../components/sectionHeader';
import Shortcuts from '../../shortcuts/shortcuts';
import styles from './ProfileEdit.module.scss';
import UserIcon from '../../../../icons/inspection-icons/icon-1.svg';
import editIcon from '../../../../icons/inspection-icons/edit.svg';
import Spinner from '../../../../components/spinner';
import Modal from '../../../modal';
/** ******************************************************************
 *  Redux import
 * ************* */
import { editUser, fetchUserProfile, clearProfile } from '../redux/actions';
import { showConfirmModal, hideModal } from '../../../../general_redux/actions.js';

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validate: false,
      showFeedback: false,
      data: {
        first_name: '',
        last_name: '',
        phone: '',
        designation: '',
      },
      notifications: {},
      showModal: false,
      image:'',
      showErrorModal: false
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNotificationPreferences = this.handleNotificationPreferences.bind(this);
  }

  componentDidMount(){
    const { actionFetchUserProfile } = this.props;
    actionFetchUserProfile();
  }

  static getDerivedStateFromProps(props, state) {
    const isEmpty = Object.values(state.data).every(x => (x === null || x === ''));

    if ( props.profile.id && isEmpty){
      return{...state, data:{first_name: props.profile.first_name, last_name: props.profile.last_name,
      phone:props.profile.phone, designation: props.profile.designation }}
    }    
    if(props.apiStatusUser.success){
      if(props.currentPage === 'profile') {
        props.handleSignIn()  
    }

    if (props.action.success !== state.success) {
      return { ...state, success: props.action.success, showFeedback: props.action.success, showErrorModal:props.apiStatusUser.success};
    }

    if(props.profile.image || props.profile.notification_preferences) {
      return {
        ...state, notifications: props.profile.notification_preferences,
        image:props.profile.image ? props.profile.image : UserImg
      }
    }
    return state;
}
}
  componentDidUpdate(prevProps) {
    if(prevProps.apiStatusUser !== this.props.apiStatusUser) {
      this.props.actionFetchUserProfile();
    }
  }

  componentWillUnmount() {
    const { actionClear } = this.props;
    actionClear();
  }

 
  handleDrop(image) {
    this.setState(prevState => ({
      showFeedback: false,
      data: {
        ...prevState.data,
        image: image
      }
    }));
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      showFeedback: false,
      data: {                   
          ...prevState.data,    
          [name]: value       
      }
  }))
    ;
  } 
  handleNotificationPreferences = (event) => {
    const { name , value} = event.target;
    const {notifications} = this.state;
    const check = event.target.checked;
    notifications[name] = check
    this.setState({...notifications })
  }

  handleEdit = () => {
    const { data: { id, ...data } } = this.state;
    const { actionEdit} = this.props;
  if ( data.first_name == '' || data.last_name == '') {
        this.setState({ shouldShowErrors: true })
  }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { profile, actionEdit, apiStatusUser, currentPage } = this.props;
    const { data, notifications } = this.state;
    const info = { id: profile.id, ...data };
 
    if (!data['first_name'] || !data['last_name'])
    {
      return
    }
    const formData = new FormData();
    if(info['first_name']){
      formData.append('first_name', info['first_name']);
    }
    if(info['last_name']){
      formData.append('last_name', info['last_name']);
    }
    if(info['phone']){
      formData.append('phone', info['phone']);
    }
    if(info['image']){
      formData.append('image', info['image']);
    }
    if(info['designation']){
      formData.append('designation', info['designation']);
    }
    if(notifications){
      formData.append('notification_preferences', JSON.stringify(notifications));
    }
    actionEdit(info.id, formData);
   
  }

  links = [
    { url: '/', name: 'Aerobot' },
    { url: '/todo', name: 'To Do' },
    { url: '/messenger', name: 'Messenger' },
    { url: '/settings/organization', name: 'Settings', permissions: ['can_modify_airport_settings'] }
  ]

  render() {
    const { validate, showFeedback, shouldShowErrors, notifications, data,image} = this.state;
    // const {  } = this.state;
    const classes = [
      styles.form,
      validate && 'validated'
    ].filter(e => e);
    const { profile, apiStatusUser , currentPage, handleSignIn} = this.props;
    const form =  <div>
    <form className={classes.join(' ')} onSubmit={this.handleSubmit} noValidate>
      <div className={styles.form}>
        <div className={styles.column}>
          <label htmlFor="firstname">
            <FormattedMessage id="profile.firstname" defaultMessage="First Name" />
            <input type="text" onChange={this.handleChange} name="first_name" required value={data.first_name}/>
            <FormattedMessageWithClass id="profile.form.invalidFirstname"
              className="invalid-feedback" defaultText="Please provide a First Name"
            />
            <div className={styles.error}>
                      { shouldShowErrors && data.first_name === ''  && <span>Name cannot be empty</span>}
                    </div>
          </label>
          <label htmlFor="lastName">
            <FormattedMessage id="profile.lastName" defaultMessage="Last Name" />
            <input type="text"  onChange={this.handleChange} name="last_name"  required value={data.last_name} />
            <FormattedMessageWithClass id="profile.form.invalidLastName"
              className="invalid-feedback" defaultText="Please provide a Last Name"
            />
            <div className={styles.error}>
                      { shouldShowErrors && !data.last_name && <span>Name cannot be empty</span>}
                    </div>
          </label>
          <label htmlFor="phone">
            <FormattedMessage id="profile.phone" defaultMessage="Phone" />
            <input type="text"  onChange={this.handleChange} name="phone"  required value={data.phone} />
            <FormattedMessageWithClass id="profile.form.invalidPhone"
              className="invalid-feedback" defaultText="Please provide a valid Phone Number"
            />
          </label>
          <label htmlFor="Designation">
            <FormattedMessage id="profile.designation" defaultMessage="Designation" />
            <input type="text" onChange={this.handleChange} name="designation"  required value={data.designation}/>
          </label>
          <label htmlFor="Notification Preferences">
            <FormattedMessage id="profile.notifications" defaultMessage="Notification Preferences"/>
            <FormattedMessage id="profile.notifications.e-mail" defaultMessage="E-mail"/>
            <Toggle
                aria-label='E-mail'
                name="email"
                onChange={this.handleNotificationPreferences}
                checked = {notifications && notifications.email}
                defaultChecked = {true}
             />
             <FormattedMessage id="profile.notifications.sms" defaultMessage="SMS"/>
             <Toggle
                aria-label='SMS'
                name="sms"
                onChange={this.handleNotificationPreferences}
                checked = {notifications && notifications.sms}
                defaultChecked = {true}
             />
          </label>
          <Spinner active={apiStatusUser.loading} />
          <Button  type="submit" onClick={this.handleEdit}  
          translationID="profile.form.submit" defaultText="Save" />
        </div>
        <div className={styles.column}>
          <span className={styles.logo}>
            <FormattedMessage id="profile.logo.label" defaultMessage="Logo" />
          </span>
          <ImageUploader onChangeImage={this.handleDrop} image={image} profile={profile.first_name}/>
        </div>
      </div>
    </form>
    <Modal
        onClose={()=>this.setState({showErrorModal: false})}showIn={this.state.showErrorModal} width="50%" minHeight="30%"
        >
        <div className={styles.modal}>
        <FormattedMessage id="profile.form.success" className={styles.success} defaultText="The information was successfully submitted"/>
        </div>
        <div className={styles.btn}>
          <Button type="secondary" translationID="profile.modal.close" onClick={()=>this.setState({showErrorModal: false})} defaultText="Close"/>
        </div>
    </Modal>
    </div>

    return (
      <>
      {currentPage ? <div>{form}</div>:
        <div>
          <Shortcuts links={this.links} />
          <div className={styles.list}>
            <SectionHeader icon={UserIcon} translationID="profile.title.edit" defaultTitle="Profile Edit ">
            </SectionHeader>
            <div className={`container ${styles.container}`}>
              <div className={styles.info}>
                <div className={styles.header}>
                  <Link to="/profile"> Back</Link>
                  {form}
                </div>
              </div>
            </div>
          </div> 
        </div>
      } 
      </> 
    );
  }
}

ProfileEdit.propTypes = {
  profile: PropTypes.shape({}).isRequired,
  actionEdit: PropTypes.func.isRequired,
  actionFetchUserProfile: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  action: state.profile.action,
  apiStatusUser: state.profile.apiStatusUser,
});

const mapDispatchToProps = dispatch => ({
  // Fetch airport
  actionFetchUserProfile: () => {
    dispatch(fetchUserProfile());
  },
  actionEdit: (id, data) => {
    dispatch(editUser(id, data));
  },
  actionConfirm: (body, accept, cancel) => {
    dispatch(showConfirmModal(body, accept, cancel));
  },
  actionHideModal: (insp) => {
    dispatch(hideModal(insp));
  },
  // To clear Profile Reducer State
  actionClear: () => {
    dispatch(clearProfile());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProfileEdit));