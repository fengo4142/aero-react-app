/* global localStorage */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FormattedHTMLMessage } from 'react-intl';
import { updateLanguage } from '../redux/actions';
import Panel from '../../../components/panel';
import styles from '../Roles/roles.module.scss';
import Button from '../../../components/button';

const Language = ({ user, apiStatusUser, actionUpdateLanguage }) => {
  const [language, setLanguage] = useState();

  useEffect(() => {
    if (apiStatusUser && apiStatusUser.success) {
      window.location.reload();
    }
  }, [apiStatusUser]);

  useEffect(() => {
    setLanguage(user.language);
  }, [user]);

  const handleClick = () => {
    actionUpdateLanguage(language);
    localStorage.setItem('lang', language);
  };

  return (
    <Panel containerClasses={styles.list} title="settings.title.language" defaultTitle="Language">
      <div className={styles.langContainer}>
        <FormattedHTMLMessage id="settings.language.title" tagName="h3"
          defaultMessage="Change the language according your preferences"
        />
        <div>
          <label>
            <input onChange={e => setLanguage(e.target.value)}
              type="radio" name="lang" value="es" checked={language === 'es'}
            />
          Spanish
          </label>
          <label>
            <input onChange={e => setLanguage(e.target.value)}
              type="radio" name="lang" value="en" checked={language === 'en'}
            />
          English
          </label>
          <label>
            <input onChange={e => setLanguage(e.target.value)}
              type="radio" name="lang" value="fr" checked={language === 'fr'}
            />
          French
          </label>
        </div>
        <Button translationID="settings.language.save" onClick={handleClick} defaultTitle="Save" />
      </div>
    </Panel>
  );
};

const mapStateToProps = state => ({
  user: state.auth.profile,
  apiStatusUser: state.settings.apiStatusUser
});

const mapDispatchToProps = dispatch => ({
  actionUpdateLanguage: (lang) => {
    dispatch(updateLanguage({ language: lang }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Language);
