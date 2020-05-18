import React, { FC, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';

import { DerivedLoanType } from '@acala-network/api-derive';
import { CurrencyId, Rate } from '@acala-network/types/interfaces';
import { convertToFixed18 } from '@acala-network/app-util';

import { useAccounts, useAllLoans, useLoan } from '@honzon-platform/react-hooks';
import { Table, TableItem, Radio, Button } from '@honzon-platform/ui-components';
import { Token, tokenEq, LoanInterestRate, FormatFixed18, UserBalance } from '@honzon-platform/react-components';

import classes from './SelectCollateral.module.scss';
import { createProviderContext } from './CreateProvider';
import { LoanContext } from './LoanProvider';

export const SelectCollateral: FC = () => {
  const { loanTypes } = useAllLoans();
  const [selected, setSelected] = useState<CurrencyId>(null as any as CurrencyId);
  const { active } = useAccounts();
  const { setSelectedToken, setStep } = useContext(createProviderContext);
  const { cancelCurrentTab } = useContext(LoanContext);
  const collateralDisabled = useRef<{[k in string]: boolean}>({});

  const onSelect = (token: CurrencyId) => {
    setSelected(token);
  };

  const handleNext = () => {
    setStep('generate');
    setSelectedToken(selected);
  };

  const checkDisabled = () => {
    if (!selected) {
      return true;
    }

    return false;
  };

  const tableConfig: TableItem<DerivedLoanType>[] = useMemo(() => [
    {
      title: 'Collateral Type',
      width: 2,
      align: 'left',
      dataIndex: 'token',
      render: (token: CurrencyId) => {
        const { currentUserLoan } = useLoan(token);

        useEffect(() => {
          if (currentUserLoan?.collaterals.isEmpty) {
            collateralDisabled.current[currentUserLoan?.token] = true;
          }
        }, [currentUserLoan]);

        return (
          <Radio
            disabled={!currentUserLoan?.collaterals.isEmpty}
            checked={tokenEq(token, selected)}
            label={<Token token={token}/>}
            onClick={() => onSelect(token)}
          />
        );
      }
    },
    {
      title: 'Interest Rate',
      width: 1,
      dataIndex: 'token',
      render: (token: CurrencyId) => <LoanInterestRate token={token} />
    },
    {
      title: 'Min.Collateral',
      width: 1,
      dataIndex: 'requiredCollateralRatio',
      render: (collateralRatio: Rate) => (
        <FormatFixed18
          data={convertToFixed18(collateralRatio)}
          format='percentage'
        />
      )
    },
    {
      title: 'LIQ Ratio',
      width: 1,
      dataIndex: 'liquidationRatio',
      render: (liquidationRatio: Rate) => (
        <FormatFixed18
          data={convertToFixed18(liquidationRatio)}
          format='percentage'
        />
      )
    },
    {
      title: 'LIQ Fee',
      width: 1,
      dataIndex: 'liquidationPenalty',
      render: (liquidationRatio: Rate) => (
        <FormatFixed18
          data={convertToFixed18(liquidationRatio)}
          format='percentage'
        />
      )
    },
    {
      title: 'Avail.Balance',
      width: 1,
      dataIndex: 'token',
      render: (token: CurrencyId) => (
        <UserBalance
          account={active ? active.address : ''}
          token={token}
        />
      )
    }
  ], [selected]);

  const handleRowClick = useCallback((_event: any, data: DerivedLoanType) => {
    if (collateralDisabled.current[data.token.toString()]) {
      setSelected(data.token as CurrencyId);
    }
  }, [setSelected]);

  return (
    <div className={classes.root}>
      <Table
        config={tableConfig}
        data={loanTypes}
        rawProps={{
          onClick: handleRowClick
        }}
        showHeader
      />
      <div className={classes.action}>
        <Button
          onClick={cancelCurrentTab}
          size='small'
          type='border'
        >
          Cancel
        </Button>
        <Button
          color='primary'
          disabled={checkDisabled()}
          onClick={handleNext}
          size='small'
        >
          Next
        </Button>
      </div>
    </div>
  );
};
