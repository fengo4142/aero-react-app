import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Permissions from 'react-redux-permissions';

import { importAllImages } from '../../../../../utils/helpers';
import Button from '../../../../../components/button';
import Clickable from '../../../../../components/clickable/Clickable';

import icon from './icon.svg';
import cog from '../../../../../components/settingsHeader/icons/settings.svg';
import styles from '../steps.module.scss';

class Step0 extends Component {
  constructor(props) {
    super(props);

    this.images = importAllImages(require.context('../../../../../icons/inspection-icons', false, /\.(png|jpe?g|svg)$/));
    this.state = {
      stage: 1
    };

    this.goToTemplateScreen = this.goToTemplateScreen.bind(this);
  }

  goToTemplateScreen() {
    this.setState({ stage: 2 });
  }

  render() {
    const { goToNext, list, templates, goToInspectionEdit, exportInspection } = this.props;
    const { stage } = this.state;

    return (
      <>
        {stage === 1 && (
          <div className={`${styles.inspection_list} ${styles.step0}`}>
            <img className={styles.title_img} src={cog} alt="inspection_list_icon" />
            <h3 className={styles.inspection_list_title}>
              <FormattedMessage id="inspections.step0.editHeader" defaultMessage="Edit one of your inspections or create a new one" />
            </h3>
            <Permissions allowed={['add_inspection']}>
              <div className={styles.inspection_list__item_container}>
                {list.map(inspection => (
                  <Clickable
                    key={inspection.id}
                    onClick={() => { goToInspectionEdit(inspection.id); }}
                    className={styles.inspection_list__item}
                  >
                  {this.images[`${inspection.icon}.svg`] ? 
                       <img src={this.images[`${inspection.icon}.svg`]} alt="insptection_icon" /> :
                       <img src={this.images[inspection.icon]} alt="insptection_icon" />}
                    <div className={styles.title_container}>
                      <span>{ inspection.title }</span>
                      <div className={styles.tags}>
                        {inspection.version_status.map(status => (
                          <div key={status} className={` ${styles.statusContainer} ${status === 1 ? styles.published : styles.draft}`}>
                            {status === 1 ? (
                              <FormattedMessage id="inspections.step0.published" defaultMessage="Published" />
                            ) : (
                              <FormattedMessage id="inspections.step0.draft" defaultMessage="Draft" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Clickable>
                ))}
              </div>
            </Permissions>
            <div className={styles.separator} />
            <Permissions allowed={['add_inspectionparent']}>
              <Button onClick={goToNext} translationID="inspections.new.create"
                defaultText="Create new" action="secondary"
              />
              {/* <Button onClick={this.goToTemplateScreen} translationID="inspections.new.create_new"
                defaultText="Create new" action="secondary"
              /> */}
            </Permissions>
          </div>
        )}
        {stage === 2 && (
          <div className={styles.step0}>
            <img className={styles.icon} src={icon} alt="" />
            <h3 className={styles.headline}>
              <FormattedMessage id="inspections.step0.headline"
                defaultMessage="Would you like to use one of the previous inspections as template?"
              />
            </h3>
            <div className={styles.list}>
              {templates.map(l => (
                <div className={styles.listItem} key={l.id} onClick={() => goToNext(l.id)}>
                  <span>{l.title}</span>
                </div>
              ))}
            </div>
            <Button onClick={goToNext} translationID="inspections.new.create"
              defaultText="Create" action="secondary"
            />
          </div>
        )}
      </>
    );
  }
}

Step0.propTypes = {
  goToNext: PropTypes.func.isRequired,
  goToInspectionEdit: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  history: PropTypes.shape({}).isRequired
};
export default withRouter(Step0);
