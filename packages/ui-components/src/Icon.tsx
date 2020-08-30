import React, { ReactNode } from 'react';

import { ReactComponent as CopyIcon } from './assets/copy.svg';
import { ReactComponent as SwapIcon } from './assets/swap.svg';
import { ReactComponent as EditIcon } from './assets/edit.svg';
import { ReactComponent as CloseIcon } from './assets/close.svg';
import { ReactComponent as ArrowDownIcon } from './assets/arrow-down.svg';
import { ReactComponent as CheckedCircleIcon } from './assets/checked-circle.svg';
import { ReactComponent as SwitchIcon } from './assets/switch.svg';

export * from '@ant-design/icons';

export {
  ArrowDownIcon,
  CopyIcon,
  CloseIcon,
  CheckedCircleIcon,
  EditIcon,
  SwapIcon,
  SwitchIcon
};

export type IconType = 'copy' | 'swap' | 'edit' | 'close';

export const getIcon = (name: IconType): ReactNode => {
  if (name === 'copy') {
    return <CopyIcon />;
  }

  if (name === 'swap') {
    return <SwapIcon />;
  }

  if (name === 'edit') {
    return <EditIcon />;
  }

  if (name === 'close') {
    return <CloseIcon />;
  }
};
