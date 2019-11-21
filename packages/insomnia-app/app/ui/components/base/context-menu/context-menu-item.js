import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

@autobind
class ContextMenuItem extends PureComponent {
  _handleClick(e) {
    // TODO: Implement disabled items
    const { stayOpenAfterClick, onClick, disabled } = this.props;

    if (stayOpenAfterClick) {
      e.stopPropagation();
    }

    if (!onClick || disabled) return;

    if (this.props.hasOwnProperty('value')) {
      onClick(this.props.value, e);
    } else {
      onClick(e);
    }
  }

  render() {
    const { children, ...props } = this.props;
    const inner = (
      <div className="context-menu__inner">
        <div className="context-menu__text">{children}</div>
      </div>
    );

    const buttonProps = {
      type: 'button',
      onClick: this._handleClick,
      ...props,
    };

    return React.createElement('button', buttonProps, inner);
  }
}

ContextMenuItem.propTypes = {
  // Required
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,

  // Optional
  stayOpenAfterClick: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ContextMenuItem;
