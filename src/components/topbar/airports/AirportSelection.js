import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import styles from './airports.module.scss';
import { updateDefaultAirport } from './redux/actions';
import Loading from '../../loading/loading';

class AirportSelection extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.state = {
      airportsDropdown: false,
      loadingStatus:false
    };
  }

  handleClick() {
    if (!this.state.airportsDropdown) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState(prevState => ({
        airportsDropdown: !prevState.airportsDropdown,
    }))
  }
  
  handleOutsideClick(e) {
    // ignore clicks on the component itself
    try {
      if (this.node.contains(e.target)) {
        return;
      }
      this.handleClick(
       // window.location.reload()
      );
    } catch(ex) {
      // nothing
    }
  }
  componentWillReceiveProps(nextprops){
    if (nextprops.apiStatusUser.success === true) { 
      this.setState({loadingStatus: false},()=>{
        window.location.reload();
      })
    }
  }

  componentDidMount() {
    if (performance.navigation.type == 1) {
      this.setState({ loadingStatus: false})
    }
  }

  async changeDefaultAirport(airport) { 
      const { updateDefaultAirport } = this.props;
      localStorage.setItem("airportId", airport.code);
      updateDefaultAirport(airport);
      this.setState({loadingStatus: true})
  }

  render() {
    const { airportsDropdown } = this.state;
    const { profile } = this.props;
    const { airport, authorized_airports } = profile
    let airport_list = [];
    if (authorized_airports){
        authorized_airports.forEach(airport => {
            airport_list.push(
                <li className={styles.item} key={airport.code} >
                  <button type="button" onClick={() => this.changeDefaultAirport (airport)} style={{ color: 'black' }}>
                    {airport.name}
                  </button>
                </li>
            )
        })
    }
    return (
      <div className={styles.airports} ref={node => { this.node = node; }}>
        <button type="button" onClick={this.handleClick}>
        { airport.name }
        </button>
        {this.state.airportsDropdown && airport_list.length > 1 && (
          <ul className={`${styles.dropdown} ${airportsDropdown ? styles.open : ''}`}>
            {airport_list}
          </ul>
        )}
        <Loading loadingStatus={this.state.loadingStatus}/>
      </div>
    );
  }
}

AirportSelection.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    authorized_airports: PropTypes.array,
    airport: PropTypes.object,
  }).isRequired
};
const mapStateToProps = state => ({
  action:state.updateairport.action,
  apiStatusUser: state.updateairport.apiStatusUser
});
const mapDispatchToProps = dispatch => ({
    updateDefaultAirport: (airport) => {
      dispatch(updateDefaultAirport(airport.id));
    }
});
// export default AirportSelection;

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectIntl(AirportSelection));
