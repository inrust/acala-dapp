
import { useMemo } from 'react';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Vec } from '@polkadot/types';

import { useApi } from './useApi';
import { Fixed18, convertToFixed18 } from '@acala-network/app-util';

const LOAN_CURRENCIES_WEIGHT = new Map<string, number>([
  ['DOT', 9],
  ['RENBTC', 8],
  ['LDOT', 7],
  ['XBTC', 6]
]);

const CURRENCIES_WEIGHT = new Map<string, number>([
  ['ACA', 9],
  ['AUSD', 8],
  ['DOT', 7],
  ['RENBTC', 6],
  ['LDOT', 5],
  ['XBTC', 4]
]);

export type HooksReturnType = {
  allCurrencies: CurrencyId[];
  crossChainCurrencies: CurrencyId[];
  dexBaseCurrency: CurrencyId;
  dexCurrencies: CurrencyId[];
  loanCurrencies: CurrencyId[];
  expectedBlockTime: number;
  nativeCurrency: CurrencyId;
  minmumDebitValue: Fixed18;
  stableCurrency: CurrencyId;
  stakingCurrency: CurrencyId;
  liquidCurrency: CurrencyId;
  [key: string]: any;
}

export const useConstants = (): HooksReturnType => {
  const { api } = useApi();

  // all currencies id
  const allCurrencies = useMemo((): CurrencyId[] => {
    const tokenList = (api.registry.createType('CurrencyId' as any).defKeys as string[])
      .sort((a, b): number => (CURRENCIES_WEIGHT.get(b.toString()) || 0) - (CURRENCIES_WEIGHT.get(a.toString()) || 0));

    return tokenList.map((name: string): CurrencyId => {
      return api.registry.createType('CurrencyId' as any, name) as CurrencyId;
    });
  }, [api]);

  const crossChainCurrencies = useMemo((): CurrencyId[] => {
    return ['AUSD', 'RENBTC', 'DOT'].map((name: string): CurrencyId => {
      return api.registry.createType('CurrencyId' as any, name) as CurrencyId;
    });
  }, [api]);

  const loanCurrencies = useMemo(() => (api.consts.cdpEngine.collateralCurrencyIds as Vec<CurrencyId>)
    .sort((a, b): number => (LOAN_CURRENCIES_WEIGHT.get(b.toString()) || 0) - (LOAN_CURRENCIES_WEIGHT.get(a.toString()) || 0)), [api]);

  // all currencies in dex
  const dexCurrencies = useMemo(() => api.consts.dex.enabledCurrencyIds as Vec<CurrencyId>, [api]);

  // dex base currency
  const dexBaseCurrency = useMemo(() => api.consts.dex.getBaseCurrencyId as CurrencyId, [api]);

  // stable currency id
  const stableCurrency = useMemo(() => api.consts.cdpEngine.getStableCurrencyId as CurrencyId, [api]);

  // native currency id
  const nativeCurrency = useMemo(() => api.consts.currencies.nativeCurrencyId as CurrencyId, [api]);

  // expect block time
  const expectedBlockTime = useMemo(() => api.consts.babe.expectedBlockTime.toNumber(), [api]);

  // loan minmum debit value
  const minmumDebitValue = useMemo<Fixed18>(() => convertToFixed18(api.consts.cdpEngine.minimumDebitValue), [api]);

  // staking currency
  const stakingCurrency = useMemo(() => api.consts.stakingPool.stakingCurrencyId as CurrencyId, [api]);

  // liquid currency
  const liquidCurrency = useMemo(() => api.consts.stakingPool.liquidCurrencyId as CurrencyId, [api]);

  return {
    allCurrencies,
    crossChainCurrencies,
    dexBaseCurrency,
    dexCurrencies,
    expectedBlockTime,
    liquidCurrency,
    loanCurrencies,
    minmumDebitValue,
    nativeCurrency,
    stableCurrency,
    stakingCurrency,
    ...api.consts
  };
};
