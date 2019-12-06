import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Transition from 'react-transition-group/Transition';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { clear } from 'react-redux-permissions';
import styles from './topbar.module.scss';
import hamburger from './icons/menu.svg';
// import help from './icons/help.svg';
// import Search from './search';
// import Notifications from './notifications';
import Profile from './profile';
import AirportSelection from './airports';
import Menu from './menu/menu';
import Auth from '../../utils/Auth';
import cookie from 'react-cookies'


class TopBar extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.state = {
      showMenu: false
    };
  }

  handleClick() {
    if (!this.state.showMenu) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState(prevState => ({
      showMenu: !prevState.showMenu,
    }));
  }
  
  handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClick();
  }

  defaultStyle = {
    transition: 'opacity 300ms ease-in-out',
    opacity: 0
  };

  transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 }
  };

  logout = () => {
    const { history, actionClear } = this.props;
    Auth.getInstance().logout();
    cookie.remove('backend_url', { path: '/' });
    actionClear();
    history.push('/');
  }

  changeDefaultAirport = (airport) => {
    // console.log(airport);
  }

  render() {
    const { showMenu } = this.state;
    const { profile, currentModule } = this.props;
    return (
      <div className="main-header">
        <div className={styles.topbar}>
          <div className={styles.left}>
            <div className={styles.brand}> aerosimple </div>
            <Separator />
            <div className={styles.menu} ref={node => { this.node = node; }}>
              <button className={styles.menuBtn} type="button" onClick={this.handleClick}>
                <img src={hamburger} alt="menu" />
                <FormattedMessage id={`topbar.${currentModule}`} defaultMessage={currentModule} />
              </button>
            </div>
          </div>
          <div className={styles.right}>
            {/* <Search /> */}
            {/* <Separator /> */}
            {/* <Notifications /> */}
            <AirportSelection profile={profile} 
              changeDefaultAirport={(airport) => this.changeDefaultAirport(airport)} />
            <Profile profile={profile} logout={this.logout} />
            {/* <Separator />
            <a href="/">
              <img src={help} alt="help" />
            </a> */}
          </div>
        </div>
        {this.state.showMenu && (
        <Transition in={showMenu} timeout={0} unmountOnExit>
          {state => (<Menu
            onItemClick={this.handleClick}
            transition={{ ...this.defaultStyle, ...this.transitionStyles[state] }}
          />
          )}
        </Transition>
        )}
      </div>
    );
  }
}

TopBar.propTypes = {
  profile: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  actionClear: PropTypes.func.isRequired,
  currentModule: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  currentModule: state.general.currentModule
});

const mapDispatchToProps = dispatch => ({
  actionClear: () => {
    dispatch(clear());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TopBar));

const Separator = () => <div className={styles.separator} />;
