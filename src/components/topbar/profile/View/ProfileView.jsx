import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
// import Permissions from 'react-redux-permissions';

import SectionHeader from '../../../../components/sectionHeader';
// import IconButton from '../../../../components/iconButton';
// import Separator from '../../../../components/separator';
import Panel from '../../../../components/panel';
import PanelContainer from '../../../../components/panelcontainer';
import Shortcuts from '../../shortcuts/shortcuts';

// import settings from '../../../../icons/settings.svg';
// import search from '../../../../icons/search.svg';
import styles from './ProfileView.module.scss';
import UserIcon from '../../../../icons/inspection-icons/icon-1.svg';
import UserImg from '../../../../icons/default_avatar.jpg'

// import AppPrivileges from './components/AppPrivileges'
// import UserTimeline from './components/UserTimeline/'

// import { withRouter } from 'react-router-dom';

import editIcon from '../../../../icons/inspection-icons/edit.svg'

/** ******************************************************************
 *  Redux import
 * ************* */
import { fetchUserProfile } from '../redux/actions';


class ProfileView extends Component {
  links = [
    { url: '/', name: 'Aerobot' },
    { url: '/todo', name: 'To Do' },
    { url: '/messenger', name: 'Messenger' },
    { url: '/settings/organization', name: 'Settings', permissions: ['can_modify_airport_settings'] }
  ]

  componentDidMount(){
    const { actionFetchUserProfile } = this.props;
    actionFetchUserProfile();
  }

  render() {
    const { history, profile } = this.props;
    const Icon = <img src={editIcon} style={{marginLeft:"153px", cursor:"pointer"}} onClick={() => { history.push('profile/edit'); }} />;
    return (
      <>
      <Shortcuts links={this.links} />
      <div className={styles.list}>
        <SectionHeader icon={UserIcon} translationID="profile.title" defaultTitle="Profile">
          {/* <div className={styles.detailHeader}>
            <IconButton icon={search} />
            <Permissions allowed={['add_workorderschema']}>
              <IconButton icon={settings} onClick={() => { history.push('settings'); }} />
              <Separator />
            </Permissions>
          </div> */}
        </SectionHeader>
        <div className={`container ${styles.container}`}>
          <div className={styles.info}>
            <PanelContainer>
              <PanelContainer>
                <div className={styles.userProfile}>
                  <img src={profile.image? profile.image : UserImg} className={styles.userImg} alt={profile.fullname}/>
                  <div className={styles.userProfileDetails}>
                    <h2>{profile.fullname} </h2>
                    <p>{profile.user.email}</p>
                  </div>
                </div>
              </PanelContainer>
              <PanelContainer>
                <Panel title="profile.contact.details" defaultTitle="Contact Details" display={Icon}>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLeft}><FormattedMessage id="profile.info.firstname" defaultMessage="FIRST NAME" /></span>
                    <span className={styles.profileDetailRight}>{profile.first_name}</span>
                  </div>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLeft}><FormattedMessage id="profile.info.lastname" defaultMessage="LAST NAME" /></span>
                    <span className={styles.profileDetailRight}>{profile.last_name}</span>
                  </div>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLeft}><FormattedMessage id="profile.info.email" defaultMessage="EMAIL" /></span>
                    <span className={styles.profileDetailRight}>{profile.user.email}</span>
                  </div>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLeft}><FormattedMessage id="profile.info.phone" defaultMessage="PHONE" /></span>
                    <span className={styles.profileDetailRight}>{profile.phone}</span>
                  </div>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLeft}><FormattedMessage id="profile.designation" defaultMessage="DESIGNATION" /></span>
                    <span className={styles.profileDetailRight}>{profile.designation}</span>
                  </div>                           
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLeft}><FormattedMessage id="profile.info.role" defaultMessage="ROLES" /></span>
                    <span className={styles.profileDetailRight}>{profile.roles.length > 0 && profile.roles.slice(0, 3).map(el => el.name).join(', ')}</span>
                  </div>
                  <div className={styles.profileDetailRow}>
                    <span className={styles.profileDetailLeft}><FormattedMessage id="profile.notifications" defaultMessage="NOTIFICATION_PREFERENCES"/></span>
                    <span className={styles.profileDetailRight}>
                    {profile.notification_preferences && profile.notification_preferences.email === true ? 
                      <div>
                      <FormattedMessage id="profile.notifications.e-mail" defaultMessage="E-MAIL"/>&nbsp;</div> : ''
                    }
                    {profile.notification_preferences && profile.notification_preferences.sms === true ? 
                      <FormattedMessage id="profile.notifications.sms" defaultMessage="SMS"/> : ''
                    }
                    </span>
                  </div>                               
                </Panel>
              </PanelContainer>
            </PanelContainer>
            <PanelContainer>
              {/* <AppPrivileges /> */}
              {/* <UserTimeline /> */}
            </PanelContainer>
          </div>
        </div>
      </div>
      </>
    );
  }
}


ProfileView.propTypes = {
  profile: PropTypes.shape({}).isRequired,
  actionFetchUserProfile: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: state.auth.profile
});

const mapDispatchToProps = dispatch => ({
  // Fetch airport
  actionFetchUserProfile: () => {
    dispatch(fetchUserProfile());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileView);