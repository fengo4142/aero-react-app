import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import Permissions from 'react-redux-permissions';
import styles from './menu.module.scss';
import { uiRouts } from '../../../constants';


const Menu = ({ transition, onItemClick, intl }) => (
  <div style={{ ...transition }} className={styles.menu}>
    <ul>
      <li>
        <div className={styles.item}>
          <h4 className={styles.home}>{intl.formatMessage({ id: 'topbar.home' })}</h4>
          <Link to={uiRouts.root} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.aerobot' })}</Link>
          <Link to={uiRouts.todo} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.todo' })}</Link>
          <Link to={uiRouts.messenger} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.chat' })}</Link>
          <Permissions allowed={['can_modify_airport_settings']}>
            <Link to={uiRouts.settingsOrganization} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.settings' })}</Link>
          </Permissions>
        </div>
      </li>
      <li>
        <div className={styles.item}>
          <h4 className={styles.operations}>{intl.formatMessage({ id: 'topbar.operations' })}</h4>
          <Permissions allowed={['view_inspection']}>
            <Link to={uiRouts.opsInspections} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.inspections' })}</Link>
          </Permissions>
          <Permissions allowed={['view_workorder']}>
            <Link to={uiRouts.opsWorkorders} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.workorders' })}</Link>
          </Permissions>
          <Link to={uiRouts.opsAssets} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.assets' })}</Link>
          <Link to={uiRouts.opsLogs} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.opslog' })}</Link>
          <Permissions allowed={['view_inspection']}>
            <Link to={uiRouts.opsSettings} onClick={onItemClick}>{intl.formatMessage({ id: 'shortcuts.settings' })}</Link>
          </Permissions>
        </div>
      </li>
    </ul>
  </div>
);

export default injectIntl(Menu);
