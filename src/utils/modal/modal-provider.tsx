import { ReactNode } from 'react';
import { LazyComponent } from './lazy-component';
import { useSelector } from 'react-redux';
import { modalsListSelector, TModalMapItem } from '../../store/modals';

type TModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: TModalProviderProps) => {
  const modals = useSelector(modalsListSelector);

  return (
    <>
      {modals.map(({ id }: TModalMapItem) => (
        <LazyComponent key={id} filename={id} />
      ))}
      {children}
    </>
  );
};
