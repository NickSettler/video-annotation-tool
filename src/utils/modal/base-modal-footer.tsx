import { E_MODAL_ROLE } from './types';
import { FormEvent, JSX } from 'react';
import { Box, Button } from '@mui/material';
import { assign } from 'lodash';

type TBaseModalFooterCancelProps =
  | {
      cancelTitle: string;
      cancelDisabled?: boolean;
      onCancel(): void;
    }
  | {
      cancelTitle?: never;
      onCancel?: never;
      cancelDisabled?: never;
    };

type TBaseModalFooterApplyProps =
  | {
      applyTitle: string;
      applyDisabled?: boolean;
      applyType?: 'button' | 'submit';
      onApply(event: FormEvent): void;
    }
  | {
      applyTitle?: never;
      applyDisabled?: never;
      applyType?: never;
      onApply?: never;
    };

type TBaseModalFooterResetProps =
  | {
      resetTitle: string;
      resetDisabled?: boolean;
      resetVisible?: boolean;
      onReset(event: FormEvent): void;
    }
  | {
      resetTitle?: never;
      resetDisabled?: never;
      resetVisible?: never;
      onReset?: never;
    };

export type TBaseModalFooterProps = TBaseModalFooterApplyProps &
  TBaseModalFooterCancelProps &
  TBaseModalFooterResetProps & {
    role?: E_MODAL_ROLE;
  };

const defaultModalFooterProps: Partial<TBaseModalFooterProps> = {
  role: E_MODAL_ROLE.REGULAR,
};

export const BaseModalFooter = (props: TBaseModalFooterProps): JSX.Element => {
  assign(props, defaultModalFooterProps);

  const { role, ...rest } = props;

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      {rest.resetTitle && rest.resetVisible && (
        <>
          <Button
            type={'button'}
            color={'muted'}
            onClick={rest.onReset}
            disabled={rest.resetDisabled}
          >
            {rest.resetTitle}
          </Button>
          <Box flexGrow={1} />
        </>
      )}
      {rest.cancelTitle && (
        <Button
          type={'button'}
          color={'muted'}
          onClick={rest.onCancel}
          disabled={rest.cancelDisabled}
        >
          {rest.cancelTitle}
        </Button>
      )}
      {rest.applyTitle && (
        <Button
          type={rest.applyType || 'submit'}
          color={role === E_MODAL_ROLE.DESTRUCTIVE ? 'error' : 'primary'}
          onClick={rest.onApply}
          disabled={rest.applyDisabled}
        >
          {rest.applyTitle}
        </Button>
      )}
    </Box>
  );
};
