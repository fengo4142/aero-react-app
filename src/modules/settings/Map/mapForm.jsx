import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorSelect from '../../../components/colorSelect';
import styles from './map.module.scss';

class MapForm extends Component {
  constructor(props) {
    super(props);
    const { defaultType } = this.props;
    this.state = { name: '', surface_type: defaultType };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { onSubmit } = this.props;
    onSubmit(this.state);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const { name, surface_type: type } = this.state;
    const { types } = this.props;
    return (
      <form
        style={{ top: '50%', left: '50%' }}
        className={styles.popup}
        onSubmit={this.handleSubmit}
      >
        <h3>New Surface Details</h3>
        <label htmlFor="name">
          Name:
          <input name="name" type="text" value={name} onChange={this.handleChange} required />
        </label>
        <label>
          Type:
          <ColorSelect options={types}
            value={type}
            bordered
            onChange={value => this.setState({ surface_type: value })}
          />
        </label>
        <input type="submit" value="Save" />
      </form>
    );
  }
}

export default MapForm;

MapForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultType: PropTypes.shape({}).isRequired
};
