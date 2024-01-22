import React, { JSX, useMemo, useState } from 'react';
import { BaseModalFooter } from '../base-modal-footer';
import { BaseModal, TCommonModalProps } from '../base-modal';
import { Stack, Step, StepLabel, Stepper } from '@mui/material';
import {
  convertImportData,
  E_IMPORT_ANNOTATIONS_FILE_TYPE,
  validateImportMap,
} from '../../annotation/import';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import {
  populateFromImportAction,
  selectImportFileMap,
  selectImportFileType,
  selectImportJSON,
  setImportFileTypeAction,
  TAnnotation,
} from '../../../store/annotation';
import { ImportModalFileUpload } from '../../../components/annotation/import-modal/import-modal-file-upload/ImportModalFileUpload';
import { ImportModalFileType } from '../../../components/annotation/import-modal/import-modal-file-type/ImportModalFileType';
import { ImportModalMapData } from '../../../components/annotation/import-modal/import-modal-map-data/ImportModalMapData';
import { toast } from 'react-hot-toast';

export type TImportAnnotationsModalProps = TCommonModalProps &
  TDynModalMeta<E_MODALS.IMPORT_ANNOTATIONS>;

const ImportAnnotationsModal = ({
  onClose,
}: TImportAnnotationsModalProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const importJSON = useAppSelector(selectImportJSON);
  const importFileType = useAppSelector(selectImportFileType);
  const importFileMap = useAppSelector(selectImportFileMap);

  const [stepperIndex, setStepperIndex] = useState<number>(0);

  const isProceedToNextStepEnabled = useMemo(() => {
    if (!importJSON) return false;

    if (stepperIndex === 0 && importJSON) return true;
    if (
      (stepperIndex === 1 || stepperIndex === 2) &&
      importFileType !== null &&
      importFileType !== E_IMPORT_ANNOTATIONS_FILE_TYPE.UNKNOWN &&
      importJSON
    )
      return true;

    return false;
  }, [importJSON, stepperIndex, importFileType]);

  const nextButtonCaption = useMemo(() => {
    if (
      stepperIndex === 2 &&
      importFileType !== E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON
    )
      return 'Import';

    if (
      stepperIndex === 1 &&
      importFileType === E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON
    )
      return 'Import';

    return 'Next';
  }, [importFileType, stepperIndex]);

  const handleGoBack = () => {
    if (stepperIndex === 0) return;

    if (stepperIndex === 1) dispatch(setImportFileTypeAction(null));

    setStepperIndex((prev) => prev - 1);
  };

  const handleClose = () => {
    onClose();
  };

  const handleNextStep = () => {
    if (
      (stepperIndex !== 2 &&
        importFileType !== E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON) ||
      (stepperIndex !== 1 &&
        importFileType === E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON)
    ) {
      setStepperIndex((prev) => prev + 1);
      return;
    }

    if (!importJSON || !importFileType) return;

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      validateImportMap(importJSON, importFileType, importFileMap);
    } catch (e: any) {
      toast.error(e.message);
      return;
    }

    let convertedData: Array<Array<TAnnotation>> = [];

    try {
      convertedData = convertImportData(
        importJSON,
        importFileType,
        importFileMap,
      );
    } catch (e: any) {
      toast.error(e.message);
    }

    if (!convertedData.length) return;

    dispatch(populateFromImportAction(convertedData));
  };

  return (
    <BaseModal
      show
      title={'Import annotations helper'}
      onClose={handleClose}
      footer={
        <BaseModalFooter
          cancelTitle={'Cancel'}
          onCancel={handleClose}
          applyTitle={nextButtonCaption}
          applyDisabled={!isProceedToNextStepEnabled}
          applyType={'button'}
          onApply={handleNextStep}
          resetTitle={'Go back'}
          resetDisabled={stepperIndex === 0}
          resetVisible={stepperIndex > 0}
          onReset={handleGoBack}
        />
      }
    >
      <Stack gap={4}>
        <Stepper activeStep={stepperIndex}>
          <Step completed={stepperIndex > 0} key={'step-0'}>
            <StepLabel>Upload data</StepLabel>
          </Step>
          <Step completed={stepperIndex > 1} key={'step-1'}>
            <StepLabel>Select data format</StepLabel>
          </Step>
          {importFileType !==
            E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON && (
            <Step completed={stepperIndex > 2} key={'step-2'}>
              <StepLabel>Map data</StepLabel>
            </Step>
          )}
        </Stepper>
        {stepperIndex === 0 && <ImportModalFileUpload />}
        {stepperIndex === 1 && <ImportModalFileType />}
        {stepperIndex === 2 && <ImportModalMapData />}
      </Stack>
    </BaseModal>
  );
};

export default ImportAnnotationsModal;
