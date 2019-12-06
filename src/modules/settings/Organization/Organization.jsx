/* global FormData */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import ImageUploader from './components/ImageUploader';
import Button from '../../../components/button';
import FormattedMessageWithClass from '../../../components/formattedMessageWithClass';
import { fetchAirport, editAirport } from '../redux/actions';

import styles from './organization.module.scss';

class Organization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validate: false,
      showFeedback: false,
      data: {}
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.profile.airport && !props.airport.id) {
      props.actionFetch(props.profile.airport.id);
    }
    if (props.action.success !== state.success) {
      return { ...state, success: props.action.success, showFeedback: props.action.success };
    }
    return state;
  }

  handleDrop(image) {
    this.setState(prevState => ({
      showFeedback: false,
      data: {
        ...prevState.data,
        logo: image
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
    }));
  }

  handleSubmit(event) {
    event.preventDefault();
    const { profile } = this.props;
    const { data } = this.state;
    const airport = { id: profile.airport.id, ...data };

    const formData = new FormData();
    let blank = false;
    Object.keys(airport).forEach((k) => {
      if (!airport[k]) blank = true;
      formData.append(k, airport[k]);
    });

    if (blank) {
      this.setState({ validate: true });
    } else {
      const { actionEdit } = this.props;
      actionEdit(airport.id, formData);
    }
  }

  render() {
    const { airport: { name, code, website, logo } } = this.props;
    const { validate, showFeedback } = this.state;
    const classes = [
      styles.form,
      validate && 'validated'
    ].filter(e => e);

    return (
      <form className={classes.join(' ')} onSubmit={this.handleSubmit} noValidate>
        <div className={styles.column}>
          <label htmlFor="name">
            <FormattedMessage id="airport.name" defaultMessage="Airport Name" />
            <input type="text" onBlur={this.handleChange} name="name" defaultValue={name} required />
            <FormattedMessageWithClass id="airport.form.invalidName"
              className="invalid-feedback" defaultText="Please provide a name"
            />
          </label>
          <label htmlFor="code">
            <FormattedMessage id="airport.code" defaultMessage="Airport Code" />
            <input type="text" onBlur={this.handleChange} name="code" defaultValue={code} required />
            <FormattedMessageWithClass id="airport.form.invalidCode"
              className="invalid-feedback" defaultText="Please provide a valid airport code"
            />
          </label>
          <label htmlFor="website">
            <FormattedMessage id="airport.website" defaultMessage="Website" />
            <input type="url" onBlur={this.handleChange} name="website" defaultValue={website} required />
            <FormattedMessageWithClass id="airport.form.invalidWebsite"
              className="invalid-feedback" defaultText="Please provide a valid website"
            />

          </label>
          <Button type="submit" translationID="airport.form.submit" defaultText="Save" />
          {showFeedback && (
          <FormattedMessageWithClass id="airport.form.success"
            className={styles.success} defaultText="The information was successfully submitted"
          />
          )}
        </div>
        <div className={styles.column}>
          <span className={styles.logo}>
            <FormattedMessage id="airport.logo.label" defaultMessage="Logo" />
          </span>
          <ImageUploader onChangeImage={this.handleDrop} image={logo} airport={code} />
        </div>
      </form>
    );
  }
}

Organization.propTypes = {
  airport: PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
    website: PropTypes.string,
    logo: PropTypes.string
  }).isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string
  }).isRequired,
  // Dispatch redux functions
  actionEdit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  airport: state.settings.airport,
  action: state.settings.action,
  profile: state.auth.profile
});

const mapDispatchToProps = dispatch => ({
  // Fetch airport
  actionFetch: (id) => {
    dispatch(fetchAirport(id));
  },
  // Edit airport
  actionEdit: (id, airport) => {
    dispatch(editAirport(id, airport));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Organization);
