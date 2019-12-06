import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

import styles from './back.module.scss';


class HeaderBack extends Component {
  constructor(props) {
    super(props);
    this.goBackToRoute = this.goBackToRoute.bind(this);
  }

  goBackToRoute() {
    const { history } = this.props;
    history.goBack();
    history.push(this.props.backRoute)
  }

  

  render() {
    const { translationID, translationDefault, children } = this.props;
    return (
      <div className={styles.backMenu}>
        <div
          className={styles.link}
          role="link"
          tabIndex={0}
          onClick={this.goBackToRoute}
          onKeyPress={this.goBackToRoute}
        >
          <FormattedMessage id={translationID} defaultMessage={translationDefault} />
        </div>
        {children}
      </div>
    );
  }
}

HeaderBack.propTypes = {
  translationID: PropTypes.string.isRequired,
  translationDefault: PropTypes.string.isRequired,
  backRoute: PropTypes.string.isRequired,
  history: PropTypes.shape({}).isRequired
};

export default withRouter(HeaderBack);
