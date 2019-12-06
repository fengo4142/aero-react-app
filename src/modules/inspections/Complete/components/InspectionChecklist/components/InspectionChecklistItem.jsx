import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

/** ******************************************************************
 *  Components import
 * ***************** */

import inspectionStyles from '../checklist.module.scss';
import Clickable from '../../../../../../components/clickable/Clickable';
import Button from '../../../../../../components/button';

import WorkOrderListBox from './WorkOrderListBox';

import WorkOrderCreate from '../../../../../workorders/Create';

/** ******************************************************************
 *  Assets import
 * ************* */

import styles from './checklistComponent.module.scss';
import camera from '../../../../../../icons/camera.svg';
import {fetchInspection} from '../../../../redux/actions'


class InspectionChecklistItem extends Component {
  state = {
    openRemarks: false,
    openWorkorders: false,
    currentRemark: '',
    currentPhoto: undefined,
    workorders: [],
    RemarkDescriptionEmpty:false,
    current:undefined
  };
  imageStyles = {
   width: '100px',
   height:'70px',
   position:'relative',
   left:'80%',
   bottom:'20px'
  };

  transitionStyles = {
    entered: { maxHeight: '360px' }
  };

  WOtransitionStyles = {
    entered: { maxHeight: '100vh' }
  };
  textareaStyles={
    margin:'30px 25px 0px 10px',
    border:'1px solid #E6EAEE',
    borderRadius:'4px',
    width:'670px',
    maxHeight: 60,
    minHeight: 60,
  };
  labelStyles={
   bottom: 43,
   fontSize: 15
  }
  spanStyle={
    width:'50%'
  }

  componentDidMount() {
    const { itemKey, workorders, handleItemStatusChange, answerText ,draftdata, pass} = this.props;
    if (workorders.length > 0) {
      handleItemStatusChange(itemKey, false);
      this.setState({ workorders });
    }
    if(answerText){
      this.setState({ currentRemark : answerText });
    }
    if((Object.keys(draftdata).length > 0) && (pass === undefined)) {
      var keys = Object.keys(draftdata),i=0;
      for(i = 0; i < Object.keys(draftdata).length; i++)
      {
        handleItemStatusChange(keys[i],draftdata[keys[i]])
      }
    }
    if(workorders.length === 0 && Object.keys(draftdata).length === 0 && pass === undefined) {
      handleItemStatusChange(itemKey, true)
    }
  }
  
  handleChange = (key, value) => {
    if(key === 'currentPhoto' && value === undefined) {
      return;
    }
    this.setState({RemarkDescriptionEmpty:false})
    this.setState({ [key]: value });
  }

  handleCreateClick = () => {
    const { handleItemRemarkChange, itemKey } = this.props;
    const { currentRemark, currentPhoto } = this.state;
    if(currentPhoto) {
      var reader = new FileReader();
      var url = reader.readAsDataURL(currentPhoto);
      reader.onloadend = function (e) {
          this.setState({
                  current: reader.result,})
      }.bind(this);
    }
    if(currentRemark === '') {
      this.setState({RemarkDescriptionEmpty:true});
      return;
    }
    handleItemRemarkChange(itemKey, { text: currentRemark, photo: currentPhoto });
    this.handleChange('openRemarks', false);
  }

  handleWorkorderCreate = (newWorkOrder) => {
    this.setState(prevState => ({
      openWorkorders: false,
      workorders: [...prevState.workorders, newWorkOrder]
    }));
  }

  handleInspections = () => {
    const { actionFetch, id } = this.props;
    actionFetch(id);
  }

  handleCancel = () => {
    const {currentPhoto, currentRemark} = this.props;
    this.setState({currentRemark:''})
    this.setState({currentPhoto:undefined})
  }
  render() {

        const {
      pass,
      title,
      itemKey,
      handleItemStatusChange,
      remark,
      category,
      selfInspection } = this.props;
    
    const {
      openRemarks,
      currentRemark,
      currentPhoto,
      openWorkorders,
      workorders } = this.state;

    const Tag = workorders.length > 0 ? 'div' : Clickable;  
    let itemStatusStyle;
    let itemBtnActive;
    if (pass === undefined) {
      itemStatusStyle = inspectionStyles.untouched;
      itemBtnActive = false;
    } else {
      itemStatusStyle = pass ? inspectionStyles.success : inspectionStyles.failure;
      itemBtnActive = true;
    }
    return (
      <div className={styles.itemWrapper}>
        <div className={styles.checklist__item}>
          <span className={styles.checklist__item__data}>
            <span className={`${inspectionStyles.statusDot} ${itemStatusStyle}`} />
            {title}
          </span>
          {!openRemarks && (
          <Clickable className={styles.remarks} onClick={() => this.handleChange('openRemarks', true)}>
            {currentRemark === '' && <FormattedMessage id="inspections.complete_inspections.remarks" defaultText="New Remark" />}
            {currentRemark !== '' && <FormattedMessage id="inspections.complete_inspections.remarks_edit" defaultText="Edit Remark" />}
          </Clickable>
          )}
          {!openWorkorders && pass === false && selfInspection && (
          <Clickable className={styles.remarks} onClick={() => this.handleChange('openWorkorders', true)}>
            <FormattedMessage id="inspections.complete_inspections.workorders" defaultMessage="New Work Order" />
          </Clickable>
          )}
          <div className={styles.checklist__item__btnContainer}>
            <Tag className={`${styles.success} ${itemBtnActive && pass ? styles.active : styles.inactive}`}
              {...(Tag === Clickable && { onClick: () => handleItemStatusChange(itemKey, true) })}
            />
            <Tag className={`${styles.failure} ${itemBtnActive && !pass ? styles.active : styles.inactive}`}
              {...(Tag === Clickable && { onClick: () => handleItemStatusChange(itemKey, false) })}
            />
          </div>
        </div>
        {workorders.length > 0 && (
          <div className={styles.remark}>
            <span className={styles.label}>Open work orders</span>
            {workorders.map(w => (
              <WorkOrderListBox key={w.id} workorder={w} />
            ))}
          </div>
        )}
        {this.state.currentRemark.length>0 && !openRemarks && (
          <div className={styles.remark}>

            <span className={styles.label}>Remarks</span>
            <span style={this.spanStyle}>{remark.text}</span>
            {this.state.current && (
              <img src={this.state.current} style={this.imageStyles}/>
            )}            
          </div>
        )}
        <Transition in={openRemarks} timeout={0}>
          {state => (
            <div className={styles.remarkInput} style={this.transitionStyles[state]}>
             <label className={styles.camera}>
                <img src={camera} alt="" />
                <input ref="file" type="file" accept="image/*" onChange={e => this.handleChange('currentPhoto', e.target.files[0])} />
                {currentPhoto && currentPhoto.name}
              </label>
              <label style={this.labelStyles}>
                Description
              </label>
              <textarea rows="2" defaultValue={remark.text} value = {currentRemark} onChange={e => this.handleChange('currentRemark', e.target.value)} style={this.textareaStyles} />
              {this.state.RemarkDescriptionEmpty && 
                  <div className={styles.error}> 
                  <FormattedMessage id="pulpoforms.errors.not_blank" defaultMessage="This field cannot be empty" />
                  </div>}
               <Button action="secondary" translationID="inspections.new.cancelBtn" defaultText="Cancel"
                onClick={this.handleCancel}
              />
              <Button action="secondary" translationID="inspections.new.addBtn" defaultText="Save"
                onClick={this.handleCreateClick}
              />
            </div>
          )}
        </Transition>
        <Transition in={openWorkorders} timeout={0}>
          {state => (
            openWorkorders && (
            <div className={styles.workorderWrapper} style={this.WOtransitionStyles[state]}>
              <WorkOrderCreate fromInspection category={category} subcategory={itemKey}
                onCreate={this.handleWorkorderCreate}
                callInspections={this.handleInspections}
                onCancel={() => this.handleChange('openWorkorders', false)}
              />
            </div>
            )
          )}
        </Transition>
      </div>
    );
  }
}

InspectionChecklistItem.propTypes = {
  title: PropTypes.string.isRequired,
  itemKey: PropTypes.string.isRequired,
  pass: PropTypes.bool,
  handleItemStatusChange: PropTypes.func.isRequired,
  handleItemRemarkChange: PropTypes.func.isRequired,
  remark: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  answerText: PropTypes.string
};

InspectionChecklistItem.defaultProps = {
  remark: '',
  pass: undefined
};



const mapStateToProps = state => ({
  inspection: state.inspection.inspection,
}); // Please review your data
 
const mapDispatchToProps = dispatch => ({
  // Fetch inspection
  actionFetch: (id) => {
    dispatch(fetchInspection(id));
  },

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionChecklistItem);