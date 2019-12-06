import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import styles from './fieldDetail.module.scss';
import Clickable from '../../../../../components/clickable/Clickable';
import Modal from '../../../../../components/modal/modal';

import checklistStyles from '../../../Complete/components/InspectionChecklist/checklist.module.scss';

class ChecklistRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: true
    };

    this.transitionStyles = {
      entered: {
        height: '0',
        fontSize: '0',
        opacity: '0'
      },
      exited: {
        height: '107px'
      }
    };

    this.imageStyles = {
      entered: {
        width: '0px',
        opacity: '0'
      },
      exited: {
        width: '100px',
        opacity: '1'
      }
    };

    this.toggleRemark = this.toggleRemark.bind(this);
  }

  toggleRemark() {
    this.setState(prevState => ({
      opened: !prevState.opened
    }));
  }

  render() {
    const { answer, item, remark, rowSpan, field, workorders } = this.props;
    const { opened, modal } = this.state;
    const status = answer[item.key] ? 'pass' : 'fail';
    const allTrue = Object.keys(answer).map(a => answer[a]).reduce((a, b) => a && b);
    const dot = allTrue ? checklistStyles.success : checklistStyles.failure;
    const rspan = remark ? rowSpan + Object.keys(remark).length : rowSpan;

    const filteredWorkorders = workorders.filter(
      e => e.category_id === field.id && e.subcategory_id === item.key
    );
    const filterednotams = filteredWorkorders.map(
    n => n.notams ? Object.keys(n.notams).map(notam => n.notams[notam]) : ''
    );  
    return (<>
      <tr className={styles.row} key={item.key}>
        {rowSpan && (
        <td rowSpan={rspan}>
          <div style={{ display:'flex'}}>
          <span className={`${checklistStyles.statusDot} ${dot}`} style={{margin:'4px 20px'}} />
          <p>{field.title}</p>
          </div>
        </td>
        )}
        <td>{item.value}</td>
        <td className={styles[status]}>
          {field.status_options[status]}
        </td>
        <td className={styles.workorders}>
          {filteredWorkorders.map(w => ( 
            Object.keys(w.notams).length  ?
             <a key={w.id}  target="_blank" rel="noopener noreferrer"
              href={`/ops/workorders/${w.id}/detail`}
              >
                <b><u>({w.id})</u></b>
              </a> 
              :
              <a key={w.id} target="_blank" rel="noopener noreferrer"
              href={`/ops/workorders/${w.id}/detail`}
              >
                {w.id}
              </a>
            ))
          }
        </td>
        <td className={styles.workorders}>
          {filterednotams.map(w => (
            w === undefined ? '':
            w.map(w => <p>{w.id}</p>)
            ))
          }
        </td>
        <td>
          {remark && remark[item.key] && (
            <Clickable className={styles.remark} onClick={this.toggleRemark}>Remarks</Clickable>
          )}
        </td>
      </tr>
      {remark && remark[item.key] && (<>
        <Transition in={opened} timeout={0}>
          {state => (
            <tr className={`${styles.row} ${styles.remarkRow}`}
              key={`remark-${item.key}`} style={this.transitionStyles[state]}
            >
              <td colSpan="6">
                <div className={styles.remarkWrapper}>
                  {remark[item.key].image && (
                  <Clickable onClick={() => this.setState({ modal: true })}>
                    <img style={this.imageStyles[state]} src={remark[item.key].image} alt="" />
                  </Clickable>
                  )}
                  <span className={styles.remarkText}>{remark[item.key].text}</span>
                  {/* <span className={styles.createWorkOrder}>Create work order</span> */}
                </div>
              </td>
            </tr>
          )}
        </Transition>
        {remark[item.key].image && (
        <Modal minHeight="0" showIn={modal} onClose={() => this.setState({ modal: false })}>
          <img className={styles.fullImage} src={remark[item.key].image} alt="" />
        </Modal>)}
      </>)}
    </>);
  }
}
ChecklistRow.propTypes = {
  field: PropTypes.shape({}).isRequired,
  answer: PropTypes.shape({}).isRequired,
  remark: PropTypes.shape({}),
  rowSpan: PropTypes.number,
  item: PropTypes.shape({}).isRequired,
  workorders: PropTypes.arrayOf(PropTypes.shape({}))
};

ChecklistRow.defaultProps = {
  rowSpan: undefined,
  remark: undefined,
  workorders: []
};

export default ChecklistRow;
