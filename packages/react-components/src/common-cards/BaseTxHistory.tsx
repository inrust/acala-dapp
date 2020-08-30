/* eslint-disable */
// TODO: need update

import React, { FC, useMemo } from 'react';
import { Card, Table, TableConfig } from '@acala-dapp/ui-components';
import { useHistory, useAccounts } from '@acala-dapp/react-hooks';

import classes from './BaseTxHistory.module.scss';

interface Props {
  section: string;
  method: string | string[];
  config?: TableConfig[];
}

const defaultTableConfig: TableConfig[] = [
  {
    key: 'tx',
    render: (data): string => {
      return data.hash;
    },
    title: 'Tx Hash'
  }
];

export const BaseTxHistory: FC<Props> = ({
  config = defaultTableConfig,
  method,
  section
}) => {
  const { active } = useAccounts();

  const { data, error, loading, onPaginationChagne, pagination } = useHistory({
    method,
    section,
    signer: active ? active.address : ''
  });

  // const count = useMemo(() => {
  //   return Math.ceil(pagination.total / pagination.pageSize);
  // }, [pagination]);

  // const handlePaginationChagne = (_event: any, page: number): void => {
  //   onPaginationChagne({ currentPage: page - 1 });
  // };

  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      header='Transaction'
      padding={false}
    >
      <Table
        config={config}
        data={data}
        empty={ error ? 'Service Error' : 'No Tx History' }
        loading={loading}
        showHeader
      />
    </Card>
  );
};
