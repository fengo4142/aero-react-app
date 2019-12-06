import React, { Component } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import PropTypes from 'prop-types';

import styles from '../steps.module.scss';
import AccordionItem from './AccordionItem';

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = { open: -1 };

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(i) {
    const { open } = this.state;
    const newOpen = (open === i) ? -1 : i;
    this.setState({ open: newOpen });
  }

  render() {
    const { open } = this.state;
    const { items, onAddEntry, onChangeChecklistName, onChangeEntry } = this.props;
    return (
      <div className={`${styles.checklist} ${styles.list}`}>
        {items.map((item, i) => (
          <AccordionItem index={i} key={`item-${item.id}`}
            item={item} active={i === open} onChangeChecklistName={onChangeChecklistName}
            onItemClick={() => this.handleItemClick(i)} onAddEntry={onAddEntry}
            onChangeEntry={onChangeEntry}
          />
        ))}
      </div>
    );
  }
}

Accordion.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onAddEntry: PropTypes.func.isRequired,
  onChangeChecklistName: PropTypes.func.isRequired,
  onChangeEntry: PropTypes.func.isRequired
};

Accordion.defaultProps = {
  items: []
};

export default SortableContainer(Accordion);
