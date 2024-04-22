import { ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { SETTINGS } from '@lensshare/data/tracking';
import type { ApprovedAllowanceAmountResult } from '@lensshare/lens';
import {
  OpenActionModuleType,
  useGenerateModuleCurrencyApprovalDataLazyQuery
} from '@lensshare/lens';
import { Button, Modal, Spinner, WarningMessage } from '@lensshare/ui';
import errorToast from '@lib/errorToast';
import getAllowanceModule from '@lib/getAllowanceModule';
import { Leafwatch } from '@lib/leafwatch';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useSendTransaction, useWaitForTransaction } from 'wagmi';

interface AllowanceButtonProps {
  title?: string;
  module: ApprovedAllowanceAmountResult;
  allowed: boolean;
  setAllowed: Dispatch<SetStateAction<boolean>>;
}

const AllowanceButton: FC<AllowanceButtonProps> = ({
  title = 'Allow',
  module,
  allowed,
  setAllowed
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [generateModuleCurrencyApprovalData, { loading: queryLoading }] =
    useGenerateModuleCurrencyApprovalDataLazyQuery();
    const handleWrongNetwork = useHandleWrongNetwork();
  const onError = (error: any) => {
    errorToast(error);
  };

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    onError
  });

  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success(
        allowed
          ? 'Module disabled successfully!'
          : 'Module enabled successfully!'
      );

      setShowWarningModal(false);
      setAllowed(!allowed);
      Leafwatch.track(SETTINGS.ALLOWANCE.TOGGLE, {
        allowed: !allowed,
        currency: module.allowance.asset.symbol,
        module: module.moduleName
      });
    },
    onError
  });

  const handleAllowance = async (
    contract: string,
    value: string,
    selectedModule: string
  ) => {
    try {
      const isUnknownModule =
        module.moduleName === OpenActionModuleType.UnknownOpenActionModule;

      const { data } = await generateModuleCurrencyApprovalData({
        variables: {
          request: {
            allowance: { currency: contract, value: value },
            module: {
              [isUnknownModule
                ? 'unknownOpenActionModule'
                : getAllowanceModule(module.moduleName).field]: isUnknownModule
                ? module.moduleContract.address
                : selectedModule
            }
          }
        }
      });
      await handleWrongNetwork();

      return sendTransaction?.({
        account: data?.generateModuleCurrencyApprovalData.from,
        data: data?.generateModuleCurrencyApprovalData.data,
        to: data?.generateModuleCurrencyApprovalData.to
      });
    } catch (error) {
      onError(error);
    }
  };

  return allowed ? (
    <Button
      onClick={() =>
        handleAllowance(
          module.allowance.asset.contract.address,
          '0',
          module.moduleName
        )
      }
    >
      Revoke
    </Button>
  ) : (
    <>
      <Button onClick={() => setShowWarningModal(!showWarningModal)} outline>
        {title}
      </Button>
      <Modal
        icon={<ExclamationTriangleIcon className="w-5 h-5" />}
        onClose={() => setShowWarningModal(false)}
        show={showWarningModal}
        title="Warning"
      >
        <div className="space-y-3 p-5">
          <WarningMessage
            message={
              <div className="leading-6">
                Please be aware that by allowing this module, the amount
                indicated will be automatically deducted when you <b>Collect</b>{' '}
                and <b>Super follow</b>.
              </div>
            }
            title="Handle with care!"
          />
          <Button
            disabled={queryLoading || transactionLoading || waitLoading}
            icon={
              queryLoading || transactionLoading || waitLoading ? (
                <Spinner size="xs" />
              ) : (
                <PlusIcon className="w-4 h-4" />
              )
            }
            onClick={() =>
              handleAllowance(
                module.allowance.asset.contract.address,
                Number.MAX_SAFE_INTEGER.toString(),
                module.moduleName
              )
            }
          >
            {title}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AllowanceButton;
