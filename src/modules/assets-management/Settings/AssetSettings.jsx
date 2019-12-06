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

import { ASSET_HOME_ROUTE } from '../../../constants/RouterConstants';

import Spinner from '../../../components/spinner';
import HeaderBack from '../../../components/headerBack';
import Button from '../../../components/button';
import Clickable from '../../../components/clickable/Clickable';
import Forbidden from '../../Forbidden';
import AssetSchemaBuilder from './AssetSchemaBuilder';
import { fetchSafetySelfInspection } from '../../inspections/redux/actions';

import styles from './assetSchemaBuilder.module.scss';
import AssetSelfInspection from './AssetSelfInspection';


class AssetSettings extends Component {
  state = {
    modal: false,
    loadedFields: false,
    signs: [],
    lights: [],
    maxIdSigns: 1,
    maxIdLights: 1,
    view: 'fields',
    assign: {}
  }

  componentDidMount() {
    const { actionGetSchemas, schemas } = this.props;
    if (!schemas.length) actionGetSchemas();

    const { actionFetch, selfInspection } = this.props;
    if (!selfInspection.length) actionFetch();
  }

  componentWillUnmount() {
    const { clear, actionGetSchemas } = this.props;
    actionGetSchemas();
    clear();
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.schemas.signs || state.loadedFields) return state;

    const {
      schemas: { signs, lights },
      profile
    } = props;

    // Update the ids for new fields.
    const signsMaxId = signs.schema.fields.reduce(
      (max, i) => (Number(i.id.substr(3)) > max ? Number(i.id.substr(3)) : max),
      1
    );
    const lightsMaxId = lights.schema.fields.reduce(
      (max, i) => (Number(i.id.substr(3)) > max ? Number(i.id.substr(3)) : max),
      1
    );

    const signsFields = signs.schema.sections.length ? (
      signs.schema.sections[0].fields) : [];
    const lightsFields = lights.schema.sections.length ? (
      lights.schema.sections[0].fields) : [];

    let assign = {};
    if (profile) {
      assign = profile.airport.types_for_self_inspection;
    }
    return {
      signs: signsFields.map(
        f => signs.schema.fields.find(fi => fi.id === f)
      ),
      lights: lightsFields.map(
        f => lights.schema.fields.find(fi => fi.id === f)
      ),
      lightsMaxId,
      signsMaxId,
      assign,
      loadedFields: true
    };
  }

  handleFieldOrderChanged = (fields, form) => {
    this.setState({
      [`${form}`]: fields
    });
  }

  handleCreateField = (field, form) => {
    const {
      [`${form}`]: fields,
      [`${form}MaxId`]: maxId
    } = this.state;

    if (field.delete) {
      const newitems = fields.filter(e => e.id !== field.id);
      this.setState({ [`${form}`]: newitems });
      return;
    }

    if (field.id) {
      const i = fields.findIndex(e => e.id === field.id);
      fields[i] = field;
      this.setState({
        [`${form}`]: fields
      });
    } else {
      const newField = { ...field, id: `${form.substring(0, 3)}${maxId + 1}` };
      this.setState(prevState => ({
        [`${form}`]: [...fields, newField],
        [`${form}MaxId`]: prevState[`${form}MaxId`] + 1
      }));
    }
  }

  /**
   * Makes the redux action call to update the schemas
   * in backend
   */
  handleSaveSchemas = () => {
    const { actionSave, updateAction } = this.props;
    if (updateAction.loading) return;
    const { signs, lights } = this.state;

    const signsSchema = signs.length ? ({
      id: '',
      version: 1,
      fields: [...signs],
      sections: [{
        id: 'SEC1',
        fields: signs.map(field => field.id),
        title: 'signs'
      }],
      pages: [{
        id: 'PAGE1',
        sections: ['SEC1'],
        title: 'signs'
      }]
    }) : { id: '', version: 1, fields: [], sections: [], pages: [] };

    const lightsSchema = lights.length ? ({
      id: '',
      version: 1,
      fields: [...lights],
      sections: [{
        id: 'SEC1',
        fields: lights.map(field => field.id),
        title: 'Work order'
      }],
      pages: [{
        id: 'PAGE1',
        sections: ['SEC1'],
        title: 'Work order'
      }]
    }) : { id: '', version: 1, fields: [], sections: [], pages: [] };

    actionSave({
      signs: signsSchema,
      lights: lightsSchema
    });
  }

  /**
   * Makes the redux action call to update the schemas
   * in backend
   */
  handleSaveAssignments = () => {
    const { assign } = this.state;
    const { actionSaveAssignment } = this.props;
    actionSaveAssignment(assign);
  }

  /**
   * Changes the view between fields and assignments
   * */
  handleViewChange = (value) => {
    const { clear } = this.props;
    this.setState({ view: value });
    clear();
  }

  /**
   * Updates the state with the new changes in tne relationship
   * between self-inspection and asset types
   * */
  handleSelectChange = (cat, subcat, event) => {
    this.setState(prevState => ({
      assign: {
        ...prevState.assign,
        [cat]: {
          ...prevState.assign[cat],
          [subcat]: event
        }
      }
    }));
  }

  render() {
    const {
      signs,
      lights,
      view,
      assign
    } = this.state;

    const { updateAction, selfInspection } = this.props;

    return (
      <div className={styles.builder}>
        <HeaderBack
          translationID="Asset.settings.back"
          translationDefault="Back"
          backRoute={ASSET_HOME_ROUTE}
        >
          <div className={styles.links}>
            <Clickable onClick={() => this.handleViewChange('fields')}
              className={view === 'fields' ? styles.active : ''}
            >
              Asset Fields
            </Clickable>
            <Clickable onClick={() => this.handleViewChange('assign')}
              className={view === 'assign' ? styles.active : ''}
            >
              Self-inspection assigment
            </Clickable>
          </div>
          <div className={styles.saveFormsBtn}>
            {updateAction.success && <FormattedMessage tagName="h4" id="workorder.settings.saved" defaultMessage="Saved" />}
            <Spinner active={updateAction.loading} />
            {view === 'fields' && (
            <Button action="secondary" onClick={this.handleSaveSchemas}
              translationID="asserts.settings.saveBtn" defaultText="Save Forms"
            />
            )}
            {view === 'assign' && (
            <Button action="secondary" onClick={this.handleSaveAssignments}
              translationID="asserts.settings.saveBtn" defaultText="Save Assignment"
            />
            )}
          </div>
        </HeaderBack>
        {view === 'fields' && (
          <AssetSchemaBuilder
            signs={signs}
            lights={lights}
            onFieldOrderChanged={this.handleFieldOrderChanged}
            onCreateField={this.handleCreateField}
          />
        )}
        {view === 'assign' && (
        <AssetSelfInspection
          values={assign}
          selfInspection={selfInspection}
          onSelectChange={this.handleSelectChange}
        />
        )}
      </div>
    );
  }
}

AssetSettings.defaultProps = {
  schemas: {},
  updateAction: {}
};

AssetSettings.propTypes = {
  actionGetSchemas: PropTypes.func.isRequired,
  actionSave: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
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
  connect(mapStateToProps, mapDispatchToProps)(AssetSettings),
  <Forbidden />
);
