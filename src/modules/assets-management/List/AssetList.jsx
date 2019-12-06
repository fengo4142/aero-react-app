import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchAssets } from '../redux/actions';
import { fetchSurfaces } from '../../settings/Map/redux/actions';

import Tabs from '../../../components/tabs';
import Collapsible from '../../../components/collapsible/Collapsible';
import styles from './assetList.module.scss';

class AssetList extends Component {

  state = {
    types: [],
  }
  
  componentDidMount() {
    const { actionFetchSurfaces, actionFetch } = this.props;
    actionFetchSurfaces();
    actionFetch(this.props.state);
  }

  static getDerivedStateFromProps(props, state) {

    if( !props.surfaces.length  && !state.types.length) {
      let types= [];
      types.push({ id: null, name: 'Other' })
      return {...state, types}
    }
    if (props.surfaces.length && !state.types.length) {
      const types = props.surfaces.map(s => (
        { id: s.surface_type.id, name: s.surface_type.name }
      )).filter((type, index, self) => self.findIndex(
        t => t.id === type.id && t.name === type.name
      ) === index);
      types.push({ id: null, name: 'Other' });

      const surfaces = props.surfaces.reduce((rv, x) => {
        const aux = rv;
        (aux[x.surface_type.id] = rv[x.surface_type.id] || []).push(x);
        return aux;
      }, {});
      return { ...state, types, surfaces };
    }

    if (props.assetList.length) {
      const assets = props.assetList.reduce((rv, x) => {
        const aux = rv;
        (aux[x.area] = rv[x.area] || []).push(x);
        return aux;
      }, {});
      return { ...state, assets };
    }

    return state;
  }

  handleSurfaceAssets = () => {
    const types = this.props.surfaces.map(s => (
      { id: s.surface_type.id, name: s.surface_type.name }
    )).filter((type, index, self) => self.findIndex(
      t => t.id === type.id && t.name === type.name
    ) === index);
    types.push({ id: null, name: 'Other' });

    const surfaces = this.props.surfaces.reduce((rv, x) => {
      const aux = rv;
      (aux[x.surface_type.id] = rv[x.surface_type.id] || []).push(x);
      return aux;
    }, {});
    this.setState({ types, surfaces})
  }

  componentDidUpdate(prevProps) {
    if(prevProps.surfaces !== this.props.surfaces) {
      this.handleSurfaceAssets();
    }
  }

  render() {
    const { types, surfaces, assets } = this.state;
    const { assetList } = this.props;
    return (
      <>
        <div className={styles.filter}>
          <div>
            <span className={styles.allAssets}>All Assets</span>
            <span>
              <b>{assetList.length}</b>
              {' '}
              Assets
            </span>
          </div>
          <Link to="/ops/assets/map">Map view </Link>
        </div>
        <div className={styles.panel}>
          <Tabs>
            {types.map(t => (
              <div key={t.id} label={t.name}>
                {surfaces && assets && surfaces[t.id] && surfaces[t.id].map(sf => (
                  <div key={sf.id} className={styles.group}>
                    <div className={styles.count}>{`${assets[sf.id] ? assets[sf.id].length : 0} Assets`}</div>
                    <Collapsible styleClasses={styles.title} title={sf.name} key={sf.id}
                      autoheight={false}
                    >
                      <Tabs>
                        {['Lights', 'Signs'].map(cat => (
                          <table key={cat} className={styles.table} label={cat}>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              {assets[sf.id]
                                && assets[sf.id].filter(a => a.asset_type.category === cat)
                                  .map(a => (
                                    <tr key={a.id}>
                                      <td>{a.name}</td>
                                      <td><img src={a.asset_type.icon} alt={a.name} /></td>
                                      <td />
                                    </tr>
                                  ))}
                            </tbody>
                          </table>
                        ))}
                      </Tabs>
                    </Collapsible>
                  </div>
                ))}
                {t.id === null && assets && (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Label</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets[t.id]
                        && assets[t.id].map(a => (
                          <tr key={a.id}>
                            <td>{a.name}</td>
                            <td>{a.label}</td>
                            <td><img src={a.asset_type.icon} alt={a.name} /></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </Tabs>
          </div>
      </>
    );
  }
}

AssetList.propTypes = {
  assetList: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

const mapStateToProps = state => ({
  user: state.auth.profile,
  assetList: state.assets.assets,
  surfaces: state.map.surfaces
});

const mapDispatchToProps = dispatch => ({
  // fetch assets
  actionFetch: (query) => {
    dispatch(fetchAssets(query));
  },
  // fetch assets
  actionFetchSurfaces: () => {
    dispatch(fetchSurfaces());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetList);
