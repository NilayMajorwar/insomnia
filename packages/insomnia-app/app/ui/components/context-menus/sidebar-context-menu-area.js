import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { hotKeyRefs } from '../../../common/hotkeys';
import { ContextMenuArea, ContextMenu, ContextMenuItem } from '../base/context-menu/index';
import ContextMenuHint from '../base/context-menu/context-menu-hint';

@autobind
class SidebarContextMenuArea extends PureComponent {
  _handleNewRequest() {
    const { handleCreateRequest, workspace } = this.props;
    handleCreateRequest(workspace._id);
  }

  _handleNewRequestGroup() {
    const { handleCreateRequestGroup, workspace } = this.props;
    handleCreateRequestGroup(workspace._id);
  }

  render() {
    const { hotKeyRegistry } = this.props;
    return (
      <ContextMenuArea>
        <div className="sidebar__context-area" />
        <ContextMenu>
          <ContextMenuItem onClick={this._handleNewRequest}>
            <i className="fa fa-plus-circle" /> New Request
            <ContextMenuHint keyBindings={hotKeyRegistry[hotKeyRefs.REQUEST_SHOW_CREATE.id]} />
          </ContextMenuItem>
          <ContextMenuItem onClick={this._handleNewRequestGroup}>
            <i className="fa fa-folder" /> New Folder
            <ContextMenuHint
              keyBindings={hotKeyRegistry[hotKeyRefs.REQUEST_SHOW_CREATE_FOLDER.id]}
            />
          </ContextMenuItem>
        </ContextMenu>
      </ContextMenuArea>
    );
  }
}

SidebarContextMenuArea.propTypes = {
  handleCreateRequest: PropTypes.func.isRequired,
  handleCreateRequestGroup: PropTypes.func.isRequired,
  workspace: PropTypes.object.isRequired,
  hotKeyRegistry: PropTypes.object.isRequired,
};

export default SidebarContextMenuArea;
