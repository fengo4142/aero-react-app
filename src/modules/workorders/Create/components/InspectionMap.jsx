/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from '../../../../pulpo_visualizer/fields/fields.module.scss';
import { uniqueID } from '../../../../utils/helpers';
import * as utils from '../../../settings/Map/mapUtils';
import iconAsset from '../../../../icons/assets/workOrder.svg';

class InspectionMap extends Component {

  constructor(props) {
    super(props);
    this.ID = uniqueID('inspectionmap');
    this.state = {
      edit: true,
    }
  }

  componentDidMount() {
    this.initializeMap(true)
  }

  componentWillUnmount () {
    this.initializeMap(false)
  }

  handleAnswerChanged = (value, fieldId) => {
    const { handleValueChange } = this.props;
    handleValueChange(value, fieldId);
  }

  initializeMap = (createMap) => {
    const { assets, answer , handleZoomLevel, handleSelectedAsset} = this.props;
    //  let closestMarkerNearAsset =  assets.length > 0 ? assets[assets.length - 1].geometry.coordinates : ''
    //  let modifiedMarkerNearAsset = [closestMarkerNearAsset[0], closestMarkerNearAsset[1] + 0.0000002500]
    //const curLocation = answer.reverse() || [0, 0];
    //  const markerNearAsset = modifiedMarkerNearAsset.reverse() || [0, 0];
    if (createMap) {
      this.map = L.map(this.ID, {
        // center: markerNearAsset,
        zoom: 15,
        editable: true
      });
      L.gridLayer.googleMutant({ type: 'satellite', maxZoom: 20 }).addTo(this.map);
      // const bounds = markerNearAsset;
      const bounds = [];
      assets.forEach((a) => {
        // load all assets in map
        let l = L.geoJSON(a.geometry)._layers;
        const that = this;

        [l] = Object.keys(l).map(ob => l[ob]);
        const icon = new utils.IconImage({
          iconAnchor: [15, 10],
          icon: a.asset_type.icon,
          id: parseInt(a.id, 10)
        });

        bounds.push(a.geometry.coordinates.reverse());

        l.setIcon(icon).addTo(this.map);
        if (bounds.length) {
          this.map.fitBounds([bounds]);
        }
        l.on('click', (e) => {
          const { edit } = this.state;
            if (edit) {
              that.layer = e.target;

              that.map.eachLayer((layer) => {
                if (layer.editing && layer.editing.enabled()) {
                  layer.editing.disable();
                }
              });
              e.target.editing.enable();

              // get the asset associated
              const { assets: newAsset } = this.props;
              const { asset_type: atype, ...selectedAsset } = newAsset.find(
                b => b.id === e.target.options.icon.options.id
              );
              selectedAsset.type = atype;
              handleSelectedAsset(selectedAsset.id)
              const position = l.getLatLng();
              const zoomLevel = this.map.getZoom();
              handleZoomLevel(zoomLevel)
             this.handleAnswerChanged([position.lng, position.lat], 'location');
            }
        });
        if (bounds.length) {
          this.map.fitBounds([bounds]);
        }
      });

      // const marker = new L.marker(markerNearAsset, {
      //   draggable: 'true',
      //   icon: new L.Icon({
      //     iconUrl: iconAsset,
      //     iconSize: [29, 35],
      //     iconAnchor: [15, 35]
      //   })
      // });

      // this.map.on('click', (e) => {
      //   const position = e.latlng;
      //   const zoomLevel = this.map.getZoom();
      //   handleZoomLevel(zoomLevel)
      //   marker.setLatLng(position)
      //   this.handleAnswerChanged([position.lng, position.lat], 'location');
      // });

      // marker.on('dragend', () => {
      //   const position = marker.getLatLng();
      //   const zoomLevel = this.map.getZoom();
      //   handleZoomLevel(zoomLevel)
      //   marker.setLatLng(position);
      //   this.handleAnswerChanged([position.lng, position.lat], 'location');
      // });
      // this.map.addLayer(marker);
      // const zoomLevel = this.map.getZoom();
      // handleZoomLevel(zoomLevel)
      this.handleAnswerChanged(answer.reverse(), 'location');
    }

    else {
      this.map.eachLayer((layer) => {
        if (layer.feature !== undefined) {
          this.map.removeLayer(layer);
        }
      });
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`${className} ${styles.field}`}>
        <div id={this.ID} className={styles.map} />
      </div>
    );
  }
}

InspectionMap.propTypes = {
  handleValueChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

InspectionMap.defaultProps = {
  className: ''
};
export default InspectionMap;