import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  closeModal,
  E_MODALS,
  isModalOpenSelector,
  openModal,
  TDynModalMeta,
} from '../../store/modals';
import { useCallback } from 'react';

export const useModal = <K extends E_MODALS>(modalFileName: K) => {
  const dispatch = useAppDispatch();

  const onOpen = useCallback(
    (meta: TDynModalMeta<K>) => dispatch(openModal(modalFileName, meta)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modalFileName],
  );
  const onClose = useCallback(
    () =>
      dispatch(
        closeModal({
          modal: modalFileName,
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modalFileName],
  );

  const isOpen = useAppSelector(isModalOpenSelector(modalFileName));

  return {
    isOpen,
    onOpen,
    onClose,
  };
};
