/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from '../../../../pulpo_visualizer/fields/fields.module.scss';
import { uniqueID } from '../../../../utils/helpers';
import * as utils from '../../../settings/Map/mapUtils';
import iconAsset from '../../../../icons/assets/workOrder.svg';

class Multilocation extends Component {

  constructor(props) {
    super(props);
    this.ID = uniqueID('multimap');
    this.state = {
      edit: true,
    }
  }

  componentDidMount() {
    this.initializeMap(true)
  }

  componentDidUpdate(prevProps) {
    const { type, selectedAsset } = this.props;
    if (prevProps.type !== type || prevProps.selectedAsset !== selectedAsset) {
      if (this.initializeMap) {
        this.map.remove();
        this.initializeMap(true)
      }
    }
  }

  handleAnswerChanged = (value, fieldId) => {
    const { handleValueChange } = this.props;
    handleValueChange(value, fieldId);
  }

  initializeMap = (createMap) => {
    const { assets, answer, handleSelectedAsset, handleZoomLevel  } = this.props;

    console.log('Answer'+ answer)
    // let closestMarkerNearAsset =  assets.length > 0 ?  assets[assets.length - 1].geometry.coordinates:  answer
    // let modifiedMarkerNearAsset = [closestMarkerNearAsset[0], closestMarkerNearAsset[1] + 0.0002500]
    // const curLocation = answer.reverse() || [0, 0];
    // const markerNearAsset = modifiedMarkerNearAsset.reverse() || [0, 0];
    if (createMap) {
      this.map = L.map(this.ID, {
        // center: markerNearAsset,
        zoom: 14,
        editable: true
      });
      L.gridLayer.googleMutant({ type: 'satellite', maxZoom: 20 }).addTo(this.map);

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
        // this.map.addLayer(icon);
        // console.log(JSON.stringify(bounds))
        // if (bounds.length) {
        //   this.map.fitBounds([bounds]);
        // }

        // --- On click Handler for Asset ---//
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
              this.handleAnswerChanged([position.lng, position.lat], 'location');
            }
        });

        if (bounds.length) {
          this.map.fitBounds([bounds]);
        }
      });

      // this.map.on('click', (ev) => {
      //   const marker = new L.marker(markerNearAsset, {
      //     draggable: 'true',
      //     icon: new L.Icon({
      //       iconUrl: iconAsset,
      //       iconSize: [29, 35],
      //       iconAnchor: [15, 35]
      //     })
      //   });
        // this.map.on('click', (e) => {
        //   const position = e.latlng;
        //   let zoomLevel = this.map.getZoom();
        //   this.props.handleZoomLevel(zoomLevel)
        //   marker.setLatLng(position)
        //   this.handleAnswerChanged([position.lng, position.lat], 'location');
        // });

        // marker.on('dragend', () => {
        //   const position = marker.getLatLng();
        //   const zoomLevel = this.map.getZoom();
        //   this.props.handleZoomLevel(zoomLevel)
        //   marker.setLatLng(position);
        //   this.handleAnswerChanged([position.lng, position.lat], 'location');

        // });
        // this.map.addLayer(marker);
    // });
      // marker.on('dragend', () => {
      //   const position = marker.getLatLng();
      //   marker.setLatLng(position);
      //   this.handleAnswerChanged([position.lng, position.lat], 'location');
      // });
      const zoomLevel = this.map.getZoom();
      handleZoomLevel(zoomLevel)
      // this.map.addLayer(marker);
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

Multilocation.propTypes = {
  handleValueChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

Multilocation.defaultProps = {
  className: ''
};
export default Multilocation;
