import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './map.module.scss';

import ColorSelect from '../../../components/colorSelect';

class Toolbar extends Component {
  constructor(props) {
    super(props);
    const { types, allLayers } = this.props;
    this.state = {
      editMode: false,
      typeSelected: types[0],
      layerSelected: allLayers[0]
    };
    this.toggleView = this.toggleView.bind(this);
  }


  toggleView() {
    const { changeView } = this.props;
    this.setState(prevState => ({
      editMode: !prevState.editMode
    }));
    const { editMode } = this.state;
    changeView(editMode);
  }

  render() {
    const { editMode, layerSelected, typeSelected } = this.state;
    const { onTypeChange, onLayerChange, types, allLayers, surfaceCounter } = this.props;
    if (editMode) {
      return (
        <div className={styles.toolbar}>
          <button type="button" onClick={this.toggleView}>Back to Airfield Surfaces View</button>
          <div className={styles.typeSelector}>
            <ColorSelect options={types}
              value={typeSelected}
              onChange={(e) => { onTypeChange(e); this.setState({ typeSelected: e }); }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.toolbar}>
        <div className={styles.selector}>
          <ColorSelect options={allLayers}
            value={layerSelected}
            onChange={(e) => { onLayerChange(e); this.setState({ layerSelected: e }); }}
          />
          <div className={styles.counter}>
            <span>{`${surfaceCounter} `}</span>
            Surfaces
          </div>
        </div>
        <span className="primary-btn" onClick={this.toggleView}>
          <FormattedMessage id="section.toolbar.create" defaultMessage="Create New Surface" />
        </span>
      </div>
    );
  }
}

export default Toolbar;

Toolbar.propTypes = {
  allLayers: PropTypes.arrayOf(PropTypes.object),
  types: PropTypes.arrayOf(PropTypes.object),
  surfaceCounter: PropTypes.number,
  changeView: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onLayerChange: PropTypes.func.isRequired
};

Toolbar.defaultProps = {
  allLayers: [],
  types: [],
  surfaceCounter: 0
};
