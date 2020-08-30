import React, { FC, useState, useEffect, ReactNode } from 'react';
import { Card, TableConfig, Table } from '@acala-dapp/ui-components';
import { useAllUserLoans, filterEmptyLoan } from '@acala-dapp/react-hooks';
import { DerivedUserLoan } from '@acala-network/api-derive';
import { Token, FormatBalance, TxButton } from '@acala-dapp/react-components';
import { convertToFixed18 } from '@acala-network/app-util';
import { CurrencyLike } from '@acala-dapp/react-hooks/types';

export const WithdrawNoDebitLoan: FC = () => {
  const [empty, setEmpty] = useState<boolean>(true);

  const loans = useAllUserLoans();

  const tableConfig: TableConfig[] = [
    {
      align: 'left',
      dataIndex: 'token',
      /* eslint-disable-next-line react/display-name */
      render: (token: CurrencyLike): ReactNode => (
        <Token currency={token} />
      ),
      title: 'Token',
      width: 1
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (data: DerivedUserLoan): ReactNode => (
        <FormatBalance
          balance={convertToFixed18(data.collaterals)}
          currency={data.token}
        />
      ),
      title: 'Collateral',
      width: 4
    },
    {
      align: 'right',
      /* eslint-disable-next-line react/display-name */
      render: (data: DerivedUserLoan): ReactNode => {
        const params = [data.token, '-' + data.collaterals, '0'];

        return (
          <TxButton
            method='adjustLoan'
            params={params}
            section='honzon'
            size='small'
          >
            Widthdraw
          </TxButton>
        );
      },
      title: '',
      width: 1
    }
  ];

  useEffect(() => {
    if (!loans) return;

    setEmpty(!filterEmptyLoan(loans).length);
  }, [loans]);

  // wait loading data
  if (empty) {
    return null;
  }

  return (
    <Card header='Free Collteral'
      padding={false}
    >
      <Table
        config={tableConfig}
        data={filterEmptyLoan(loans)}
        showHeader
      />
    </Card>
  );
};
