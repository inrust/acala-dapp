import React, { FC, memo, CSSProperties, ReactElement } from 'react';
import clsx from 'clsx';

import { BareProps } from './types';
import classes from './Grid.module.scss';

interface Props extends BareProps {
  container?: boolean;
  item?: boolean;
  flex?: number;
  direction?: 'column' | 'row';
  gutter?: number;
  pDirection?: 'column' | 'row';
  pGutter?: number;
}

export const Grid: FC<Props> = memo(({
  children,
  className,
  direction = 'row',
  gutter = 24,
  flex = 1,
  item,
  container,
  pDirection,
  pGutter
}) => {
  const getStyle = (): CSSProperties => {
    const _style = {} as CSSProperties;

    if (pDirection === 'row' && item) {
      _style.marginLeft = gutter || pGutter;
    }

    if (pDirection === 'column' && item) {
      _style.marginTop = gutter || pGutter;
    }

    if (direction === 'row' && container) {
      _style.marginLeft = -gutter || -(pGutter || 0);
    }

    if (direction === 'column' && container) {
      _style.marginTop = -gutter || -(pGutter || 0);
    }

    if (flex) {
      _style.flex = flex;
    }

    return _style;
  }

  return (
    <div
      className={
        clsx(
          className,
          {
            [classes.root]: container,
            [classes[direction]]: container
          }
        )
      }
      style={getStyle()}
    >
    {
      React.Children.map(children, (node) => {
        if (!node) {
          return null;
        }

        const _props = {
          pDirection: direction,
          pGutter: gutter
        } as any;

        return React.cloneElement(node as ReactElement, _props);
      })
    }
    </div>
  );
});

Grid.displayName = 'Grid';