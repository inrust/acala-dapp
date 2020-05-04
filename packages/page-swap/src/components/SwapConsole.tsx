import React, { FC, memo, useContext, ReactElement, ChangeEvent, ReactNode } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';

import { Card, nextTick, IconButton } from '@honzon-platform/ui-components';
import { BalanceInput, TxButton, SwapContext, numToFixed18Inner, DexExchangeRate } from '@honzon-platform/react-components';
import { useFormValidator } from '@honzon-platform/react-hooks';

import classes from './SwapConsole.module.scss';
import { SwapInfo } from './SwapInfo';
import { SlippageInputArea } from './SlippageInputArea';

interface InputAreaProps {
  addon?: ReactNode;
  error: any;
  title: string;
  currencies: (CurrencyId | string)[];
  token: CurrencyId | string;
  onTokenChange: (token: CurrencyId) => void;
  value: number;
  onChange: any;
  inputName: string;
}

const InputArea: FC<InputAreaProps> = memo(({
  addon,
  currencies,
  error,
  inputName,
  onChange,
  onTokenChange,
  title,
  token,
  value
}) => {
  return (
    <div className={classes.inputAreaRoot}>
      <p className={classes.title}>{title}</p>
      <BalanceInput
        enableTokenSelect
        error={!!error}
        currencies={currencies}
        className={classes.input}
        name={inputName}
        onChange={onChange}
        onTokenChange={onTokenChange}
        token={token}
        value={value}
      />
      {addon}
    </div>
  );
});

InputArea.displayName = 'InputArea';

interface SwapBtn {
  onClick: () => void;
}

function SwapBtn ({ onClick }: SwapBtn): ReactElement {
  return (
    <IconButton
      className={classes.swapBtn}
      color='primary'
      onClick={onClick}
      icon='swap'
      size='large'
      type='border'
    />
  );
}

export const SwapConsole: FC = memo(() => {
  const {
    slippage,
    supplyCurrencies,
    targetCurrencies,
    calcSupply,
    calcTarget,
    setCurrency,
    pool,
  } = useContext(SwapContext);

  const validator = useFormValidator({
    supply: {
      type: 'balance',
      currency: pool.supplyCurrency,
      min: 0,
      max: pool.supplySize,
    },
    target: {
      type: 'number',
      max: pool.targetSize,
      min: 0
    }
  });

  const form = useFormik({
    initialValues: {
      supply: '' as any as number,
      target: '' as any as number
    },
    validate: validator,
    onSubmit: noop
  });

  const onSwap = (): void => {
    setCurrency(pool.targetCurrency, pool.supplyCurrency);
    form.resetForm();
  };

  const onSupplyChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);

    calcTarget(pool.supplyCurrency, pool.targetCurrency, value, slippage).then((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });

    form.handleChange(event);
  };

  const onTargetChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);

    calcSupply(pool.supplyCurrency, pool.targetCurrency, value, slippage).then((supply) => {
      nextTick(() => form.setFieldValue('supply', supply));
    });

    form.handleChange(event);
  };

  const onSlippageChange = (slippage: number): void => {
    const supply = form.values.supply;

    calcTarget(pool.supplyCurrency, pool.targetCurrency, supply, slippage).then((target) => {
      nextTick(() => form.setFieldValue('target', target));
    });
  }

  const onSupplyTokenChange = async (token: CurrencyId): Promise<void> => {
    await setCurrency(token, pool.targetCurrency);

    // reset form when supply token change
    form.resetForm();
  };

  const onTargetTokenChange = async (token: CurrencyId): Promise<void> => {
    await setCurrency(pool.supplyCurrency, token, (pool): void => {
      const supply = form.values.supply;
      calcTarget(pool.supplyCurrency, pool.targetCurrency, supply, slippage).then((target) => {
        console.log(target);
        form.setFieldValue('target', target)
      });
    });

  };

  const checkDisabled = (): boolean => {
    if (form.errors.supply || form.errors.target) {
      return true;
    }
    if (!(form.values.target && form.values.supply)) {
      return true;
    }
    return false;
  }


  return (
    <Card className={classes.root} gutter={false}>
      <div className={classes.main}>
        <InputArea
          error={form.errors.supply}
          inputName='supply'
          onChange={onSupplyChange}
          currencies={supplyCurrencies}
          onTokenChange={onSupplyTokenChange}
          title='Pay With'
          token={pool.supplyCurrency}
          value={form.values.supply as any as number}
        />
        <SwapBtn onClick={onSwap} />
        <InputArea
          addon={
            <div className={classes.addon}>
              <p>Exchange Rate</p>
              <DexExchangeRate
                supply={pool.supplyCurrency}
                target={pool.targetCurrency}
              />
            </div>
          }
          inputName='target'
          onChange={onTargetChange}
          currencies={targetCurrencies}
          onTokenChange={onTargetTokenChange}
          title='Receive'
          token={pool.targetCurrency}
          value={form.values.target}
          error={form.errors.target}
        />
        <TxButton
          size='large'
          className={classes.txBtn}
          method='swapCurrency'
          params={
            [
              pool.supplyCurrency,
              numToFixed18Inner(form.values.supply),
              pool.targetCurrency,
              numToFixed18Inner(form.values.target)
            ]
          }
          section='dex'
          disabled={checkDisabled()}
          onSuccess={form.resetForm}
        >
          Swap
        </TxButton>
      </div>
      <SwapInfo
        supply={form.values.supply}
        target={form.values.target}
      />
      <SlippageInputArea onChange={onSlippageChange} />
    </Card>
  );
});

SwapConsole.displayName = 'SwapConsole';
