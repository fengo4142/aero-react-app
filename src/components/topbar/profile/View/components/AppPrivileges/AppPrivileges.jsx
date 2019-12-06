import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './AppPrivileges.module.scss';

import Button from '../../../../../../components/button';
import SectionHeader from '../../../../../../components/sectionHeader/SectionHeaderNoIcon';
import Collapsible from '../../../../../../components/collapsible/Collapsible';
import Clickable from '../../../../../../components/clickable/Clickable';


class AppPrivileges extends Component {
  state = {
    section: 'app_priviliges'
  }

  handleTabClick = (value) => {
    switch (value) {
      case 'app_priviliges':
        this.setState({ section: value }); break;
      case 'forms':
        this.setState({ section: value }); break;
      default:
        break;
    }
  }

  render() {
    const { section } = this.state;
    const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    return (
      <div className={styles.appPriviliges}>
        <SectionHeader translationID="profile.app.priviliges" defaultTitle="App Privileges">
          <div className={styles.navigation}>
            <Clickable className={section === 'app_priviliges' ? styles.active : ''}
              onClick={() => this.handleTabClick('app_priviliges')}
            >
              <FormattedMessage id="profile.app.priviliges" defaultMessage="App Privileges" />
            </Clickable>
            <Clickable className={section === 'forms' ? styles.active : ''}
              onClick={() => this.handleTabClick('forms')}
            >
              <FormattedMessage id="profile.app.forms" defaultMessage="Forms" />
            </Clickable>
          </div>
          <div className={styles.detailHeader}>
            <Button translationID="profile.add" defaultText="Add New Aap" />
          </div>
        </SectionHeader>
        <div className={styles.list}>
          {section === 'app_priviliges' && (
            <>
              <Collapsible  title="profile.app.priviliges.collapse_1" defaultMessage="Operations App">
                <p>{description}</p>
              </Collapsible>
              <Collapsible  title="profile.app.priviliges.collapse_2" defaultMessage="SMS" >
                <p>{description}</p>
              </Collapsible>
              <Collapsible  title="profile.app.priviliges.collapse_3" defaultMessage="Lease Management" >
                <p>{description}</p>
              </Collapsible>
              <Collapsible  title="profile.app.priviliges.collapse_4" defaultMessage="App Builder" >
                <p>{description}</p>
              </Collapsible>
            </>
          )}
          {section === 'forms' && (
              <p>{description}</p>
          )}
        </div>
      </div>
    );
  }
}


export default AppPrivileges;
