import React from 'react';
import PropTypes from 'prop-types';
import styles from '../assetBuilder.module.scss';
import Clickable from '../../../../components/clickable/Clickable';
import editIcon from '../../../../icons/inspection-icons/edit.svg';

const TypesToolbar = ({ types, onAssetClick, onEditClick }) => (
  <div className={styles.toolbar}>
    {/* <Clickable className={styles.edit} onClick={onEditClick}>
      <img src={editIcon} alt="edit" />
    </Clickable> */}
    {types.map(t => (
      <Clickable key={t.id} onClick={() => onAssetClick(t)}>
        <img src={t.icon} alt={t.name} />
      </Clickable>
    ))}
  </div>
);

TypesToolbar.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onAssetClick: PropTypes.func.isRequired
};
export default TypesToolbar;
