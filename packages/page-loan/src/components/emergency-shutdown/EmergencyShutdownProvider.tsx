import React, { createContext, FC, PropsWithChildren, useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Fixed18 } from '@acala-network/app-util';

import { useLockPrices, LockedPricesResult } from '@acala-dapp/react-hooks/useLockPrices';
import { useConstants, useReclaimCollateral, useBalance } from '@acala-dapp/react-hooks';

export type EmergencyShutdownStep = 'trigger' | 'process' | 'reclaim' | 'success';

export const StepRoute: EmergencyShutdownStep[] = ['trigger', 'process', 'reclaim'];

export interface EmergencyShutdownContextData {
  step: EmergencyShutdownStep;
  setStep: (step: EmergencyShutdownStep) => void;
  lockedPrices: LockedPricesResult;
  canReclaim: boolean;
  setCanReclaim: (flag: boolean) => void;
  collaterals: Record<string, Fixed18>;
  collateralRef: Record<string, Fixed18>;
  updateCollateralRef: (data: Record<string, Fixed18>) => void;
  reclaimBalanceIsEmpty: boolean;
}

export const EmergencyShutdownContext = createContext<EmergencyShutdownContextData>({} as EmergencyShutdownContextData);

export const EmergencyShutdownProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const lockedPrices = useLockPrices();
  const [step, setStep] = useState<EmergencyShutdownStep>('trigger');
  const [canReclaim, setCanReclaim] = useState<boolean>(false);
  const { stableCurrency } = useConstants();
  const { calcCanReceive } = useReclaimCollateral();
  const stableCoinBalance = useBalance(stableCurrency);
  const collateralsRef = useRef<Record<string, Fixed18>>({});
  const reclaimBalanceIsEmpty = useMemo(() => {
    if (stableCoinBalance.isNaN() || stableCoinBalance.isZero()) {
      return true;
    }

    return false;
  }, [stableCoinBalance]);

  const collaterals = useMemo<Record<string, Fixed18>>((): Record<string, Fixed18> => {
    if (!stableCoinBalance) return {};

    const result = calcCanReceive(stableCoinBalance);

    return result;
  }, [calcCanReceive, stableCoinBalance]);

  useEffect(() => {
    if (stableCoinBalance.isNaN() || stableCoinBalance.isZero()) {
      setCanReclaim(false);
    }
  }, [calcCanReceive, stableCoinBalance]);

  const updateCollateralRef = useCallback((data: Record<string, Fixed18>) => {
    collateralsRef.current = data;
  }, []);

  return (
    <EmergencyShutdownContext.Provider value={{
      canReclaim,
      collateralRef: collateralsRef.current,
      collaterals,
      lockedPrices,
      reclaimBalanceIsEmpty,
      setCanReclaim,
      setStep,
      step,
      updateCollateralRef
    }}>
      {children}
    </EmergencyShutdownContext.Provider>
  );
};
