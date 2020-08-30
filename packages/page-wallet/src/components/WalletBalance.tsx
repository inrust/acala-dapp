import React, { FC, ReactElement } from 'react';
import clsx from 'clsx';

import { CurrencyId } from '@acala-network/types/interfaces';
import { UserAssetBalance, UserAssetValue, TotalUserAssetValue, TokenImage, TokenName, TokenFullName, TransferButton, tokenEq, StakingPoolExchangeRate } from '@acala-dapp/react-components';
import { Condition } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { useConstants, useBalance } from '@acala-dapp/react-hooks';

import classes from './WalletBalance.module.scss';

const TotalAsset: FC<BareProps> = ({ className }) => {
  return (
    <div className={clsx(className, classes.totalAsset)}>
      <p>My Assets</p>
      <TotalUserAssetValue className={classes.num} />
    </div>
  );
};

interface AssetCardProps extends BareProps {
  currency: CurrencyId;
}

const AssetCard: FC<AssetCardProps> = ({ className, currency }) => {
  const { liquidCurrency } = useConstants();
  const liquidBalance = useBalance(liquidCurrency);

  return (
    <div className={clsx(className, classes.assetCard)}>
      <div className={classes.inner}>
      </div>
      <div className={classes.header}>
        <TokenImage
          className={classes.tokenImage}
          currency={currency}
        />
        <div className={classes.tokenArea}>
          <TokenName
            className={classes.name}
            currency={currency}
          />
          <TokenFullName
            className={classes.fullname}
            currency={currency}
          />
        </div>
        <div className={classes.balanceArea}>
          <UserAssetBalance
            className={classes.currency}
            currency={currency}
          />
          <Condition
            condition={tokenEq(currency, liquidCurrency)}
            or={
              <UserAssetValue
                className={classes.amount}
                currency={currency}
              />
            }>
            <StakingPoolExchangeRate
              className={classes.amount}
              liquidAmount={liquidBalance}
              showLiquidAmount={false}
            />
          </Condition>
        </div>
      </div>
      <TransferButton
        className={classes.transferBtn}
        currency={currency}
      />
    </div>
  );
};

export const WalletBalance: FC = () => {
  const { allCurrencies } = useConstants();

  return (
    <div className={classes.root}>
      <TotalAsset className={classes.item}/>
      {
        allCurrencies.map((currency: CurrencyId): ReactElement => (
          <AssetCard
            className={classes.item}
            currency={currency}
            key={`asset-card-${currency.toString()}`}
          />
        ))
      }
    </div>
  );
};
