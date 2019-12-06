import React, { Component } from 'react';
import styles from './Notams.module.scss';
import Collapsible from '../../../../components/collapsible/Collapsible';


class Notams extends Component {
  render() {
    const {notams} = this.props.notams;
    return (
      <div className={styles.appPriviliges}>
        <div className={styles.list}>
          {Object.keys(this.props.notams).map((key)=>{
            return(
              <Collapsible  openOnMount ={true} title={key} defaultMessage={key} key={key} styles="0px 20px">
                <p>{this.props.notams[key]['notam_text']}</p>
              </Collapsible>
            )            
          })}
        </div>
      </div>
    );
  }
}


export default Notams;
