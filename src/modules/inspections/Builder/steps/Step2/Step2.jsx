import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  SortableContainer, SortableElement,
  SortableHandle, arrayMove } from 'react-sortable-hoc';

import NewField from './NewField';
import handle from '../../../../../icons/inspection-icons/Droper.svg';
import styles from '../steps.module.scss';

const DragHandle = SortableHandle(() => <img className={styles.handle} src={handle} alt="" />);

const SortableItem = SortableElement(({ item, ...rest }) => (
  <div className={styles.item} {...rest}>
    <div className={styles.itemInner}>
      <DragHandle />
      {item}
    </div>
  </div>
));

const SortableList = SortableContainer(({ items, openAddModal, onClickItem }) => (
  <div className={styles.list}>
    {items.map((item, i) => (
      <SortableItem key={`item-${item.id}`} index={i} item={item.title} onClick={() => onClickItem(item.id)} />
    ))}
    <div role="button" tabIndex="0" className={styles.item}
      onClick={openAddModal} onKeyPress={openAddModal}
    >
      <div className={`${styles.itemInner} ${styles.newItem}`}>
        <FormattedMessage id="inspections.step2.addNew"
          defaultMessage="Add a new field"
        />
      </div>
    </div>
  </div>
));


class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      length: 0,
      modal: false
    };

    this.onSortEnd = this.onSortEnd.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleCreateField = this.handleCreateField.bind(this);
    this.handleFieldClick = this.handleFieldClick.bind(this);
    this.openNewFieldModal = this.openNewFieldModal.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.items.length === props.details.fields.length) return state;
    const initialMax = props.details.fields[0] ? Number(
      props.details.fields[0].id.slice(1)
    ) : 0;
    const maxId = props.details.fields.reduce(
      (max, i) => (Number(i.id.slice(1)) > max ? Number(i.id.slice(1)) : max),
      initialMax
    );
    return { items: props.details.fields, length: maxId };
  }

  onSortEnd({ oldIndex, newIndex }) {
    const { items } = this.state;
    const { onFieldsChange, onAirportChange } = this.props;

    const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => (
      { ...item, order: index }
    ));
    this.setState({ items: newItems });
    onFieldsChange('fields', newItems);
    onAirportChange('fields', newItems);
  }

  toggleModal(value) {
    this.setState({ modal: value });
  }

  handleCreateField(field) {
    const { items, length } = this.state;
    const { onFieldsChange, onAirportChange } = this.props;

    if (field.delete) {
      const newitems = items.filter(e => e.id !== field.id);
      this.setState({ items: newitems });
      onFieldsChange('fields', newitems);
      onAirportChange('fields', [...newitems, { id: field.id, hidden: true, template: true }]);
      return;
    }

    if (field.id) {
      const i = items.findIndex(e => e.id === field.id);

      items[i] = { ...items[i], ...field, id: `d${length + 1}` };
      delete items[i].template;
      this.setState(prevState => ({
        items,
        length: prevState.length + 1
      }));
      onFieldsChange('fields', items);
      onAirportChange('fields', [...items, { id: field.id, hidden: true, template: true }]);
    } else {
      const newField = { ...field, id: `d${length + 1}`, order: length };
      this.setState(prevState => ({
        items: [...items, newField],
        length: prevState.length + 1
      }));
      onFieldsChange('fields', [...items, newField]);
      onAirportChange('fields', [...items, newField]);
    }
  }

  openNewFieldModal() {
    this.setState({ clickedField: undefined });
    this.toggleModal(true);
  }

  handleFieldClick(id) {
    const { items } = this.state;
    const clicked = items.find(e => e.id === id);
    this.setState({ clickedField: clicked, modal: true });
  }

  render() {
    const { items, modal, clickedField } = this.state;
    const { onFieldsChange, details: { additionalInfo } } = this.props;

    return (
      <div className={styles.step2}>
        <div className={styles.title}>
          <FormattedMessage tagName="h5" id="inspections.step2.title"
            defaultMessage="Inspection Details"
          />
        </div>
        <div className={styles.fixedfields}>
          <div className={styles.ffield}>
            <FormattedMessage
              id="inspections.step2.date_inspection"
              defaultMessage="Date of inspection"
            />
          </div>
          <div className={styles.ffield}>
            <FormattedMessage
              id="inspections.step2.inspected_by"
              defaultMessage="Inspected by"
            />
          </div>
          {/* <div className={styles.ffield}>
            <FormattedMessage
              id="inspections.step2.weather"
              defaultMessage="Weather conditions"
            />
          </div> */}
          <div className={styles.ffield}>
            <FormattedMessage
              id="inspections.step2.type_inspection"
              defaultMessage="Type of Inspection"
            />
          </div>
        </div>
        <FormattedMessage tagName="p" id="inspections.step2.subsection"
          defaultMessage="Other fields"
        />
        <SortableList items={items} axis="xy" useDragHandle onSortEnd={this.onSortEnd}
          openAddModal={this.openNewFieldModal} onClickItem={this.handleFieldClick}
        />
        <label htmlFor="additionalInfo">
          <FormattedMessage id="inspections.step2.additionalLabel"
            defaultMessage="Additional information or instructions"
          />
          <textarea onChange={e => onFieldsChange('additionalInfo', e.nativeEvent.target.value)}
            name="additionalInfo" id="" cols="30" rows="10"
            defaultValue={additionalInfo}
          />
        </label>
        <NewField onCreateField={this.handleCreateField} showIn={modal}
          onClose={() => this.toggleModal(false)} info={clickedField}
        />
      </div>
    );
  }
}


Step2.propTypes = {
  onFieldsChange: PropTypes.func.isRequired,
  details: PropTypes.shape({}).isRequired
};
export default Step2;
