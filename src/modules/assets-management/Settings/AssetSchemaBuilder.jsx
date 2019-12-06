import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { HOC as Permissions } from 'react-redux-permissions';
import { FormattedMessage } from 'react-intl';

import {
  fetchAssetsSchema,
  updateAssetsSchema,
  clear as clearAction,
  saveSelfInspectionTypes
} from '../redux/actions';

import IconButton from '../../../components/iconButton';
import NewField from '../../inspections/Builder/steps/Step2/NewField';
import Forbidden from '../../Forbidden';
import OrderableList from '../../workorders/Builder/components/OrderableList/OrderableList';
import FormattedMessageWithClass from '../../../components/formattedMessageWithClass';
import { fetchSafetySelfInspection } from '../../inspections/redux/actions';

import addIcon from '../../../icons/add.svg';
import styles from './assetSchemaBuilder.module.scss';


class AssetSchemaBuilder extends Component {
  state = {
    modal: false,
    clickedField: {}
  }


  toggleModal = (value) => {
    this.setState({ modal: value });
  }


  openNewFieldModal = (form) => {
    this.setState({ clickedField: undefined, fieldForm: form });
    this.toggleModal(true);
  }

  handleFieldClick = (id, form) => {
    const { [form]: fields } = this.props;
    const clicked = fields.find(e => e.id === id);
    this.setState({ clickedField: clicked, fieldForm: form, modal: true });
  }

  render() {
    const { modal, clickedField, fieldForm } = this.state;
    const {
      lights,
      signs,
      onFieldOrderChanged,
      onCreateField
    } = this.props;

    return (
      <div>
        <div className={styles.fieldBoxContainer}>
          <div className={styles.formFieldBox}>
            <div className={`${styles.boxHeader} ${styles.signs}`}>
              <FormattedMessage tagName="h3"
                id="Asset.settings.signs_box"
                defaultMessage="Signs"
              />
              <IconButton
                icon={addIcon}
                onClick={() => this.openNewFieldModal('signs')}
              />
            </div>
            <div>
              <FormattedMessageWithClass tagName="h4" className={styles.sectionTitle}
                id="assets.field.title" defaultMessage="Lights Details"
              />

              <FormattedMessageWithClass className={styles.fixedfieldBox}
                id="assets.field.name" defaultMessage="Name"
              />
              <FormattedMessageWithClass className={styles.fixedfieldBox}
                id="assets.field.type" defaultMessage="Asset Type"
              />
              <FormattedMessageWithClass className={styles.fixedfieldBox}
                id="Asset.field.area" defaultMessage="Area"
              />
              <FormattedMessageWithClass className={styles.fixedfieldBox}
                id="Asset.create.photos" defaultMessage="Photos"
              />

              {signs.length > 0 && (
                <div className={styles.dynamicFields}>
                  <FormattedMessageWithClass tagName="h4" className={styles.sectionTitle}
                    id="assets.field.extra" defaultMessage="Additional Fields"
                  />
                  <OrderableList
                    fields={signs} form="signs"
                    handleFieldClick={this.handleFieldClick}
                    handleFieldOrderChanged={onFieldOrderChanged}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.formFieldBox}>
            <div className={`${styles.boxHeader} ${styles.lights}`}>
              <FormattedMessage tagName="h3"
                id="assets.field.lights" defaultMessage="Lights"
              />
              <IconButton icon={addIcon}
                onClick={() => this.openNewFieldModal('lights')}
              />
            </div>
            <div>
              <FormattedMessageWithClass tagName="h4" className={styles.sectionTitle}
                id="assets.field.title" defaultMessage="Signs Details"
              />
              <FormattedMessageWithClass className={styles.fixedfieldBox}
                id="assets.field.name" defaultMessage="Name"
              />
              <FormattedMessageWithClass className={styles.fixedfieldBox}
                id="assets.field.type" defaultMessage="Asset Type"
              />
              <FormattedMessageWithClass className={styles.fixedfieldBox}
                id="Asset.field.area" defaultMessage="Area"
              />
              <FormattedMessageWithClass className={styles.fixedfieldBox}
                id="Asset.create.photos" defaultMessage="Photos"
              />

              {lights.length > 0 && (
                <div className={styles.dynamicFields}>
                  <FormattedMessageWithClass tagName="h4" className={styles.sectionTitle}
                    id="assets.field.extra" defaultMessage="Additional Fields"
                  />
                  <OrderableList
                    fields={lights}
                    form="lights"
                    handleFieldClick={this.handleFieldClick}
                    handleFieldOrderChanged={onFieldOrderChanged}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <NewField onCreateField={field => onCreateField(field, fieldForm)} showIn={modal}
          onClose={() => this.toggleModal(false)} info={clickedField}
        />
      </div>
    );
  }
}

AssetSchemaBuilder.defaultProps = {
  schemas: {},
  updateAction: {}
};

AssetSchemaBuilder.propTypes = {
  schemas: PropTypes.shape({}),
  updateAction: PropTypes.shape({})
};


const mapStateToProps = state => ({
  schemas: state.assets.schemas,
  updateAction: state.assets.updateAction,
  selfInspection: state.inspection.selfInspection,
  profile: state.auth.profile
});

const mapDispatchToProps = dispatch => ({
  actionGetSchemas: () => {
    dispatch(fetchAssetsSchema());
  },
  actionSave: (data) => {
    dispatch(updateAssetsSchema(data));
  },
  actionFetch: () => {
    dispatch(fetchSafetySelfInspection());
  },
  actionSaveAssignment: (data) => {
    dispatch(saveSelfInspectionTypes(data));
  },
  clear: () => {
    dispatch(clearAction());
  }
});

export default Permissions(['can_modify_airport_settings'])(
  connect(mapStateToProps, mapDispatchToProps)(AssetSchemaBuilder),
  <Forbidden />
);
