import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';

import SelectInput from '../SelectInput';

import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import styles from './fieldWidget.module.scss';

class FieldWidget extends Component {
  constructor(props) {
    super(props);

    this.fieldOptions = [
      { key: 'string', name: 'String' },
      { key: 'number', name: 'Number' },
      { key: 'boolean', name: 'Boolean' },
      { key: 'date', name: 'Date / Datetime' },
      { key: 'select', name: 'Selection' }
    ];

    this.requiredOptions = [
      { key: 'required', name: 'Mandatory' },
      { key: 'optional', name: 'Optional' }
    ];

    this.availableWidgets = {
      string: [
        { key: 'charfield', name: 'Text' },
        { key: 'textfield', name: 'Text Area' }
      ],
      select: [
        { key: 'dropdown', name: 'Dropdown' },
        { key: 'radio', name: 'Radio' }
      ]
    };

    if (props.info) {
      this.state = {
        fieldType: this.getFieldType(props.info),
        fieldRequired: props.info.required ? this.requiredOptions[0] : this.requiredOptions[1],
        fieldWidget: props.info.widget && this.availableWidgets[
          props.info.type].find(e => e.key === props.info.widget.type),
        name: props.info.title,
        dropdownOptions: props.info.values ? props.info.values.map(e => e.value) : [],
        datetime: (props.info.type === 'datetime'),
        multiselect: (props.info.type === 'multiselect')
      };
    } else {
      this.state = {
        fieldType: this.fieldOptions[0],
        fieldRequired: this.requiredOptions[0],
        fieldWidget: this.availableWidgets[this.fieldOptions[0].key][0],
        name: '',
        dropdownOptions: [],
        datetime: false,
        multiselect: false
      };
    }
    this.updateFieldValue();
  }

  getFieldType(info) {
    if (info) {
      switch (info.type) {
        case 'datetime':
          return this.fieldOptions.find(e => e.key === 'date');
        case 'multiselect':
          return this.fieldOptions.find(e => e.key === 'select');
        default:
          return this.fieldOptions.find(e => e.key === info.type);
      }
    }
    return undefined;
  }

  updateFieldValue() {
    const fieldInfo = this.state;
    const { onChangeField, info } = this.props;
    const ret = {
      id: info && info.id ? info.id : '',
      type: fieldInfo.fieldType.key,
      title: fieldInfo.name,
      required: (fieldInfo.fieldRequired.key === 'required')
    };

    if (ret.type === 'select') {
      ret.values = fieldInfo.dropdownOptions.map((o, i) => ({ key: `${i}`, value: o }));
      if (fieldInfo.multiselect) {
        ret.type = 'multiselect';
      } else if (!fieldInfo.fieldWidget) {
        const [firstWidget] = this.availableWidgets.select;
        fieldInfo.fieldWidget = firstWidget;
      }
    }
    if (ret.type === 'date' && fieldInfo.datetime) {
      ret.type = 'datetime';
    }
    if (this.availableWidgets[ret.type]) {
      ret.widget = { type: fieldInfo.fieldWidget.key };
    }
    onChangeField(ret);
  }

  handleChange(t, v) {
    if (t === 'fieldType') {
      this.setState({
        [t]: v,
        multiselect: false,
        datetime: false,
        fieldWidget: this.availableWidgets[v.key] && this.availableWidgets[v.key][0]
      }, this.updateFieldValue);
    } else {
      this.setState({ [t]: v }, this.updateFieldValue);
    }
  }

  render() {
    const {
      fieldType,
      fieldRequired,
      fieldWidget,
      name,
      dropdownOptions,
      datetime,
      multiselect
    } = this.state;
    return (
      <div className={styles.fieldWidget}>
        <div className={styles.col}>
          <label htmlFor="Name">
            <FormattedMessage id="inspections.step2.newField.name" defaultMessage="Field Name" />
            <input name="Name" defaultValue={name} onChange={e => this.handleChange('name', e.nativeEvent.target.value)} />
          </label>

          <label htmlFor="Type">
            <FormattedMessage id="inspections.step2.newField.type" defaultMessage="Field Type" />

            <SelectInput value={fieldType} options={this.fieldOptions}
              onChange={e => this.handleChange('fieldType', e)}
            />
          </label>
          {fieldType.key === 'select' && (
            <div className={styles.inlineCheckbox}>
              <label>
                <FormattedMessage id="inspections.step2.newField.invalid" defaultMessage="Allow multiple selection" />
                <input defaultChecked={multiselect} type="checkbox"
                  onChange={e => this.handleChange('multiselect', e.nativeEvent.target.checked)}
                />
              </label>
            </div>
          )}
        </div>
        <div className={styles.col}>
          <label htmlFor="required">
            <FormattedMessage id="inspections.step2.newField.required" defaultMessage="Field Is" />

            <SelectInput value={fieldRequired} options={this.requiredOptions}
              onChange={e => this.handleChange('fieldRequired', e)}
            />
          </label>
          {fieldType.key === 'date' && (
            <div className={styles.showTime}>
              <label>
                <FormattedMessage id="inspections.step2.newField.time" defaultMessage="Show time" />
                <input defaultChecked={datetime} type="checkbox"
                  onChange={e => this.handleChange('datetime', e.nativeEvent.target.checked)}
                />
              </label>
            </div>
          )}
          { this.availableWidgets[fieldType.key] && !multiselect && (
            <label htmlFor="widget">
              <FormattedMessage id="inspections.step2.newField.invalid" defaultMessage="Field Widget" />

              <SelectInput value={fieldWidget || {}} options={this.availableWidgets[fieldType.key]}
                onChange={e => this.handleChange('fieldWidget', e)}
              />
            </label>
          )}
        </div>
        {fieldType.key === 'select' && (
        <div className={styles.extra}>
          <label htmlFor="Name">
            <FormattedMessage id="inspections.step2.newField.dwnOptions" defaultMessage="Dropdown options" />
            <TagsInput value={dropdownOptions} onlyUnique inputProps={{ placeholder: 'add option' }}
              onChange={tags => this.handleChange('dropdownOptions', tags)} addKeys={[9, 13, 188]}
            />
          </label>

        </div>
        )}
      </div>
    );
  }
}

FieldWidget.propTypes = {
  onChangeField: PropTypes.func.isRequired,
  info: PropTypes.shape({
    type: PropTypes.string,
    required: PropTypes.bool,
    title: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.object),
    widget: PropTypes.shape({
      type: PropTypes.string
    })
  })
};

FieldWidget.defaultProps = {
  info: undefined
};

export default FieldWidget;
