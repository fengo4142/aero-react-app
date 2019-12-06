import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { uniqueID } from '../../../utils/helpers';

import styles from '../fields.module.scss';
import iconAsset from '../../../icons/assets/workOrder.svg';

class Location extends Component {
  constructor(props) {
    super(props);
    this.ID = uniqueID('map');
    const { isRequired, updateFieldErrors, answer } = this.props;

    if (isRequired && (answer === '' || answer === undefined)) {
      updateFieldErrors(['pulpoforms.errors.not_blank']);
    }
  }

  componentDidMount() {
    const { answer } = this.props;
    if (Array.isArray(answer)) {
      this.initializeMap();
    }
  }

  componentDidUpdate(prevProps) {
    const { answer } = this.props;
    if (!prevProps.answer) {
      if (Array.isArray(answer)) {
        this.initializeMap();
      }
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  handleAnswerChanged = (value, fieldId) => {
    const {
      handleValueChange,
      handleFieldErrorChanged,
      isRequired,
      updateFieldErrors
    } = this.props;

    handleValueChange(value, fieldId);
    let updatedErrors = [];

    if (value === '' || value === undefined) {
      handleFieldErrorChanged(fieldId, isRequired);
      updatedErrors = [
        ...updatedErrors,
        'pulpoforms.errors.not_blank'
      ];
    } else {
      handleFieldErrorChanged(fieldId, false);
    }
    updateFieldErrors(updatedErrors);
  }

  initializeMap = () => {
    const { answer, fieldId, handleZoomLevel } = this.props;
    const curLocation = answer.reverse() || [0, 0];
    this.map = L.map(this.ID, {
      center: curLocation,
      zoom: 15,
      editable: true
    });
    L.gridLayer.googleMutant({ type: 'satellite', maxZoom: 20 }).addTo(this.map);
    // eslint-disable-next-line new-cap
    const marker = new L.marker(curLocation, {
      draggable: 'true',
      icon: new L.Icon({
        iconUrl: iconAsset,
        iconSize: [29, 35],
        iconAnchor: [15, 35]
      })
    });
    this.map.on('click', (e) => {
      const position = e.latlng;
      let zoomLevel = this.map.getZoom();
      handleZoomLevel(zoomLevel)
      marker.setLatLng(position)
      this.handleAnswerChanged([position.lng, position.lat], 'location');
    })
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      const zoomlevel = this.map.getZoom();
      handleZoomLevel(zoomlevel)
      marker.setLatLng(position);
      // send Updated coordinates
      this.handleAnswerChanged([position.lng, position.lat], fieldId);
    });
    const zoomLevel = this.map.getZoom();
    handleZoomLevel(zoomLevel)
    this.map.addLayer(marker);
    this.handleAnswerChanged(curLocation.reverse(), fieldId);
  }

  render() {
    return (
      <div id={this.ID} className={styles.map} />
    );
  }
}


Location.propTypes = {
  handleValueChange: PropTypes.func.isRequired,
  fieldId: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  updateFieldErrors: PropTypes.func.isRequired,
  answer: PropTypes.arrayOf(PropTypes.number)
};

Location.defaultProps = {
  answer: undefined
};

export default Location;
