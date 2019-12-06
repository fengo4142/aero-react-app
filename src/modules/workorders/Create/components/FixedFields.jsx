import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone';
import Autocomplete from 'react-autocomplete';
import PulpoField from '../../../../pulpo_visualizer/fields';
import fieldstyles from '../../../../pulpo_visualizer/fields/fields.module.scss';
import Clickable from '../../../../components/clickable/Clickable';
import FormattedMessageWithClass from '../../../../components/formattedMessageWithClass';
import Multilocation from './Multilocation';
import styles from './fixedFields.module.scss';

class FixedFields extends Component {
  state = { currentValue: undefined }

  static getDerivedStateFromProps(props, state) {
    if (props.info.logged_by.id && state.currentValue === undefined) {
      return { ...state, currentValue: props.info.logged_by.fullname };
    }
    return state;
  }

  handleAutocompleteChange = (e) => {
    const { searchForUser } = this.props;
    this.setState({ currentValue: e.target.value });
    searchForUser(e.target.value);
  }

  handleAutocompleteSelect = (val, item) => {
    const { handleAnswerChanged, handleFieldErrorChanged } = this.props;

    this.setState({ currentValue: val });
    handleAnswerChanged('info', item, 'logged_by');
    handleFieldErrorChanged('logged_by', false);
  }

  handleDrop = (dropped) => {
    const { handleAnswerChanged, info } = this.props;
    handleAnswerChanged('info', [...info.photos, ...dropped], 'photos');
  }

  handleRemoveImage = (r) => {
    const { handleAnswerChanged, info } = this.props;
    const res = info.photos.filter(e => e !== r);
    handleAnswerChanged('info', res, 'photos');
  }

  handleZoomLevel = (val) => {
    const { handleWorkOrderZoomLevel } = this.props;
    handleWorkOrderZoomLevel(val)
  }

  render() {
    const { currentValue } = this.state;
    const {
      handleAnswerChanged,
      showFormErrors,
      handleFieldErrorChanged,
      handleAssetType,
      userlist,
      info,
      categories,
      assetTypes,
      assets,
      translation,
      selectedAsset,
      handleSelectedAsset,
    } = this.props;
    return (
      <>
        <div className={fieldstyles.field}>
          <FormattedMessageWithClass
            className={fieldstyles.title} id="workorder.create.by"
            defaultMessage="Inspected by"
          />
          <Autocomplete getItemValue={item => item.fullname} items={userlist}
            wrapperStyle={{ position: 'relative' }}
            value={currentValue}
            onChange={this.handleAutocompleteChange}
            onSelect={this.handleAutocompleteSelect}
            renderMenu={children => (
              <div className={styles.autocompleteMenu}>
                {children}
              </div>
            )}
            renderItem={(item, isHighlighted) => (
              <div key={item.id} className={`${styles.menuItem} ${isHighlighted && styles.highlighted}`}>
                {item.fullname}
              </div>
            )}
          />
          {!currentValue && showFormErrors && (
          <small>
            <FormattedMessage id="pulpoforms.errors.not_blank" defaultMessage="There is an error in this field" />
          </small>
          )}
        </div>

        <PulpoField key="date" id="report_date" type="datetime"
          translationID="workorder.create.date" title="Report date"
          isRequired handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
          answer={info.report_date}
          showFieldErrors={showFormErrors}
          handleFieldErrorChanged={handleFieldErrorChanged}
        />

        <PulpoField key="category" id="category" type="select" title="Category" isRequired
          translationID="workorder.create.category" className={styles.category}
          handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
          answer={info.category}
          showFieldErrors={showFormErrors}
          handleFieldErrorChanged={handleFieldErrorChanged}
          values={Object.keys(categories).map(e => (
            { key: e, value: categories[e].title }
          ))}
        />


        <PulpoField key="priority" id="priority" type="select" title="Priority" isRequired
          translationID="workorder.create.priority" className={styles.priority}
          handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
          answer={info.priority}
          showFieldErrors={showFormErrors}
          handleFieldErrorChanged={handleFieldErrorChanged}
          values={[
            { key: '0', value: 'Low' },
            { key: '1', value: 'Medium' },
            { key: '2', value: 'High' }
          ]}
        />
        {info.category && (
        <PulpoField key="subcategory" id="subcategory" type="select" title="Sub Category" isRequired
          translationID="workorder.create.subcategory" className={styles.fullInput}
          handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
          answer={info.subcategory}
          showFieldErrors={showFormErrors}
          handleFieldErrorChanged={handleFieldErrorChanged}
          values={categories[info.category].checklist.map(e => (
            { key: e.key, value: e.value }
          ))}
        />
        )}

        {/* Form Field for Selecting Asset */}
        {/* { 
          assetTypes && assetTypes[info.category] && assetTypes[info.category][info.subcategory] ?
          (
            <PulpoField key="assets" id="assets" type="select" title="Assets" 
            translationID="workorder.create.assets" className={styles.fullInput}
            handleValueChange = {(a, b) => handleAssetType('info', a, b)}
            answer={info.assets}
            showFieldErrors = {showFormErrors}
            handleFieldErrorChanged = {handleFieldErrorChanged}
            values = {
              assets.filter(asset => asset.asset_type.category.toUpperCase() === assetTypes[info.category][info.subcategory].toUpperCase()) 
              .map(e => (
              { key: `${e.id}`,
                value: e.name }
              )
              )}
            />
          ): ''
        } */}
        {
       assetTypes
       && assetTypes[info.category]
       && assetTypes[info.category][info.subcategory]
         ? (
           <Multilocation
             className={styles.fullInput}
             handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
             handleZoomLevel={(val) => this.handleZoomLevel(val)}
             answer={info.location}
             handleFieldErrorChanged={handleFieldErrorChanged}
             handleSelectedAsset = {handleSelectedAsset}
             type={assetTypes[info.category][info.subcategory]}
             assets={assets.filter(
               e => e.asset_type.category.toUpperCase()
               === assetTypes[info.category][info.subcategory].toUpperCase()
             )}
           />

        //    <Multilocation
        //    className={styles.fullInput}
        //    handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
        //   //  answer={info.assets}
        //   //  data = {info.assets}
        //    answer={info.location}
        //    handleFieldErrorChanged={handleFieldErrorChanged}
        //    type={assetTypes[info.category][info.subcategory]}
        //    assets={assets.filter(
        //      e => e.asset_type.category.toUpperCase()
        //      === assetTypes[info.category][info.subcategory].toUpperCase()
        //    )}
        //  />


         )
         : (
           <PulpoField key="location" id="location" type="location"
             translationID="workorder.create.location"
             className={styles.fullInput} title="Location" isRequired
             handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
             answer={info.location}
             showFieldErrors={showFormErrors} handleFieldErrorChanged={handleFieldErrorChanged}
             handleZoomLevel = {(val) => this.handleZoomLevel(val)}
           />
         )
      }


        <PulpoField key="desc" id="problem_description" type="string"
          translationID="workorder.create.description" className={styles.fullInput}
          widget={{ type: 'textarea' }} title="Problem description" isRequired
          handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
          answer={info.problem_description}
          showFieldErrors={showFormErrors} handleFieldErrorChanged={handleFieldErrorChanged}
        />
        <div className={styles.fullInput}>
          <FormattedMessageWithClass
            className={styles.label} id="workorder.create.photos"
            defaultMessage="Photos"
          />
          <Dropzone onDrop={this.handleDrop} disableClick
            className={styles.dropzone} accept="image/*"
          >
            {({ open }) => (
              <>
                <p className={styles.browsetext}>
                  <FormattedMessage id="airport.logo.text1" defaultMessage="Drag an image here or" />
                  <button type="button" onClick={() => open()}>
                    <FormattedMessage id="airport.logo.button" defaultMessage="browse" />
                  </button>
                  <FormattedMessage id="airport.logo.text2" defaultMessage="for an image to upload." />
                </p>
              </>
            )}
          </Dropzone>
          {info.photos.length > 0 && (
          <div className={styles.photos}>
            {info.photos.map(e => (
              <div key={e.name} className={styles.wrapper}>
                <Clickable onClick={() => this.handleRemoveImage(e)}>&times;</Clickable>
                <img src={e.preview} alt={e.name} />
              </div>
            ))}
          </div>
          )}
        </div>
      </>
    );
  }
}

FixedFields.propTypes = {
  info: PropTypes.shape({}).isRequired,
  handleAnswerChanged: PropTypes.func.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  showFormErrors: PropTypes.bool,
  userlist: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchForUser: PropTypes.func.isRequired,
  categories: PropTypes.shape({}).isRequired
};

FixedFields.defaultProps = {
  showFormErrors: false
};

export default FixedFields;
