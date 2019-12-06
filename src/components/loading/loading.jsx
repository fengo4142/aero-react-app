import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import  styles from  './loading.module.scss'


class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
          large: false,
          submitButtons:true,
          loadingButton:true
        };
        this.toggleLarge = this.toggleLarge.bind(this);
    }
    toggleLarge() {
        this.setState({
        large: !this.state.large,
        });
    }
  render() {
    return (
        <div>
            <Modal isOpen={this.props.loadingStatus} toggle={this.toggleLarge} centered 
              className={'modal-lg ' + this.props.className + ' loading-model'}>
            <div className={styles.loader}>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                    <span className={styles.loaderItem}></span>
                </div>
            </Modal>
        </div>
    );
  }
}

export default Loading
