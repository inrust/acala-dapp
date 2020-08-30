import React, { PropsWithChildren } from 'react';

import { useIsAppReady } from '@acala-dapp/react-hooks';
import { PageLoading } from '@acala-dapp/ui-components';

import { Sidebar, SideBarProps } from '../components/SideBar';
import classes from './Main.module.scss';

interface Props {
  sideBarProps: SideBarProps;
}

export const MainLayout: React.FC<PropsWithChildren<Props>> = ({ children, sideBarProps }) => {
  const { appReadyStatus } = useIsAppReady();

  return (
    <div className={classes.root}>
      <Sidebar {...sideBarProps} />
      <div className={classes.content}>
        {appReadyStatus ? children : <PageLoading />}
      </div>
    </div>
  );
};
