/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import moment from 'moment/min/moment-with-locales';
import styles from '../workOrderList.module.scss';
import mapStyles from '../../../settings/Map/map.module.scss';
import iconAsset from '../../../../icons/assets/workOrder.svg';
import iconOperation from '../../../../icons/assets/operations.svg';
import iconCompleted from '../../../../icons/assets/completed.svg';

class Map extends Component {
  markers = L.layerGroup();

  componentDidMount() {
    const { defaultLocation, workorders, workorderDetail } = this.props;
    this.map = L.map('map', {
      fullscreenControl: true,
      center: [...defaultLocation].reverse()
    });
    L.gridLayer.googleMutant({ type: 'satellite', maxZoom: 20 }).addTo(this.map);
  }

  componentDidUpdate(prevProps) {
    const { workorders, defaultLocation } = this.props;
    const bounds = [];

    const assets = {
      1: iconAsset,
      2: iconOperation,
      3: iconCompleted
    };

    if ((prevProps.defaultLocation[0] !== defaultLocation[0])
      || (prevProps.defaultLocation[1] !== defaultLocation[1])) {
      this.map.setView([...defaultLocation].reverse(), 15);
    }

    this.markers.clearLayers();
    if (workorders.length) {
      workorders.forEach((w) => {
        let locations = w.assets.length > 0 ? w.assets : (w.location && w.location.length > 0 ? w.location : null);
        if(locations != null) {
          locations = [...locations]
          locations.forEach((loc) => {
            // eslint-disable-next-line new-cap
            const marker = new L.marker(loc, {
              icon: new L.Icon({
                iconUrl: assets[w.status],
                iconSize: [29, 35],
                iconAnchor: [15, 35]
              })
            });
            this.addPopupToPoint(w, marker);
            bounds.push([loc.lat, loc.lon]);
            this.markers.addLayer(marker);
          });
        }
      });
      this.markers.addTo(this.map);
      this.map.fitBounds([bounds]);
      if(workorders.length == 1) {
        this.map.setZoom(workorders[0].zoom_level);
      }
    }
  }

  addPopupToPoint = (asset, layer) => {
    const { category, subcategory, report_date, id } = asset;
    const customPopup = `
      <div class=${mapStyles.tooltipHeader}>
          <h4>${category}</h4>
          <a href="/ops/workorders/${id}/detail"> view details </a>
      </div>
      <p>${subcategory}</p>
      <p>${moment(report_date).format('MM/DD/YYYY hh:mm A')}</p>
    `;
    // specify popup options
    const customOptions = { className: mapStyles.tooltip, width: '200' };
    layer.bindPopup(customPopup, customOptions);
  }

  render() {
    return <div id="map" className={styles.map} />;
  }
}

Map.propTypes = {
  workorders: PropTypes.arrayOf(PropTypes.shape({})),
  defaultLocation: PropTypes.arrayOf(PropTypes.number)
};

Map.defaultProps = {
  workorders: [],
  defaultLocation: [0, 0]
};
export default Map;
