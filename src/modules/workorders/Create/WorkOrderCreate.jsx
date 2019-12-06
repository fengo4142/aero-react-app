/* global FormData */
import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales';
import { Redirect } from 'react-router-dom';
import { HOC as Permissions } from 'react-redux-permissions';
import { FormattedMessage } from 'react-intl';

/** ******************************************************************
 *  Redux import
 * ***************** */
import { WORKORDERS_HOME_ROUTE } from '../../../constants/RouterConstants';
import { createWorkOrder, fetchWorkOrderSchema, clearActionResult, fetchNotams } from '../redux/actions';
import { searchUser, fetchSafetySelfInspection } from '../../inspections/redux/actions';
import { fetchAssets } from '../../assets-management/redux/actions';


/** ******************************************************************
 *  Components import
 * ***************** */

import HeaderBack from '../../../components/headerBack';
import SectionHeader from '../../../components/sectionHeader';
import Button from '../../../components/button';
import Panel from '../../../components/panel';
import Spinner from '../../../components/spinner';
import FixedFields from './components/FixedFields';
import FixedFieldsForInspections from './components/FixedFieldsForInspections';
import PulpoField from '../../../pulpo_visualizer/fields/PulpoField';
import Forbidden from '../../Forbidden';
import NotamsTable from './components/NotamsTable';
/** ******************************************************************
 *  Assets import
 * ***************** */
import styles from './workOrderCreate.module.scss';
import wo from '../../../icons/WorkOrder.svg';

class WorkOrderCreate extends Component {
  state = {
    info: {
      report_date: moment().format(),
      photos: [],
      logged_by: {},
      assets: [],
      priority: '0'
    },
    answers: {},
    requiredMap: {},
    showFormErrors: false,
    fieldErrors: {
      logged_by: false,
      report_date: false,
      category: true,
      subcategory: true,
      priority: true,
      problem_description: true,
      location: true
    },
    notamSelectedList: {},
    notamStatus: false,
    zoomLevel: '',
    spaceError:false,
    selectedAsset:[],
  }

  firstTime = true;

  componentDidMount() {
    const {
      selfInspection,
      actionGetSelfInpection,
      actionGetWorkOrder,
      actionFetchAssets,
      schemas,
      assets,
      category,
      subcategory,
      notams,
      user, actionFetchNotams
    } = this.props;

    if (category && subcategory) {
      this.handleAnswerChanged('info', category, 'category');
      this.handleAnswerChanged('info', subcategory, 'subcategory');
      this.handleFieldErrorChanged('category', false);
      this.handleFieldErrorChanged('subcategory', false);
    }

    if (!selfInspection.length) actionGetSelfInpection();
    if (!schemas.length) actionGetWorkOrder();
    if (!assets.length) actionFetchAssets();
    if (notams.length) actionFetchNotams(user.airport.code);
  }

  static getDerivedStateFromProps(props, state) {
    // grab user from state
    if (props.user.id && !state.info.logged_by.id) {
      return {
        ...state,
        info: {
          ...state.info,
          logged_by: {
            id: props.user.id,
            fullname: props.user.fullname
          },
          location: [...props.user.airport.location.coordinates],
          // airportCode: props.user.airport.code,
        }
      };
    }
    return state;
  }

  componentDidUpdate(prevProps) {
    const {
      schemas,
      clear,
      createAction,
      onCreate,
      createdWorkorder,
      fromInspection } = this.props;


    if (fromInspection === true) {
      if (createAction.success === true) {
        this.props.callInspections()
      }
    }


    if (this.firstTime && schemas.workorder && schemas.workorder.id) {
      this.processInspectionForState(schemas.workorder);
      this.firstTime = false;
    }
    if (prevProps.createAction.loading && createAction.success) {
      clear();
      if (fromInspection) {
        onCreate({
          id: createdWorkorder.id,
          problem_description: createdWorkorder.problem_description,
          priority: createdWorkorder.priority,
        });
      }
    }
  }

  processInspectionForState = (workorder) => {
    if (workorder) {
      const { schema } = workorder;
      let { fieldErrors, requiredMap } = this.state;

      schema.fields.forEach((f) => {
        requiredMap = { ...requiredMap, [f.id]: f.required };
        fieldErrors = { ...fieldErrors, [f.id]: f.required };
      });
      this.setState({ requiredMap, fieldErrors });
    }
  }

  handleAnswerChanged = (section, answer, fieldId) => {
    const {spaceError} = this.state;
    this.setState({spaceError:false})
  if(answer) {
    this.setState(prevState => ({
      [section]: {
        ...prevState[section],
        [fieldId]: answer
      }
    }));
  }

  // if(fieldId === 'subcategory' || fieldId === 'category') {
  //   if( this.state.selectedAsset.length > 0) {
  //     this.setState({ selectedAsset: []})
  //   }
  // }
}
  // handleAssetType = (section, answer, fieldId) => {
  //   let answerArr = answer===""?[]:[answer]
  //   this.setState(prevState => ({
  //     info:{
  //        ...prevState.info,
  //        assets: answerArr
  //     }
  //   }))
  //   this.handleSelectedAsset(answer)
  // }

  handleSelectedAsset = (answer) => {
      let answerArr = answer===""?[]:[answer]

    
    this.setState(prevState => ({
      info: {
        ...prevState.info,
        assets: answerArr
      }
    }))
  }

  handleFieldErrorChanged = (id, value) => {
    this.setState(prevState => ({
      fieldErrors: {
        ...prevState.fieldErrors,
        [id]: value
      }
    }));
  }

  handleSearchForUser = (value) => {
    const { actionSearchUser } = this.props;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      actionSearchUser(value);
    }, 300);
  }

  create = () => {
    const { actionCreate, selfInspection } = this.props;
    const { info, fieldErrors, answers } = this.state;
    let { notamSelectedList, zoomLevel, assets} = this.state;
    
    if (info.location) {
      fieldErrors['location'] = false
    }

    if(info.priority) {
      fieldErrors['priority'] = false
    }
    var problemDescription = info.problem_description;
    if(problemDescription && !problemDescription.trim()){
      fieldErrors['problem_description'] = true;
      this.setState({spaceError:true})
      return;
    }

    const noErrors = Object.keys(fieldErrors)
      .every(k => (fieldErrors[k] === false));

    if (noErrors) {
      const data = { ...info };
      data.logged_by = data.logged_by.id;
      data.zoom_level = zoomLevel
      const location = {
        type: 'Point',
        coordinates: data.location
      };
      data.location = JSON.stringify(location)

      if (data.assets && data.assets.length > 0) {
        data.assets = data.assets;
      } else {
        delete data.assets;
      }
      data.response = JSON.stringify(answers);
      data.category_id = data.category;
      data.subcategory_id = data.subcategory;
      data.subcategory = selfInspection[data.category].checklist.find(
        e => e.key === data.subcategory
      ).value;
      data.category = selfInspection[data.category].title;
      if (!this.state.notamStatus) {
        notamSelectedList = {}
      }
      data.notams = JSON.stringify(notamSelectedList);
      // transform data into formData
      const formData = new FormData();
      Object.keys(data).forEach((k) => {
        if (k === 'photos') {
          info.photos.forEach((e) => {
            formData.append(k, e);
          });
        } 
       else if ( k === 'assets') { 
         let assets = []
          info.assets.map((asset) => 
          assets.push(parseInt(asset)))
          formData.append(k, JSON.stringify(assets))
        }
        else {
          formData.append(k, data[k]);
        }
      });
      for (var value of formData.values()) {
         //console.log(value); 
      }
      actionCreate(formData);
    } else {
      this.setState({ showFormErrors: true });
    }
  }

  //save selected notams
  notamSelect = async (selectedNotam, isSelect, selectType) => {
    let notamSelectedList = this.state.notamSelectedList;
    if (selectType === "s") {
      let notam_id = selectedNotam.id;
      if (!isSelect) {
        delete notamSelectedList[notam_id]
        await this.setState({
          notamSelectedList: notamSelectedList
        })
      } else {
        notamSelectedList[notam_id] = selectedNotam;
        await this.setState({
          notamSelectedList: notamSelectedList
        })
      }
    } else {
      let notam_id = selectedNotam.id;
      if (!isSelect) {
        selectedNotam.map((notam) => {
          delete notamSelectedList[notam.id]
        })
        await this.setState({
          notamSelectedList: notamSelectedList
        })
      } else {
        selectedNotam.map((notam) => {
          notamSelectedList[notam.id] = notam;
        })
        await this.setState({
          notamSelectedList: notamSelectedList
        })
      }
    }
  }

  openNotams = () => {
    const { actionFetchNotams } = this.props;
    actionFetchNotams(this.state.info.airportCode);
    this.setState({

      notamStatus: !this.state.notamStatus
    })
  }

  handleZoomLevel = (value) => {
    this.setState({ zoomLevel: value })
  }

  render() {
    const {
      info,
      showFormErrors,
      answers,
      spaceError,
     requiredMap,selectedAsset } = this.state;

    const {
      userlist,
      selfInspection,
      createAction,
      schemas,
      errors,
      fromInspection,
      assets,
      translations,
      user,
      notams,
      action } = this.props;

    // Remove panel if is rendered from inspections.
    const Tag = fromInspection
      ? { name: 'div', props: '' }
      : {
        name: Panel,
        props: {
          title: 'workorders.start.title',
          defaultTitle: 'Create Work Order'
        }
      };

    //Notams table start
    const header = [
      { text: "Id", dataField: "id", sortable: true },
      { text: "Text", dataField: "notam_text", sortable: true, filterable: true },
      { text: "ExpireDtg", dataField: "notam_expire_dtg", sortable: true, filterable: true },
      { text: "LastModDtg", dataField: "notam_lastmod_dtg", sortable: true, filterable: true },
      { text: "EffectiveDtg", dataField: "notam_effective_dtg", sortable: true, filterable: true },
    ];

    const notamData = notams.map((notam, index) => {
      return {
        id: `${notam.notam_id}`,
        notam_text: `${notam.notam_text}`,
        notam_expire_dtg: `${moment(notam.notam_expire_dtg, "YYYYMMDDHHmm").format("YYYY-MM-DD hh:mm A")}`,
        notam_lastmod_dtg: `${moment(notam.notam_lastmod_dtg, "YYYYMMDDHHmm").format("YYYY-MM-DD hh:mm A")}`,
        notam_effective_dtg: `${moment(notam.notam_effective_dtg, "YYYYMMDDHHmm").format("YYYY-MM-DD hh:mm A")}`,
      };
    });

    // const header = [
    //   { text: "Id", dataField: "id", sortable: true },
    //   { text: "Text", dataField: "notam_text", sortable: true, filterable: true },
    //   { text: "QCode", dataField: "notam_qcode", sortable: true, filterable: true },
    //   { text: "XOverNotamId", dataField: "xovernotamid", sortable: true, filterable: true },
    //   { text: "Expire Dtg", dataField: "notam_expire_dtg", sortable: true, filterable: true },
    //   { text: "Last MOd Dtg", dataField: "notam_lastmod_dtg", sortable: true, filterable: true },
    //   { text: "Effective Dtg", dataField: "notam_effective_dtg", sortable: true, filterable: true },
    // ];

    // const notamData = notams.map((notam,index) => {
    //   return {
    //     id: `${notam.notam_id}`,
    //     notam_text: `${notam.notam_text}`,
    //     notam_qcode: `${notam.notam_qcode}`,
    //     xovernotamid: `${notam.xovernotamid}`,
    //     notam_expire_dtg: `${notam.notam_expire_dtg}`,
    //     notam_lastmod_dtg: `${notam.notam_lastmod_dtg}`,
    //     notam_effective_dtg: `${notam.notam_effective_dtg}`,
    //   };
    // });
    //End - Notams table

    const assetTypes = user.airport.types_for_self_inspection;
    const translationMap = translations ? translations[user.language] : {};
    return (
      <>
        {!fromInspection && createAction.success && <Redirect push to={WORKORDERS_HOME_ROUTE} />}
        {!fromInspection && (
          <>
            <SectionHeader icon={wo} translationID="workorders.title"
              defaultTitle="Work Orders"
            />
            <HeaderBack
              translationID="workorders.start.back"
              translationDefault="Back to Work Orders"
              backRoute={WORKORDERS_HOME_ROUTE}
            />
          </>
        )}
        <div className={`container ${styles.form}`}>
          <Tag.name {...Tag.props}>
            <div className={`${styles.content} ${styles.embedded}`}>
              {!fromInspection && (
                <FixedFields
                  info={info}
                  assetTypes={assetTypes}
                  translation={translationMap}
                  assets={assets}
                  userlist={userlist}
                  selectedUserList={info.assets}
                  categories={selfInspection}
                  searchForUser={this.handleSearchForUser}
                  handleAnswerChanged={this.handleAnswerChanged}
                  handleFieldErrorChanged={this.handleFieldErrorChanged}
                  handleWorkOrderZoomLevel={(value) => this.handleZoomLevel(value)}
                  showFormErrors={showFormErrors}
                  handleSelectedAsset = {this.handleSelectedAsset}
                  // selectedAsset = {selectedAsset}
                />
              )}
              {!fromInspection && (
                <div className="fixedFields_fullInput__3zuDC" style={{ marginTop: "15px" }}>
                  <span className="fixedFields_label__3TCWP" style={{ fontWeight: "bold" }}>Associate Notams with this work order? <input type="checkbox" onChange={this.openNotams} checked={this.state.notamStatus} value={this.state.notamStatus} /></span>
                  {this.state.notamStatus ?
                    <div className="fixedFields_fullInput__3zuDC" >
                      {this.props.schemas.notamsEnabled ?
                        <div>
                          {action.message === "success" ?
                            (<div>< NotamsTable
                              notamData={notamData}
                              tableHeader={header}
                              notamSelect={(notam, isSelect, selectType) => this.notamSelect(notam, isSelect, selectType)} />
                            </div>) : (<div><p style={{ textAlign: "center", color: "red", fontWeight: "bold", width: "100%" }} >... Loading... Please Hold ....</p></div>)}
                        </div> : <div><p style={{ textAlign: "center", color: "#cf1020", fontWeight: "bold", width: "100%" }} > *** Access Denied!!!! please contact admin for Access *** </p></div>
                      }
                    </div> : ""
                  }

                </div>
              )}
              {fromInspection && info.category && info.subcategory && (
                <FixedFieldsForInspections
                  info={info}
                  assets={assets}
                  assetTypes={assetTypes}
                  handleAnswerChanged={this.handleAnswerChanged}
                  handleFieldErrorChanged={this.handleFieldErrorChanged}
                  showFormErrors={showFormErrors}
                  onCancel={this.props.onCancel}
                  spaceError={spaceError}
                  handleWorkOrderZoomLevel={(value) => this.handleZoomLevel(value)}
                  handleSelectedAsset = {this.handleSelectedAsset}
                />
              )}

              <div className={styles.separator} />
              {Object.keys(requiredMap).length > 0
                && schemas.workorder.schema.fields.map(field => (
                  <PulpoField key={field.id} {...field}
                    translation={translationMap && translationMap[field.title]}
                    handleValueChange={(a, b) => this.handleAnswerChanged('answers', a, b)}
                    isRequired={requiredMap[field.id]} answer={answers[field.id]}
                    showFieldErrors={showFormErrors}
                    handleFieldErrorChanged={this.handleFieldErrorChanged}
                  />
                ))}
            </div>

            <div className={`${styles.footer} ${styles.embedded}`}>
              <Spinner className={styles.spinner} active={createAction.loading} />
              <div className={styles.errors}>
                {errors.length > 0 && (
                  errors.map(e => (
                    <>
                      <span>{`${e.id}: `}</span>
                      <FormattedMessage key={e.id} id={e.message}
                        defaultMessage="this field is required"
                      />
                    </>
                  ))
                )}
              </div>
              {fromInspection && info.category && info.subcategory && (
                <div className={styles.cancelButton}>
                  <Button onClick={this.props.onCancel} translationID="inspections.new.cancel"
                    defaultText="Cancel" action="secondary"
                  />
                </div>)}
              <Button onClick={this.create} translationID="inspections.new.create"
                defaultText="Create" action="secondary"
              />
            </div>
          </Tag.name>
        </div>
      </>
    );
  }
}

WorkOrderCreate.propTypes = {
  selfInspection: PropTypes.shape({}),
  actionCreate: PropTypes.func.isRequired,
  actionSearchUser: PropTypes.func.isRequired,
  userlist: PropTypes.arrayOf(PropTypes.shape({})),
  notams: PropTypes.arrayOf(PropTypes.shape({})),
  actionGetSelfInpection: PropTypes.func.isRequired,
  actionGetWorkOrder: PropTypes.func.isRequired,
  schemas: PropTypes.shape({}).isRequired,
  createAction: PropTypes.shape({}),
  clear: PropTypes.func.isRequired,
  actionFetchNotams: PropTypes.func.isRequired
};

WorkOrderCreate.defaultProps = {
  userlist: [],
  selfInspection: {},
  createAction: {},
};

const mapStateToProps = state => ({
  workorders: state.workorders.workorders,
  selfInspection: state.inspection.selfInspection,
  schemas: state.workorders.schemas,
  action: state.workorders.action,
  createAction: state.workorders.createAction,
  createdWorkorder: state.workorders.createdWorkorder,
  errors: state.workorders.errors,
  user: state.auth.profile,
  userlist: state.inspection.userlist,
  assets: state.assets.assets,
  translations: state.auth.translations,
  notams: state.workorders.notams
});

const mapDispatchToProps = dispatch => ({
  // Create work order.
  actionCreate: (data) => {
    dispatch(createWorkOrder(data));
    return Promise.resolve();
  },
  actionGetWorkOrder: () => {
    dispatch(fetchWorkOrderSchema());
  },
  actionGetSelfInpection: (id) => {
    dispatch(fetchSafetySelfInspection(id));
  },
  actionFetchAssets: () => {
    dispatch(fetchAssets());
  },
  actionSearchUser: (query) => {
    dispatch(searchUser(query));
  },
  actionFetchNotams: (query) => {
    dispatch(fetchNotams(query));
  },
  clear: () => {
    dispatch(clearActionResult());
  },
});


export default Permissions(['add_workorder'])(
  connect(mapStateToProps, mapDispatchToProps)(WorkOrderCreate),
  <Forbidden />
);
