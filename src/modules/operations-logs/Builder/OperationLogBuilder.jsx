import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import {
  SortableContainer, SortableElement,
  SortableHandle, arrayMove } from 'react-sortable-hoc';

import {
  updateLogFormSchema,
  fetchLogFormSchema,
  updateTypes
} from '../redux/actions';

import NewField from '../../inspections/Builder/steps/Step2/NewField';
import Button from '../../../components/button';
import handle from '../../../icons/inspection-icons/Droper.svg';
import stepStyles from '../../inspections/Builder/steps/steps.module.scss';
import createStyles from '../../inspections/Builder/create.module.scss';
import styles from './operationLogBuilder.module.scss';
import EditableText from '../../inspections/Builder/steps/Step3/EditableText';
import SectionHeader from '../../../components/sectionHeader';
import Spinner from '../../../components/spinner';
import HeaderBack from '../../../components/headerBack';
import preset from '../../../icons/Preset.svg';
import { LOGS_HOME_ROUTE } from '../../../constants/RouterConstants';
import FormattedMessageWithClass from '../../../components/formattedMessageWithClass';

const DragHandle = SortableHandle(() => <img className={stepStyles.handle} src={handle} alt="" />);

const SortableItem = SortableElement(({ item, ...rest }) => (
  <div className={stepStyles.item} {...rest}>
    <div className={stepStyles.itemInner}>
      <DragHandle />
      {item}
    </div>
  </div>
));

const SortableList = SortableContainer(({ items, openAddModal, onClickItem }) => (
  <div className={stepStyles.list}>
    {items.map((item, i) => (
      <SortableItem key={`item-${item.id}`} index={i} item={item.title} onClick={() => onClickItem(item.id)} />
    ))}
    <div role="button" tabIndex="0" className={stepStyles.item}
      onClick={openAddModal} onKeyPress={openAddModal}
    >
      <div className={`${stepStyles.itemInner} ${stepStyles.newItem}`}>
        <FormattedMessage id="inspections.step2.addNew"
          defaultMessage="Add a new field"
        />
      </div>
    </div>
  </div>
));


const OperationsLogBuilder = ({
  schema,
  apitypes,
  apisubtypes,
  saveAction,
  actionFetchForm,
  actionUpdateTypes,
  actionUpdate,
  intl
}) => {
  // State Hooks
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);
  const [clickedField, setClickedField] = useState({});
  const [length, setLength] = useState(0);
  const [catlength, setCatLength] = useState(0);
  const [types, setTypes] = useState([]);
  const [subTypes, setSubTypes] = useState({});
  const [selected, setSelected] = useState();

  // Called once on mount
  useEffect(() => { actionFetchForm(); }, []);

  // Called once fetch schema finished
  useEffect(() => {
    if (schema.schema) {
      setItems(schema.schema.fields);
      setLength(schema.schema.fields.length);
    }

    if (apitypes) {
      // We are storing an id property for the EditableText component
      // and a pk property to track the database id

      const newTypes = apitypes.map((t) => {
        const title = t.i18n_id
          ? intl.formatMessage({ id: `operations.log.${t.i18n_id}` })
          : t.name;
        return ({
          pk: `${t.id}`,
          id: `${t.id}`,
          i18n_id: t.i18n_id,
          title
        });
      });
      setTypes(newTypes);
      const parsedArray = apisubtypes.reduce((a, c) => {
        const aux = a;

        const title = c.i18n_id
          ? intl.formatMessage({ id: `operations.log.${c.i18n_id}` })
          : c.name;
        // We do the same with the subtypes
        if (aux[c.activity_type.id]) {
          aux[c.activity_type.id] = [
            ...aux[c.activity_type.id],
            { pk: `${c.id}`, id: `${c.id}`, i18n_id: c.i18n_id, title }
          ];
        } else {
          aux[c.activity_type.id] = [{
            pk: `${c.id}`,
            id: `${c.id}`,
            i18n_id: c.i18n_id,
            title
          }];
        }
        return aux;
      }, {});
      setSubTypes(parsedArray);

      setSelected(newTypes[0]);
    }
  }, [schema]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
  };

  const handleCreateField = (field) => {
    if (field.delete) {
      const newitems = items.filter(e => e.id !== field.id);
      setItems(newitems);
      return;
    }

    if (field.id) {
      const i = items.findIndex(e => e.id === field.id);
      items[i] = field;
      setItems(items);
    } else {
      const newField = { ...field, id: length + 1 };
      setItems([...items, newField]);
      setLength(length + 1);
    }
  };

  const openNewFieldModal = () => {
    setClickedField(undefined);
    setModal(true);
  };

  const handleFieldClick = (id) => {
    const fieldClicked = items.find(e => e.id === id);
    setClickedField(fieldClicked);
    setModal(true);
  };

  // Stores the value changed for type
  const handleChangeType = (id, val) => {
    const cat = types.find(f => f.id === id);
    if (val) {
      cat.title = val;
      cat.i18n_id = '';
      setTypes([...types]);
    } else {
      setTypes(types.filter(c => c.id !== id));
      const  newSubTypes = { ...subTypes };
      const filteredSubTypes = Object.keys(newSubTypes).reduce((object, key) => {
        if (key != id) {
          object[key] = newSubTypes[key]
        }
        return object
      }, {})
      setSubTypes(filteredSubTypes);
    }
  };

  // Stores the value changed for subtypes
  const handleChangeSubType = (id, val) => {
    const cat = subTypes[selected.id].find(f => f.id === id);
    if (val) {
      cat.title = val;
      cat.i18n_id = '';
      setSubTypes({ ...subTypes });
    } else {
      const newSubTypes = { ...subTypes };
      newSubTypes[selected.id] = subTypes[selected.id].filter(c => c.id !== id);
      setSubTypes(newSubTypes);
    }
  };

  // Adds a new entry for the selected type
  const handleAddSubType = () => {
    if (subTypes[selected.id]) {
      subTypes[selected.id] = [...subTypes[selected.id], { id: Math.random() * 10, title: '' }];
    } else {
      subTypes[selected.id] = [{ id: Math.random() * 10, title: '' }];
    }
    setSubTypes({ ...subTypes });
  };


  const handleSave = () => {
    // Updates the types
    const parsedTypes = types.map((e) => {
      if (e.pk) {
        return {
          id: e.pk,
          name: (e.i18n_id ? '' : e.title),
          i18n_id: (e.i18n_id || '')
        };
      }
      else {
      return {
        id: e.pk,
        ref: `${e.id}`,
        name: (e.i18n_id ? '' : e.title),
        i18n_id: (e.i18n_id || '')
      };
    }
    });

    const parsedSubtypes = {};
    Object.keys(subTypes).forEach((k) => {
      parsedSubtypes[k] = subTypes[k].map(e => (
        { id: e.pk,
          name: (e.i18n_id ? '' : e.title),
          i18n_id: (e.i18n_id || '')
        }
      ));
    });
    actionUpdateTypes(parsedTypes, parsedSubtypes);

    // Updates the form schema
    const data = {
      id: '',
      version: 1,
      fields: [...items],
      sections: [{
        id: 'SEC1',
        fields: items.map(field => field.id),
        title: 'Operations Log Form'
      }],
      pages: [{
        id: 'PAGE1',
        sections: ['SEC1'],
        title: 'Operations Log Form'
      }]
    };
    data.fields = items;
    actionUpdate(data);
  };
  return (
    <>
      <SectionHeader icon={preset} translationID="operations.log.title"
        defaultTitle="Operations Log Settings"
      />
      <HeaderBack
        translationID="inspections.new.prev"
        translationDefault="Back to Operations Log"
        backRoute={LOGS_HOME_ROUTE}
      />
      <div className={createStyles.box}>
        <div className={createStyles.title}>
          <FormattedMessage id="logs.builder.title"
            defaultMessage="Operation Log Schema"
          />
        </div>
        <div className={`${stepStyles.step2} ${styles.content}`}>
          <div className={stepStyles.title}>
            <FormattedMessage tagName="h5" id="operations.builder.types"
              defaultMessage="Activity Types List"
            />
          </div>
          <div className={styles.categories}>
            <div>
              <FormattedMessageWithClass className={styles.colName}
                id="operations.builder.types" defaultMessage="Types"
              />
              {types.map(c => (
                <div key={c.id} className={`${styles.category} ${selected && (c.id === selected.id) ? styles.active : ''}`}
                  onClick={() => setSelected(c)} onKeyPress={() => ({})} role="button" tabIndex="0"
                >
                  <EditableText item={c} defaultFocused={!c.title} changeField={handleChangeType} />
                </div>
              ))}
              <div className={styles.addBtn}>
                <Button action="secondary" onClick={() => {
                  setCatLength(catlength + 1);
                  setTypes([...types, { id: catlength, title: '' }]);
                }} translationID="operations.builder.add" defaultText="Add"
                />
              </div>
            </div>
            <div>
              <FormattedMessageWithClass className={styles.colName}
                id="operations.builder.subtypes" defaultMessage="Sub-Types"
              />
              {selected && subTypes[selected.id] && subTypes[selected.id].map(c => (
                <div key={c.id} className={styles.category}>
                  <EditableText item={c} defaultFocused={!c.title}
                    changeField={handleChangeSubType}
                  />
                </div>
              ))}
              {selected && (
              <div className={styles.addBtn}>
                <Button action="secondary" onClick={handleAddSubType}
                  translationID="operations.builder.add" defaultText="Add"
                />
              </div>
              )}
            </div>
          </div>
          <div className={stepStyles.title}>
            <FormattedMessage tagName="h5" id="operations.builder.details"
              defaultMessage="Log Form Details"
            />
          </div>
          <div className={stepStyles.fixedfields}>
            <div className={stepStyles.ffield}>
              <FormattedMessage
                id="operations.builder.logged_by"
                defaultMessage="Logged by"
              />
            </div>
            <div className={stepStyles.ffield}>
              <FormattedMessage
                id="operations.builder.date"
                defaultMessage="Report Date"
              />
            </div>
            <div className={stepStyles.ffield}>
              <FormattedMessage
                id="operations.builder.category"
                defaultMessage="Category"
              />
            </div>
            <div className={stepStyles.ffield}>
              <FormattedMessage
                id="operations.builder.subcategory"
                defaultMessage="Subcategory"
              />
            </div>
          </div>
          <FormattedMessage tagName="p" id="inspections.step2.subsection"
            defaultMessage="Other fields"
          />
          <SortableList items={items} axis="xy" useDragHandle onSortEnd={onSortEnd}
            openAddModal={openNewFieldModal} onClickItem={handleFieldClick}
          />
          <NewField onCreateField={handleCreateField} showIn={modal}
            onClose={() => setModal(false)} info={clickedField}
          />
        </div>
        <div className={createStyles.footer}>
          <Button action="secondary" onClick={() => ({})}
            translationID="inspections.new.prev" defaultText="Back"
          />
          <div className={styles.saveWrapper}>
            <Spinner active={saveAction.loading} />
            {saveAction.success && (
            <FormattedMessage id="operations.builder.saved"
              defaultMessage="Saved"
            />
            )}
            <Button action="secondary" onClick={handleSave}
              translationID="logs.builder.save" defaultText="Save"
            />
          </div>
        </div>
      </div>
    </>
  );
};


OperationsLogBuilder.propTypes = {
  schema: PropTypes.shape({}).isRequired,
  apitypes: PropTypes.arrayOf(PropTypes.shape({})),
  apisubtypes: PropTypes.arrayOf(PropTypes.shape({})),
  actionFetchForm: PropTypes.func.isRequired,
  actionUpdateTypes: PropTypes.func.isRequired,
  actionUpdate: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
  schema: state.opslogs.schema,
  apitypes: state.opslogs.types,
  apisubtypes: state.opslogs.subtypes,
  saveAction: state.opslogs.saveAction
});

const mapDispatchToProps = dispatch => ({
  // Save version of form
  actionUpdateTypes: (types, subtypes) => {
    dispatch(updateTypes(types, subtypes));
  },
  // Save version of form
  actionUpdate: (data) => {
    dispatch(updateLogFormSchema(data));
  },
  // Save version of form
  actionFetchForm: () => {
    dispatch(fetchLogFormSchema());
  }
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(injectIntl(OperationsLogBuilder));
