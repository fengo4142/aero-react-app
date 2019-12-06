import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';

import Accordion from './Accordion';

import styles from '../steps.module.scss';

class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = { checklist: [] };
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  onSortEnd({ oldIndex, newIndex }) {
    const { checklist } = this.state;
    const { onFieldsOrderChange } = this.props;

    const newItems = arrayMove(checklist, oldIndex, newIndex).map((item, index) => (
      { ...item, order: index }
    ));
    this.setState({ checklist: newItems });
    onFieldsOrderChange(newItems);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.checklist.length === props.checklist.length) return state;
    return { checklist: props.checklist };
  }

  render() {
    const { addNewItem, onAddEntry, onChangeChecklistName, onChangeEntry } = this.props;
    const { checklist } = this.state;
    return (
      <div className={styles.step3}>
        <h3 className={styles.title}>
          <FormattedMessage id="inspections.step3.title"
            defaultMessage="Inspection Checklist"
          />
        </h3>
        <button type="button" className={styles.add} onClick={addNewItem}>
          <FormattedMessage id="inspections.step3.addNew"
            defaultMessage="Add new Item"
          />
        </button>
        <Accordion onSortEnd={this.onSortEnd} useDragHandle
          items={checklist} onAddEntry={onAddEntry}
          onChangeChecklistName={onChangeChecklistName}
          onChangeEntry={onChangeEntry}
        />
      </div>
    );
  }
}


Step3.propTypes = {
  addNewItem: PropTypes.func.isRequired,
  onAddEntry: PropTypes.func.isRequired,
  onChangeEntry: PropTypes.func.isRequired,
  onChangeChecklistName: PropTypes.func.isRequired,
  onFieldsOrderChange: PropTypes.func.isRequired
};

export default Step3;
