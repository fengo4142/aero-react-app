/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './assetSchemaBuilder.module.scss';

const AssetSelfInspection = ({ values, selfInspection, onSelectChange }) => (
  <table className={styles.panel}>
    <thead>
      <tr>
        <th>Category</th>
        <th>Subcategory</th>
        <th>Asset</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(selfInspection).map(id => selfInspection[id].checklist.map(ch => (
        <tr key={`${id}-${ch.key}`}>
          <td>{selfInspection[id].title}</td>
          <td>{ch.value}</td>
          <td>
            <select onChange={e => onSelectChange(id, ch.key, e.target.value)}
              value={values && values[id] ? values[id][ch.key] : ''}
            >
              <option value="">None</option>
              <option value="signs">Signs</option>
              <option value="lights">Lights</option>
            </select>
          </td>
        </tr>
      )))}
    </tbody>
  </table>
);

AssetSelfInspection.propTypes = {
  selfInspection: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  onSelectChange: PropTypes.func.isRequired
};

export default AssetSelfInspection;
