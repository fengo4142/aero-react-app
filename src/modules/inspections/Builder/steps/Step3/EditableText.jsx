import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../steps.module.scss';

import editIcon from '../../../../../icons/inspection-icons/edit.svg';

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { edit: false };

    this.titleinput = React.createRef();
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    const { defaultFocused } = this.props;
    if (defaultFocused && this.titleinput.current) {
      this.setState(prevState => ({ edit: !prevState.edit }),
        () => {
          if (this.titleinput.current) this.titleinput.current.focus();
        });
    }
  }

  onBlur(e) {
    const { item: { id }, changeField } = this.props;
    changeField(id, e.nativeEvent.target.value);
    this.toggleEdit(e);
  }

  toggleEdit(e) {
    e.stopPropagation();
    this.setState(prevState => ({ edit: !prevState.edit }),
      () => {
        if (this.titleinput.current) this.titleinput.current.focus();
      });
  }

  remove(e) {
    e.stopPropagation();
    const { item: { id }, changeField } = this.props;
    changeField(id, '');
  }

  render() {
    const { item } = this.props;
    const { edit } = this.state;
    return (
      <div style={{display: 'flex'}}>
        <input ref={this.titleinput} onBlur={this.onBlur}
          type="text" disabled={edit ? '' : 'disabled'} placeholder={item.title}
        />
        <button className={styles.editBtn} type="button" onClick={this.toggleEdit}>
          <img src={editIcon} alt="" />
        </button>
        <button className={`${styles.editBtn} ${styles.removeBtn}`} type="button"
          onClick={this.remove}
        >
          &times;
        </button>
      </div>
    );
  }
}

EditableText.propTypes = {
  item: PropTypes.shape({}).isRequired,
  changeField: PropTypes.func.isRequired,
  defaultFocused: PropTypes.bool
};

EditableText.defaultProps = {
  defaultFocused: false
};
export default EditableText;
