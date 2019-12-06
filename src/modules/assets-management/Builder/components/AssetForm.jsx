/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone';

import Button from '../../../../components/button';
import ColorSelect from '../../../../components/colorSelect';
import Clickable from '../../../../components/clickable/Clickable';
import styles from '../assetBuilder.module.scss';
import dzstyles from '../../../workorders/Create/components/fixedFields.module.scss';
import PulpoField from '../../../../pulpo_visualizer/fields/PulpoField';
import FormattedMessageWithClass from '../../../../components/formattedMessageWithClass';


class AssetForm extends Component {
  handleDrop = (dropped) => {
    const { onInputChange, info } = this.props;
    const res = info.photos || [];
    onInputChange([...res, ...dropped], 'photos');
  }

  handleRemoveImage = (r) => {
    const { onInputChange, info } = this.props;
    const res = info.photos.filter(e => e !== r);
    onInputChange(res, 'photos', r.id);
  }

  render() {
    const {
      types,
      info,
      onInfoChange,
      onInputChange,
      onAnswerChange,
      onFieldErrorChanged,
      onSave,
      transition,
      shouldShowErrors,
      onDelete,
      onCancel,
      schemas,
      answers,
      requiredMap,
      translation, 
      spaceError,
    } = this.props;

    return (
      <div className={styles.form} style={transition}>
        <div className={styles.head}>
          <Clickable onClick={onCancel} className={styles.cancel}>
        Cancel
          </Clickable>
          <div className={styles.actions}>
            {info.id && (
            <Clickable onClick={onDelete} className={styles.delete}>
              <FormattedMessage id="assets.delete" defaultMessage="Delete" />
            </Clickable>
            )}

            <Button translationID={info.id ? 'assets.save' : 'assets.create'}
              defaultText={info.id ? 'Save' : 'Create'}
              onClick={onSave} action="secondary"
            />
          </div>
        </div>
        <label className={styles.name}>
          <FormattedMessage id="assets.label.name" defaultMessage="Name" />
          <input type="text" id="name"
            placeholder="Name" value={info.name}
            onChange={e => onInputChange(e.target.value, e.target.id)} autoComplete="off"
          />
          <br></br>
          {shouldShowErrors && !info.name && (<span className = {styles.error}>
          <FormattedMessage id="assets.name.error"
            defaultMessage="Name cannot be empty"
          /></span>
          )}
          {spaceError && !info.name.trim() && (<span className = {styles.error}>
          <FormattedMessage id="assets.name.space_error"
            defaultMessage="Spaces are not allowed"
          /></span>
          )}
        </label>
        <label className={styles.labelStyle}>
          <span className = {styles.PaddingStyle}><FormattedMessage id="assets.label.type" defaultMessage="Type" /></span>
          <ColorSelect options={types} value={info.type}
            bordered onChange={onInfoChange}
          />
        </label>
        <label>
          <span className={styles.labelArea}><FormattedMessage id="assets.label.area"  defaultMessage="Area" /></span>
          {info.area && <span className={styles.area}>{info.area.name}</span>}
          {!info.area && (
          <input type="text" id="label"
            onChange={e => onInputChange(e.target.value, e.target.id)}
            autoComplete="off" value={info.label}
          />
          )}
        </label>

        <div className={dzstyles.fullInput}>
          <FormattedMessageWithClass className={dzstyles.label}
            id="workorder.create.photos" defaultMessage="Photos"
          />
          <Dropzone onDrop={this.handleDrop} disableClick
            className={dzstyles.dropzone} accept="image/*"
          >
            {({ open }) => (
              <>
                <p className={`${dzstyles.browsetext} ${styles.browsetext}`}>
                  <FormattedMessage id="airport.logo.text1"
                    defaultMessage="Drag an image here or"
                  />
                  <button type="button" onClick={() => open()}>
                    <FormattedMessage id="airport.logo.button"
                      defaultMessage="browse"
                    />
                  </button>
                  <FormattedMessage id="airport.logo.text2"
                    defaultMessage="for an image to upload."
                  />
                </p>
              </>
            )}
          </Dropzone>
          {info.photos && info.photos.length > 0 && (
          <div className={dzstyles.photos} key={info.id}>
            {info.photos.map(e => (
              <div key={`${info.id}-${e.name || e.id}`} className={`${dzstyles.wrapper} ${styles.wrapper}`}>
                <Clickable onClick={() => this.handleRemoveImage(e)}>&times;</Clickable>
                <img src={e.preview || e.image} alt={e.name || e.id} />
              </div>
            ))}
          </div>
          )}
        </div>

        {schemas[info.type.category.toLowerCase()].schema.fields.map(field => (
          <PulpoField key={field.id} {...field} translation={translation && translation[field.title]}
            handleValueChange={(a, b) => onAnswerChange(a, b, info.id || 'current')}
            isRequired={requiredMap[field.id]} answer={answers[field.id]}
            showFieldErrors={shouldShowErrors} handleFieldErrorChanged={onFieldErrorChanged}
          />
        ))}
      </div>
    );
  }
}


AssetForm.propTypes = {
  onInfoChange: PropTypes.func.isRequired,
  types: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  info: PropTypes.shape({}).isRequired,
  schemas: PropTypes.shape({}).isRequired,
  answers: PropTypes.shape({}).isRequired,
  requiredMap: PropTypes.shape({}),
  onInputChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  transition: PropTypes.shape({}),
  shouldShowErrors: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFieldErrorChanged: PropTypes.func.isRequired
};

AssetForm.defaultProps = {
  shouldShowErrors: false,
  transition: undefined
};

export default AssetForm;
