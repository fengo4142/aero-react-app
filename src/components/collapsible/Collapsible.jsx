import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { FormattedMessage } from 'react-intl';
import styles from './collapsible.module.scss';
import Clickable from '../clickable/Clickable';


class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
    this.onItemClick = this.onItemClick.bind(this);
    this.content = React.createRef();
    this.transitionStyles = {
      entered: {
        // overflow: 'visible'
      }
    };
  }

  componentDidMount() {
    const { openOnMount, offset, autoheight } = this.props;
    if (autoheight) {
      this.transitionStyles.entered.maxHeight = this.content.current.scrollHeight + offset;
    } else {
      this.transitionStyles.entered.maxHeight = '100vh';
      this.transitionStyles.entered.overflow = 'auto';
    }
    this.setState({ active: openOnMount });
  }

  onItemClick() {
    this.setState(prevState => ({ active: !prevState.active }));
  }

  render() {
    const { active } = this.state;
    const { children, title, styleClasses } = this.props;
    const classes = [
      styles.header,
      !styleClasses && styles.title,
      active && styles.open,
      styleClasses
    ].filter(e => e);

    return (
      <div className={styles.collapsible}>
        <Clickable onClick={this.onItemClick} className={classes.join(' ')} style={{padding:this.props.styles}}>
          <FormattedMessage id={title} defaultMessage={title} />
        </Clickable>
        <Transition in={active} timeout={0}>
          {state => (
            <div ref={this.content} className={styles.content}
              style={this.transitionStyles[state]}
            >
              {children}
            </div>
          )}
        </Transition>
      </div>
    );
  }
}

Collapsible.defaultProps = {
  styleClasses: '',
  openOnMount: false,
  offset: 0,
  autoheight: true
};

Collapsible.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  styleClasses: PropTypes.string,
  openOnMount: PropTypes.bool,
  autoheight: PropTypes.bool,
  offset: PropTypes.number
};

export default Collapsible;
