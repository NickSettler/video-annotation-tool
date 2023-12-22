import { E_MODAL_ROLE } from './types';
import { FormEvent, JSX } from 'react';
import { Box, Button } from '@mui/material';
import { assign } from 'lodash';

type TBaseModalFooterCancelProps =
  | {
      cancelTitle: string;
      onCancel(): void;
    }
  | {
      cancelTitle?: never;
      onCancel?: never;
    };

type TBaseModalFooterApplyProps =
  | {
      applyTitle: string;
      onApply(event: FormEvent): void;
    }
  | {
      applyTitle?: never;
      onApply?: never;
    };

export type TBaseModalFooterProps = TBaseModalFooterApplyProps &
  TBaseModalFooterCancelProps & {
    role?: E_MODAL_ROLE;
  };

const defaultModalFooterProps: Partial<TBaseModalFooterProps> = {
  role: E_MODAL_ROLE.REGULAR,
};

export const BaseModalFooter = (props: TBaseModalFooterProps): JSX.Element => {
  assign(props, defaultModalFooterProps);

  const { role, ...rest } = props;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {rest.cancelTitle && (
        <Button type={'button'} color={'muted'} onClick={rest.onCancel}>
          {rest.cancelTitle}
        </Button>
      )}
      {rest.applyTitle && (
        <Button
          type={'submit'}
          color={role === E_MODAL_ROLE.DESTRUCTIVE ? 'error' : 'primary'}
          onClick={rest.onApply}
        >
          {rest.applyTitle}
        </Button>
      )}
    </Box>
  );
};
