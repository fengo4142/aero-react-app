/* eslint no-underscore-dangle: 0 */
/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import { connect } from 'react-redux';
import { addSurface, fetchSurfaces,
  fetchSurfaceTypes, addSurfaceType } from './redux/actions';

import * as utils from './mapUtils';

import MapForm from './mapForm';
import Toolbar from './toolbar';

import styles from './map.module.scss';

let drawControl;
let map = {};
const drawnItems = {};


class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: false,
      layer: {},
      counter: 0,
      typeSelected: undefined,
      allLayers: [{ key: -1, name: 'All Surfaces', color: '#CCCCCC' }]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLayerChange = this.handleLayerChange.bind(this);
    this.changeView = this.changeView.bind(this);

    this.defaultConfig = {
      marker: false,
      circle: false,
      rectangle: false,
      polyline: false,
      circlemarker: false
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user.id) {
      this.initializeMap();
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (!prevProps.user.id && user.id) {
      this.initializeMap();
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.typeSelected) {
      // adding edit control
      props.types.map(({ key }) => {
        drawnItems[key] = new L.FeatureGroup();
        map.addLayer(drawnItems[key]);
        return true;
      });
      return { typeSelected: props.types[0] };
    }

    if (state.allLayers.length === 1) {
      let allLayers = [{ key: -1, name: 'All Surfaces', color: '#CCCCCC' }];
      props.surfaces.forEach((o) => {
        let l = L.geoJSON(o.geometry)._layers;
        [l] = Object.keys(l).map(ob => l[ob]);
        const customlayer = utils.addPopupToLayer(o, l);

        drawnItems[o.surface_type.id].addLayer(customlayer);
        allLayers.push({
          key: o.surface_type.id,
          name: o.surface_type.name,
          color: o.surface_type.color
        });
      });
      allLayers = allLayers.filter(
        (l, index, self) => self.findIndex(
          t => t.key === l.key
        ) === index
      );
      return { ...state, allLayers, counter: props.surfaces.length };
    }
    return null;
  }

  initializeMap() {
    const { actionFetch, actionFetchTypes, user } = this.props;
    actionFetch(user.airport.id);
    actionFetchTypes(user.airport.id);

    map = L.map('map', {
      center: [...user.airport.location.coordinates].reverse(),
      zoom: 15
    });
    L.gridLayer.googleMutant({ type: 'satellite', maxZoom: 20 }).addTo(map);

    // creation callback for triggering form.
    const that = this;

    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems[that.state.typeSelected.key].addLayer(e.layer);
      utils.toggleZooming(map, 'disable');
      that.setState({ popup: true, layer: e.layer });
    });
  }

  handleChange(type) {
    map.removeControl(drawControl);
    drawControl = this.drawNewControl(type);
    this.setState({ typeSelected: type });
    map.addControl(drawControl);
  }

  handleLayerChange(option) {
    Object.keys(drawnItems).forEach(k => (
      map.removeLayer(drawnItems[k])
    ));

    if (option.key === -1) {
      let counter = 0;

      Object.keys(drawnItems).forEach((k) => {
        counter += Object.keys(drawnItems[k]._layers).length;
        map.addLayer(drawnItems[k]);
      });
      this.setState({ counter });
    } else {
      map.addLayer(drawnItems[option.key]);
      this.setState({ counter: Object.keys(drawnItems[option.key]._layers).length });
    }
  }

  drawNewControl(controlType) {
    return new L.Control.Draw({
      edit: { featureGroup: drawnItems[controlType.key] },
      draw: {
        ...this.defaultConfig,
        polygon: {
          shapeOptions: {
            color: controlType.color,
            opacity: 1,
            fillOpacity: 0.48
          },
          icon: new utils.CustomIcon({ color: controlType.color })
        }
      }
    });
  }

  changeView(editMode) {
    const { types } = this.props;
    if (!editMode) {
      drawControl = this.drawNewControl(types[0]);
      map.addControl(drawControl);
    } else {
      map.removeControl(drawControl);

      // update counter
      let counter = 0;
      Object.keys(drawnItems).forEach((k) => {
        counter += Object.keys(drawnItems[k]._layers).length;
      });
      this.setState({ counter });
    }
  }

  handleSubmit(data) {
    utils.toggleZooming(map, 'enable');
    this.setState({ popup: false });

    const { key } = data.surface_type;
    const { layer, typeSelected } = this.state;
    const { actionSave, user } = this.props;

    const customlayer = utils.addPopupToLayer(data, layer);
    if (key !== typeSelected.key) {
      drawnItems[typeSelected.key].removeLayer(layer);
      drawnItems[key].addLayer(layer);
    }

    map.addLayer(customlayer);
    this.setState({ layer: {} });

    const coordinates = customlayer._latlngs[0].map(o => [o.lng, o.lat]);
    coordinates.push(coordinates[0]);
    const surfaceShape = {
      surface_type: data.surface_type.key,
      airport: user.airport.id,
      name: data.name,
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      }
    };
    actionSave(surfaceShape);
  }

  render() {
    const { popup, counter, typeSelected, allLayers } = this.state;
    const { types } = this.props;
    return (
      <>
        <Toolbar
          key={types[0] ? types[0].key : 0}
          onLayerChange={this.handleLayerChange}
          onTypeChange={this.handleChange}
          types={types}
          changeView={this.changeView}
          allLayers={allLayers}
          surfaceCounter={counter}
        />

        <div id="map" className={styles.map} />
        {popup && (
          <MapForm
            types={types}
            onSubmit={this.handleSubmit}
            onTypeChange={this.handleTypeChange}
            defaultType={typeSelected}
          />)}
      </>
    );
  }
}


Map.propTypes = {
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({}).isRequired,
  // Dispatch redux functions
  actionSave: PropTypes.func.isRequired,
  actionFetch: PropTypes.func.isRequired,
  actionFetchTypes: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  surfaces: state.map.surfaces,
  types: state.map.types,
  user: state.auth.profile
});

const mapDispatchToProps = dispatch => ({
  // Save surface
  actionFetch: (id) => {
    dispatch(fetchSurfaces(id));
  },
  // Save surface
  actionSave: (surface) => {
    dispatch(addSurface(surface));
  },
  // Save surface
  actionFetchTypes: (id) => {
    dispatch(fetchSurfaceTypes(id));
  },
  // Save surface
  actionSaveType: (surface) => {
    dispatch(addSurfaceType(surface));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
