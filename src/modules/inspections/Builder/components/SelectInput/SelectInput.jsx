import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectOption from './selectOption';

import styles from './selectInput.module.scss';


class SelectInput extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleDropdownClick() {
    this.setState({ isOpen: true });
  }

  handleClickOutside(event) {
    const { isOpen } = this.state;
    if (isOpen) {
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }


  render() {
    const { isOpen } = this.state;
    const { value, options, onChange } = this.props;

    let cls = `${styles.select} `;

    if (isOpen) cls += `${styles.active} `;
    return (
      <div role="button" tabIndex="0" className={cls}
        onClick={this.handleDropdownClick}
        onKeyPress={this.handleDropdownClick}
        ref={this.setWrapperRef}
      >
        <div className={styles.selected}>
          <span style={{ backgroundColor: value.color }} />
          {value.name}
        </div>

        {isOpen && (
          <div className={styles.wrapper}>
            <div className={styles.dropdown}>
              {options.map(option => (
                <SelectOption key={option.key} text={option.name}
                  onClick={(e) => {
                    onChange(option);
                    this.setState({ isOpen: false });
                    e.stopPropagation();
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SelectInput;

SelectInput.propTypes = {
  value: PropTypes.shape({}).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired
};
