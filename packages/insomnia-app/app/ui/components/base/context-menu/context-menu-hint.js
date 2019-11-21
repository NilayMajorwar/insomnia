// @flow
import React, { PureComponent } from 'react';
import Hotkey from '../../hotkey';
import type { KeyBindings } from '../../../../common/hotkeys';

type Props = {
  keyBindings: KeyBindings,
};

class ContextMenuHint extends PureComponent<Props> {
  render() {
    const { keyBindings } = this.props;
    return <Hotkey className="context-menu__hint" keyBindings={keyBindings} />;
  }
}

export default ContextMenuHint;
