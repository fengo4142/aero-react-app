import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { FormattedMessage } from 'react-intl';

/** ******************************************************************
 *  Components import
 * ***************** */
import EditableText from './EditableText';

/** ******************************************************************
 *  Assets import
 * ***************** */
import styles from '../steps.module.scss';
import handle from '../../../../../icons/inspection-icons/Droper.svg';


const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

const DragHandle = SortableHandle(() => <img className={styles.handle} src={handle} alt="" />);

const AccordionItem = ({ onItemClick, active, onAddEntry,
  onChangeEntry, item, onChangeChecklistName }) => (
    <div className={`${styles.cheitem} ${active ? styles.active : ''}`}>
      <div className={styles.cheitemInner} role="button" tabIndex="0" onClick={onItemClick}
        onKeyDown={(e) => { if (e.keyCode === 13) onItemClick(e); }}
      >
        <DragHandle />
        <EditableText item={item} changeField={onChangeChecklistName} />
        <div className={styles.counter}>{`${item.checklist.length} items`}</div>
      </div>
      <Transition in={active} timeout={0} unmountOnExit>
        {state => (
          <ul className={styles.chelist} style={transitionStyles[state]}>
            {item.checklist.map(i => (
              <ChecklistItem key={i.key} itemId={item.id} desc={i} onChangeEntry={onChangeEntry} />
            ))}
            <li>
              <div className={styles.addNew}>
                <button type="button" onClick={() => onAddEntry(item.id)}>
                  <FormattedMessage id="inspections.step3.addNewItem" defaultMessage="Add a new item" />
                </button>
              </div>
            </li>
          </ul>
        )}
      </Transition>
    </div>
);

AccordionItem.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onItemClick: PropTypes.func.isRequired,
  onAddEntry: PropTypes.func.isRequired,
  onChangeEntry: PropTypes.func.isRequired,
  onChangeChecklistName: PropTypes.func.isRequired,
  active: PropTypes.bool
};

AccordionItem.defaultProps = {
  active: false
};

export default SortableElement(AccordionItem);


const ChecklistItem = ({ itemId, desc: { key, value }, onChangeEntry }) => (
  <li className={styles.chItem}>
    <div>
      <EditableText item={{ id: key, title: value }}
        changeField={(id, val) => onChangeEntry(itemId, id, val)} placeholder="with a placeholder" 
      />
    </div>
  </li>
);

ChecklistItem.propTypes = {
  desc: PropTypes.shape({}).isRequired,
  itemId: PropTypes.string.isRequired,
  onChangeEntry: PropTypes.func.isRequired
};
