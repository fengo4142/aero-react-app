/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import leafletPip from '@mapbox/leaflet-pip';

/** ****************************************************************************
 *  Leaflet import
 * ***************** */
import 'leaflet/dist/leaflet.css';
import 'leaflet.gridlayer.googlemutant';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

/** ****************************************************************************
 *  Redux import
 * ************* */
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  fetchAssetTypes,
  addAsset,
  clear,
  fetchAssets,
  editAsset,
  deleteAsset,
  fetchAssetsSchema
} from '../redux/actions';
import { fetchSurfaces } from '../../settings/Map/redux/actions';
import { showConfirmModal, hideModal } from '../../../general_redux/actions';

/** ****************************************************************************
 *  Components import
 * ****************** */
import TypesToolbar from './components/TypesToolbar';
import AssetForm from './components/AssetForm';
import Clickable from '../../../components/clickable/Clickable';
import Modal from '../../../components/modal'
import Button from '../../../components/button'

/** ****************************************************************************
 *  Asset import
* ************* */
import * as utils from '../../settings/Map/mapUtils';
import styles from './assetBuilder.module.scss';

class AssetBuilder extends Component {
  state = {
    form: false,
    edit: true,
    showFeedback: false,
    info: {},
    shouldShowErrors: false,
    answers: {},
    requiredMap: {},
    photosToRemove: [],
    showModal: false,
    fieldErrors: {},
    spaceError:false
  };

  slideStyles = {
    entered: { transform: 'translate3d(0px,0px,0px)' }
  }

  componentDidMount() {
    const {
      user,
      actionFetchTypes,
      actionFetch,
      actionFetchSurfaces,
      actionFetchSchemas,
      schemas
    } = this.props;

    // initialize map and data structures
    if (!this.map && user.id) {
      actionFetchTypes();
      actionFetch(this.props.state);
      actionFetchSurfaces();
      this.initializeMap();
    }

    if (!schemas.lights && !schemas.signs) actionFetchSchemas();
  }

  componentDidUpdate(prevProps) {
    const {
      user,
      assets,
      actionFetchTypes,
      actionFetch,
      actionFetchSurfaces,
    } = this.props;


      if (this.props.createAction.success !== prevProps.createAction.success) {
        this.setState({ showFeedback: true, form: false}, ()=>{
          this.showModal();
          this.marker && this.marker.disable();
        })
      }

    // initialize map and data structures
    if (!this.map && user.id) {
      actionFetchTypes();
      actionFetch(this.props.state);
      actionFetchSurfaces();
      this.initializeMap();
    }

    const that = this;
    let count = 1;
    if (this.map) {
      count = Object.keys(this.map._layers).length;
    }

    if (count === 1 || assets.length !== prevProps.assets.length) {
      assets.forEach((a) => {
        // load all assets in map
        let l = L.geoJSON(a.geometry)._layers;
        [l] = Object.keys(l).map(ob => l[ob]);
        const icon = new utils.IconImage({
          iconAnchor: [15, 10],
          icon: a.asset_type.icon,
          id: a.id
        });
        l.setIcon(icon).addTo(this.map);

        // On click Handler
        l.on('click', (e) => {
          const { surfaces } = this.props;
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
            const { asset_type: atype, ...theAsset } = newAsset.find(
              b => b.id === e.target.options.icon.options.id
            );

            theAsset.type = atype;
            theAsset.area = surfaces.find(s => s.id === theAsset.area);

            const cat = theAsset.type.category.toLowerCase();
            const { fieldErrors } = this.state;
            const categoryErrors = fieldErrors[cat] ? fieldErrors[cat] : {};
            const errors = Object.keys(categoryErrors).map(() => false);

            this.setState({
              form: true,
              info: theAsset,
              fieldErrors: {
                [cat]: errors
              }
            });
          }
        });
      });
    }
  }


  showModal = () => {
    this.setState({ showModal: true},() => {
    this.props.actionClear()
    })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.assets.length) {
      const answers = props.assets.reduce(
        (all, field) => ({ ...all, [field.id]: field.response }), {}
      );
      answers.current = {};
      return { ...state, answers };
    }

    let answers;
    if (props.createAction.success) {
      // Update answer state with new assets
      answers = props.assets.reduce(
        (all, field) => ({ ...all, [field.id]: field.response }), {}
      );
      answers.current = {};
    } else {
      answers = Object.assign({}, state.answers);
    }
    if (props.createAction.success || props.deleteAction.success) {
      props.actionClear();
      return {
        ...state,
        answers,
        form: false,
        info: {
          ...state.info,
          id: '',
          label: '',
          name: '',
          geometry: ''
        },
        photosToRemove: [],
      };
    }
    if (!Object.keys(state.requiredMap).length) {
      let requiredMap = {};
      let fieldErrors = {};
      Object.keys(props.schemas).forEach((s) => {
        props.schemas[s].schema.fields.forEach((f) => {
          requiredMap = {
            ...requiredMap,
            [s]: {
              ...requiredMap[s],
              [f.id]: f.required
            }
          };
          fieldErrors = {
            ...fieldErrors,
            [s]: {
              ...fieldErrors[s],
              [f.id]: f.required
            }
          };
        });
      });
      return { ...state, requiredMap, fieldErrors };
    }
    return state;
  }

  initializeMap = () => {
    const { user } = this.props;

    this.map = L.map('map', {
      center: [...user.airport.location.coordinates].reverse(),
      zoom: 18
    });
    L.gridLayer.googleMutant({ type: 'satellite', maxZoom: 20 }).addTo(this.map);

    this.map.on(L.Draw.Event.CREATED, (e) => {
      this.onMarkerCreated(e);
    });

    this.map.on('draw:editmove', (e) => {
      this.onMarkerEdited(e);
    });
  }

  handleAssetClick = (value) => {
    this.handleTypeChange(value, false);

    utils.disableEditMarkers(this.map);
    this.setState(prevState => ({
      form: false,
      edit: false,
      info: {
        ...prevState.info,
        id: '',
        label: '',
        name: '',
        geometry: ''
      }
    }));

    if (this.marker) this.marker.disable();
    this.marker = new L.Draw.Marker(this.map, {
      icon: new utils.IconImage({ iconAnchor: [15, 10], icon: value.icon })
    });
    this.marker.enable();
  }

  handleEditClick = () => {
    this.setState({ edit: true });
    this.marker.disable();
  }

  handleTypeChange = (selected, changeIcon = true) => {
    if (changeIcon) {
      const icon = new utils.IconImage({ iconAnchor: [15, 10], icon: selected.icon });
      this.layer.setIcon(icon);
    }
    this.setState(prevState => ({
      info: {
        ...prevState.info,
        type: selected
      }
    }));
  }

  handleInputChange = (value, id, removeId) => {
    const { photosToRemove } = this.state;

    if (removeId) {
      photosToRemove.push(removeId);
    }
    this.setState(prevState => ({
      shouldShowErrors: false,
      info: {
        ...prevState.info,
        [id]: value
      },
      photosToRemove
    }));
  }

  handleAnswerChange = (value, id, fieldid) => {
    const {spaceError} = this.state;
    this.setState({spaceError:false})
    this.setState(prevState => ({
      shouldShowErrors: false,
      answers: {
        ...prevState.answers,
        [fieldid]: {
          ...prevState.answers[fieldid],
          [id]: value
        }
      }
    }));
  }

  handleFieldErrorChanged = (id, value) => {
    const { info } = this.state;
    const cat = info.type.category.toLowerCase();
    this.setState(prevState => ({
      fieldErrors: {
        ...prevState.fieldErrors,
        [cat]: {
          ...prevState.fieldErrors[cat],
          [id]: value
        }
      }
    }));
  }

  onMarkerCreated = (e) => {
    // Add a new marker when one is placed.
    e.layer.addTo(this.map);
    const { info } = this.state;
    this.layer = e.layer;
    this.marker = new L.Draw.Marker(this.map, {
      icon: new utils.IconImage({ iconAnchor: [15, 10], icon: info.type.icon })
    });
    this.marker.disable();
    const { surfaces } = this.props;
    let area;

    surfaces.forEach((s) => {
      const surfaceLayer = L.geoJSON(s.geometry);
      const inside = leafletPip.pointInLayer(
        e.layer.getLatLng(), surfaceLayer
      ).length > 0;
      if (inside) area = s;
    });

    // Open form
    this.setState(prevState => ({
      form: true,
      info: {
        ...prevState.info,
        geometry: {
          type: 'Point',
          coordinates: [
            e.layer.getLatLng().lng,
            e.layer.getLatLng().lat
          ]
        },
        area
      }
    }));
  }

  onMarkerEdited = (e) => {
    const { surfaces } = this.props;
    let area;
    surfaces.forEach((s) => {
      const surfaceLayer = L.geoJSON(s.geometry);
      const inside = leafletPip.pointInLayer(
        e.layer.getLatLng(), surfaceLayer
      ).length > 0;
      if (inside) area = s;
    });


    this.setState(prevState => ({
      info: {
        ...prevState.info,
        geometry: {
          type: 'Point',
          coordinates: [
            e.layer.getLatLng().lng,
            e.layer.getLatLng().lat
          ]
        },
        area: area || null
      }
    }));
  }

  handleCancel = () => {
    this.setState(prevState => ({
      form: false,
      info: {
        ...prevState.info,
        id: '',
        label: '',
        name: '',
        geometry: ''
      }
    }));
    utils.disableEditMarkers(this.map);
  }

  handleDelete = () => {
    const { info } = this.state;
    const {
      actionDelete,
      actionConfirm,
      actionHideModal
    } = this.props;

    const content = {
      title: 'Remove Asset',
      body: 'Are you sure you want to delete this asset?'
    };

    actionConfirm(content, () => {
      actionDelete(info.id);
      this.map.eachLayer((layer) => {
        if (layer.editing && layer.editing.enabled()) {
          this.map.removeLayer(layer);
        }
      });
      this.setState(prevState => ({form : false}))
      actionHideModal();
    }, actionHideModal);
  }

  handleSave = () => {
    const { info: { id, type, ...data }, photosToRemove, answers, fieldErrors } = this.state;
    const { actionSave, actionEdit, schemas } = this.props;
    const cat = type.category.toLowerCase();
    const categoryErrors = fieldErrors[cat] ? fieldErrors[cat] : {};
    const noErrors = Object.keys(categoryErrors)
      .every(k => (fieldErrors[cat][k] === false));
    if (noErrors) {
      data.asset_type = type.id;

      if (data.area) {
        data.area = data.area.id;
      } else {
        delete data.area;
      }
      data.response = answers[id || 'current'];
      if (Object.keys(data.response ? data.response : {}).length === 0) {
        data.response = Object.keys(categoryErrors).reduce((t, e) => {
          const aux = t; aux[e] = '';
          return aux;
        }, {});
      }
      data.response = JSON.stringify(data.response);

      data.version_schema = schemas[type.category.toLowerCase()].id;
      data.geometry = JSON.stringify(data.geometry);
      if (photosToRemove.length > 0) {
        data.photosToRemove = photosToRemove;
      }

      // transform data into formData
      const formData = new FormData();
      Object.keys(data).forEach((k) => {
        if (k === 'photos') {
          data.photos.forEach((e) => {
            // if (e instanceof File) {
              formData.append(k, e);
            // }
          });
        } else {
          formData.append(k, data[k]);
        }
      });

      if (!data.name) {
        this.setState({ shouldShowErrors: true });
        this.setState({ spaceError:false });
        return;
      }
      if(!data.name.trim()){
        this.setState({spaceError:true});
       return;
      }else if (id) {
        actionEdit(id, formData);
      } else {
        actionSave(formData);
        this.marker.enable();
        this.layer = undefined;
      }
      utils.disableEditMarkers(this.map);
    } else {
      this.setState({ shouldShowErrors: true });
    }
  }

  closeModal = () => {
    this.setState({showModal: false, showFeedback: false
    },
    )
  }

  render() {
    const { types, history, schemas, translations, user } = this.props;
    const { form, info, shouldShowErrors, answers, requiredMap, spaceError } = this.state;

    const translationMap = translations ? translations[user.language] : {};
    return (
      <div className={styles.assetMap}>
        <div className={styles.backToolbar}>
          <Clickable onClick={() => { history.push('/ops/assets'); }}>
            <FormattedMessage id="assets.back" defaultMessage="Back" />
          </Clickable>
        </div>
        <div id="map" className={styles.map} />
        <TypesToolbar types={types} onAssetClick={this.handleAssetClick}
          onEditClick={this.handleEditClick}
        />
        { this.state.showFeedback && 
          (
            <Modal
              onClose={()=>this.closeModal()}
              showIn={this.state.showModal}
              width="25%"
              minHeight="20%">
                <div className={styles.modal}>
                  <FormattedMessage id="assets.new.saved" defaultMessage="Successfully Saved"/>
                </div>
                <div className={styles.btn}>
                  <Button type="secondary" translationID="assets.modal.close" onClick={()=>this.closeModal()} defaultText="Close"/>
                </div>
            </Modal>
          )
        }
          { !this.state.showFeedback && this.state.form && 
        <Transition in={form} timeout={200} unmountOnExit>
          { state => (
            <AssetForm
              types={types}
              info={info}
              schemas={schemas}
              translation={translationMap}
              answers={answers[info.id || 'current']}
              transition={this.slideStyles[state]}
              requiredMap={requiredMap[info.type.category.toLowerCase()]}
              shouldShowErrors={shouldShowErrors}
              onSave={this.handleSave}
              onCancel={this.handleCancel}
              onDelete={this.handleDelete}
              onInfoChange={this.handleTypeChange}
              onInputChange={this.handleInputChange}
              onAnswerChange={this.handleAnswerChange}
              onFieldErrorChanged={this.handleFieldErrorChanged}
              spaceError={spaceError}
            />
          )}
        </Transition>
        }
      </div>
    );
  }
}

AssetBuilder.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  history: PropTypes.shape({}).isRequired,
  surfaces: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  user: PropTypes.shape({}).isRequired,
  // Redux actions
  actionFetchTypes: PropTypes.func.isRequired,
  actionDelete: PropTypes.func.isRequired,
  actionConfirm: PropTypes.func.isRequired,
  actionHideModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  types: state.assets.types,
  user: state.auth.profile,
  assets: state.assets.assets,
  surfaces: state.map.surfaces,
  schemas: state.assets.schemas,
  actionLoadTypes: state.assets.actionLoadTypes,
  createAction: state.assets.createAction,
  deleteAction: state.assets.deleteAction,
  translations: state.auth.translations
});

const mapDispatchToProps = dispatch => ({
  // fetch assets
  actionFetch: (query) => {
    dispatch(fetchAssets(query));
  },
  // fetch assets
  actionFetchSurfaces: () => {
    dispatch(fetchSurfaces());
  },
  // Save asset
  actionSave: (data) => {
    dispatch(addAsset(data));
  },
  // Edit asset
  actionEdit: (id, data) => {
    dispatch(editAsset(id, data));
  },
  // delete asset
  actionDelete: (id) => {
    dispatch(deleteAsset(id));
  },
  // fetch asset types
  actionFetchTypes: (id) => {
    dispatch(fetchAssetTypes(id));
  },
  actionFetchSchemas: () => {
    dispatch(fetchAssetsSchema());
  },
  actionClear: () => {
    dispatch(clear());
  },
  // modals
  actionConfirm: (body, accept, cancel) => {
    dispatch(showConfirmModal(body, accept, cancel));
  },
  actionHideModal: (insp) => {
    dispatch(hideModal(insp));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetBuilder);