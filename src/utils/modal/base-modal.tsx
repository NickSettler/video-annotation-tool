import { FormEvent, memo, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

export enum E_MODAL_MODE {
  CREATE = 'create',
  UPDATE = 'update',
}

export type TCommonModalProps = {
  isOpen: boolean;
  onClose(): void;
};

export type TBaseModalProps = {
  show: boolean;
  title: string;
  children: ReactNode | string;
  footer?: ReactNode | string;
  onClose?(
    event: Record<string, never>,
    reason: 'backdropClick' | 'escapeKeyDown',
  ): void;
  onSubmit?(event: FormEvent): void;
};

export const BaseModal = memo((props: TBaseModalProps) => {
  const { title, footer, onClose, onSubmit, children } = props;

  const root = document.getElementById('root');

  if (!root) throw new Error('Root node not found. Cannot render modal.');

  return createPortal(
    <Dialog
      fullWidth
      open={props.show}
      onClose={onClose}
      {...(onSubmit ? { component: 'form', onSubmit } : {})}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>,
    root,
  );
});

BaseModal.displayName = 'BaseModal';
