import React from 'react';
import PropTypes from 'prop-types';

import PulpoField from '../../../../pulpo_visualizer/fields';
import camera from '../../../../icons/camera.svg';
import styles from './fixedFields.module.scss';
import InspectionMap from './InspectionMap';

let currentPhoto;
const FixedFieldsForInspections = ({
  info,
  assets,
  assetTypes,
  handleAnswerChanged,
  handleSelectedAsset,
  showFormErrors,
  handleFieldErrorChanged,
  handleWorkOrderZoomLevel,
  spaceError
}) => (
  <div className={styles.fixedForInspection}>
    <label className={styles.camera}>
      <img src={camera} alt="" />
      <input type="file" accept="image/*" multiple onChange={(e) => {
        handleAnswerChanged('info', [...e.target.files], 'photos');
        currentPhoto = '';
        if (e.target.files.length > 1) {
          currentPhoto = `${e.target.files[0].name} and more`;
        } else if (e.target.files.length === 1) {
          currentPhoto = e.target.files[0].name;
        }
      }}
      />
      {currentPhoto}
    </label>
    {
       assetTypes
       && assetTypes[info.category]
       && assetTypes[info.category][info.subcategory]
         ? (
          //  <Multilocation
          //    className={styles.location}
          //    handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
          //    handleFieldErrorChanged={handleFieldErrorChanged}
          //    answer={info.assets}
          //    type={assetTypes[info.category][info.subcategory]}
          //    assets={assets.filter(
          //      e => e.asset_type.category.toUpperCase()
          //     === assetTypes[info.category][info.subcategory].toUpperCase()
          //    )}
          //  />
          <InspectionMap
          className={styles.location}
          handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
          handleFieldErrorChanged={handleFieldErrorChanged}
         //  answer={info.assets}
          answer={info.location}
          type={assetTypes[info.category][info.subcategory]}
          assets={assets.filter(
            e => e.asset_type.category.toUpperCase()
           === assetTypes[info.category][info.subcategory].toUpperCase()
          )}
          handleZoomLevel = {(val) => handleWorkOrderZoomLevel(val)}
          handleSelectedAsset= {handleSelectedAsset}
        />
        
         )
         : (
           assetTypes && (
           <PulpoField key="location" id="location" type="location"
             translationID="workorder.create.location"
             className={styles.location} title="Location" isRequired
             handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
             answer={info.location} showFieldErrors={showFormErrors}
             handleFieldErrorChanged={handleFieldErrorChanged}
             handleZoomLevel = {(val) => handleWorkOrderZoomLevel(val)}
           />
           )
         )
      }

    <PulpoField key="desc" id="problem_description" type="string"
      translationID="workorder.create.description" className={styles.field}
      widget={{ type: 'textarea' }} title="Problem description" isRequired
      handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
      answer={info.problem_description}
      rows={9}
      showFieldErrors={showFormErrors} handleFieldErrorChanged={handleFieldErrorChanged}
    />
    { spaceError ? <h6 className={styles.para}>this field is required</h6> : ''}
    <PulpoField key="priority" id="priority" type="select" title="Priority" isRequired
      translationID="workorder.create.priority" className={styles.field}
      handleValueChange={(a, b) => handleAnswerChanged('info', a, b)}
      answer={info.priority }
      showFieldErrors={showFormErrors}
      handleFieldErrorChanged={handleFieldErrorChanged}
      values={[
        { key: '0', value: 'Low' },
        { key: '1', value: 'Medium' },
        { key: '2', value: 'High' }
      ]}
    />
  </div>
);

FixedFieldsForInspections.propTypes = {
  info: PropTypes.shape({}).isRequired,
  handleAnswerChanged: PropTypes.func.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  showFormErrors: PropTypes.bool
};

FixedFieldsForInspections.defaultProps = {
  showFormErrors: false
};

export default FixedFieldsForInspections;
