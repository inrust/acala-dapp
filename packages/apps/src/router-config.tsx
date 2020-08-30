import React, { ReactElement, lazy, LazyExoticComponent, Suspense } from 'react';

import PageGovernance from '@acala-dapp/page-governance';
import { PageLoading } from '@acala-dapp/ui-components';

import { MainLayout } from './layouts/Main';
import { sideBarConfig } from './sidebar-config';

export interface RouterConfigData {
  children?: RouterConfigData[];
  element?: ReactElement | LazyExoticComponent<any>;
  path: string;
  redirectTo?: string;
}

const PageWallet = lazy(() => import('@acala-dapp/page-wallet'));
const PageDeposit = lazy(() => import('@acala-dapp/page-deposit'));
const PageLoan = lazy(() => import('@acala-dapp/page-loan'));
const PageHoma = lazy(() => import('@acala-dapp/page-homa'));
const PageSwap = lazy(() => import('@acala-dapp/page-swap'));

export const config: RouterConfigData[] = [
  {
    children: [
      {
        element: <Suspense fallback={<PageLoading />}><PageWallet/></Suspense>,
        path: 'wallet'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageDeposit /></Suspense>,
        path: 'deposit'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageLoan /></Suspense>,
        path: 'loan'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageHoma /></Suspense>,
        path: 'homa'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageSwap /></Suspense>,
        path: 'swap'
      },
      {
        element: <Suspense fallback={<PageLoading />}><PageGovernance /></Suspense>,
        path: 'governance'
      },
      {
        path: '*',
        redirectTo: 'loan'
      }
    ],
    element: <MainLayout sideBarProps={{ config: sideBarConfig }} />,
    path: '*'
  }
];
