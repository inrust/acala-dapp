import React, { FC } from 'react';

import { Page, Grid } from '@acala-dapp/ui-components';
import { WalletBalance } from '@acala-dapp/react-components';
import { SwapConsole } from './components/SwapConsole';
import { AllMarkets } from './components/AllMarkets';
import { Transaction } from './components/Transaction';
import { SwapProvider } from './components/SwapProvider';

const PageSwap: FC = () => {
  return (
    <SwapProvider>
      <Page>
        <Page.Title title='Swap' />
        <Page.Content>
          <Grid container>
            <Grid item>
              <WalletBalance />
            </Grid>
            <Grid item>
              <SwapConsole />
            </Grid>
            <Grid item>
              <AllMarkets />
            </Grid>
            <Grid item>
              <Transaction />
            </Grid>
          </Grid>
        </Page.Content>
      </Page>
    </SwapProvider>
  );
};

export default PageSwap;
