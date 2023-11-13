import React, { lazy, Suspense } from 'react';
import {
  closeModal,
  E_MODALS,
  isModalOpenSelector,
  modalMetaSelector,
} from '../../store/modals';
import { useAppDispatch, useAppSelector } from '../../store/store';

type TLazyComponentProps = {
  filename: E_MODALS;
};

export const LazyComponent = ({ filename }: TLazyComponentProps) => {
  const isOpen = useAppSelector(isModalOpenSelector(filename));

  const meta = useAppSelector(modalMetaSelector(filename));

  const dispatch = useAppDispatch();

  const handleModalClose = () => {
    dispatch(
      closeModal({
        modal: filename,
      }),
    );
  };

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const Component = lazy(() => import(`./modals/${filename}.tsx`));

  return (
    <Suspense fallback={null}>
      {filename ? (
        <Component isOpen={isOpen} onClose={handleModalClose} {...meta} />
      ) : null}
    </Suspense>
  );
};
