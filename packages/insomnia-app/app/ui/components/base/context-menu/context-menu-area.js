import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { executeHotKey } from '../../../../common/hotkeys-listener';
import { hotKeyRefs } from '../../../../common/hotkeys';
import KeydownBinder from '../../keydown-binder';

const contextMenusContainer = document.querySelector('#context-menus-container');

@autobind
class ContextMenuArea extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      menuX: 0,
      menuY: 0,

      // For keyboard navigation
      activeIndex: -1,

      // Forces new menu on every open
      uniquenessKey: 0,
    };
  }

  _setRef(n) {
    this._node = n;
  }

  _setListRef(n) {
    this._listNode = n;
  }

  _handleContextMenuNavigation(e) {
    const { key, shiftKey } = e;

    if (['Tab', 'ArrowUp', 'ArrowDown'].includes(key)) {
      const { activeIndex: i } = this.state;
      const length = this._listNode.querySelectorAll('li').length;

      if (key === 'ArrowUp' || (key === 'Tab' && shiftKey)) {
        const nextI = i > 0 ? i - 1 : length - 1;
        this.setState({ activeIndex: nextI });
      } else {
        const nextI = (i + 1) % length;
        this.setState({ activeIndex: nextI });
      }
    }
  }

  _getFlattenedMenuItems(menu) {
    let newChildren = [];

    // Ensure contextMenu is an array
    menu = Array.isArray(menu) ? menu : [menu];

    for (const child of menu) {
      if (!child) continue;
      if (child.type === React.Fragment) {
        newChildren = [...newChildren, ...this._getFlattenedMenuItems(child.props.children)];
      } else if (Array.isArray(child)) {
        newChildren = [...newChildren, ...this._getFlattenedMenuItems(child)];
      } else {
        newChildren.push(child);
      }
    }

    return newChildren;
  }

  _verifyAndGetChildren(children) {
    children = Array.isArray(children) ? children : [children];

    // ContextMenuArea must have two children
    if (children.length !== 2) {
      console.error(
        `ContextMenuArea should have exactly two direct child components. Got ${children.length ||
          1}`,
      );
    }

    let count = 0;
    let contextMenu = null;
    let contextArea = null;
    children.forEach(c => {
      if (c.type.displayName === 'ContextMenu') {
        contextMenu = c;
        count++;
      } else {
        contextArea = c;
      }
    });

    // Exactly one ContextMenu child is required
    if (count !== 1) {
      console.error(`ContextMenuArea needs exactly one ContextMenu child. Got ${count}`);
    }

    return [contextMenu, contextArea];
  }

  _handleBodyKeyDown(e) {
    console.log('BodyKeyDown called!');
    if (!this.state.open) {
      return;
    }

    // Catch all key presses (like global app hotkeys) if we're open
    e.stopPropagation();

    this._handleContextMenuNavigation(e);
    executeHotKey(e, hotKeyRefs.CLOSE_CONTEXT_MENU, () => {
      this.hide();
    });
  }

  _handleLeftClick(e) {
    this.hide();
  }

  _handleRightClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggle(e);
  }

  hide() {
    this.setState({ open: false });
    this.props.onHide && this.props.onHide();
  }

  show(e) {
    this.setState({
      open: true,
      menuX: e.clientX,
      menuY: e.clientY,
      activeIndex: -1,
      uniquenessKey: this.state.uniquenessKey + 1,
    });

    this.props.onOpen && this.props.onOpen();
  }

  toggle(e) {
    if (this.state.open) this.hide();
    else this.show(e);
  }

  render() {
    console.log('ContextMenuArea rendered!');
    const { children } = this.props;
    const { open, menuY, menuX, uniquenessKey, activeIndex } = this.state;

    const classes = classnames('context-menu theme--dropdown__menu', {
      'context-menu--open': open,
    });

    const [menu, area] = this._verifyAndGetChildren(children);
    const flattenedChildren = this._getFlattenedMenuItems(menu.props.children);

    const finalMenuItems = flattenedChildren.map((child, i) => {
      const classes = classnames('context-menu--item', { active: i === activeIndex });
      return (
        <li key={i} className={classes}>
          {child}
        </li>
      );
    });

    const finalContextMenu = (
      <div tabIndex="-1" className="context-menu__list" ref={this._setListRef}>
        <ul>{finalMenuItems}</ul>
      </div>
    );

    const finalChildren = [
      area,
      ReactDOM.createPortal(
        <div key="item" style={{ top: menuY, left: menuX }} className={classes} aria-hidden={!open}>
          <div className="context-menu__backdrop theme--transparent-overlay" />
          {finalContextMenu}
        </div>,
        contextMenusContainer,
      ),
    ];

    return (
      <KeydownBinder stopMetaPropagation onKeydown={this._handleBodyKeyDown} disabled={!open}>
        <div
          key={uniquenessKey}
          onClick={this._handleLeftClick}
          onContextMenu={this._handleRightClick}
          className="context-menu__wrapper"
          ref={this._setRef}
          tabIndex="-1">
          {finalChildren}
        </div>
      </KeydownBinder>
    );
  }
}

ContextMenuArea.propTypes = {
  // Required
  children: PropTypes.node.isRequired,

  // Optional
  onHide: PropTypes.func,
  onOpen: PropTypes.func,
};

export default ContextMenuArea;
