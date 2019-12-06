import React from 'react';
import { connect } from 'react-redux';
import styles from '../styles/general.module.scss';

const Forbidden = ({ permissions }) => (
  (permissions.length > 0)
  && <div className={styles.forbidden}>You are not allowed to access this page.</div>
);


const mapStateToProps = state => ({
  permissions: state.permissions
});

export default connect(
  mapStateToProps
)(Forbidden);
