import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  SortableContainer, SortableElement,
  SortableHandle, arrayMove
} from 'react-sortable-hoc';

import handle from '../../../../../icons/inspection-icons/Droper.svg';
import styles from '../../workOrderBuilder.module.scss';


const DragHandle = SortableHandle(() => <img className={styles.handle} src={handle} alt="" />);

const SortableItem = SortableElement(({ item, ...rest }) => (
  <div className={styles.fieldBox} {...rest}>
    <div className={styles.fieldBoxInner}>
      <DragHandle />
      {item}
    </div>
  </div>
));

const SortableList = SortableContainer(({ items, onClickItem, form }) => (
  <div>
    {items.map((item, i) => (
      <SortableItem
        key={`item-${item.id}`}
        index={i}
        item={item.title}
        onClick={() => onClickItem(item.id, form)} />
    ))}
  </div>
));

class OrderableList extends Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { fields, handleFieldOrderChanged, form } = this.props;
    const fieldsCopy = [...fields];

    const newItems = arrayMove(fieldsCopy, oldIndex, newIndex);
    handleFieldOrderChanged(newItems, form);
  }

  render() {
    const { fields, form, handleFieldClick } = this.props;
    return (
      <>
        <SortableList
          items={fields}
          axis="y"
          useDragHandle
          onSortEnd={this.onSortEnd}
          onClickItem={handleFieldClick}
          form={form}
        />
      </>
    );
  }
}

OrderableList.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleFieldOrderChanged: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  handleFieldClick: PropTypes.func.isRequired
};
export default OrderableList;
