
import ChevronDownOutline from '@components/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Icons/ChevronUpOutline'
import MirrorOutline from '@components/Icons/MirrorOutline'
import WarningOutline from '@components/Icons/WarningOutline'
import type { WebIrys } from '@irys/sdk'
import { CHAIN_ID } from '@lensshare/data/constants'
import logger from '@lensshare/lib/logger'
import { Input, Tooltip } from '@lensshare/ui'

import { Button, Callout, Flex, IconButton, Text } from '@radix-ui/themes'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useEthersWalletClient from 'src/hooks/useEthersWalletClient'
import { IRYS_CURRENCY, useBytesStore } from 'src/store/bytes'
import { useIsMounted } from 'usehooks-ts'
import { formatEther, parseEther, parseUnits } from 'viem'
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction
} from 'wagmi'

const IrysInfo = () => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { data: signer } = useEthersWalletClient()
  const { sendTransactionAsync } = useSendTransaction()
  const { config } = usePrepareSendTransaction()
  const { data: userBalance } = useBalance({
    address,
    chainId: CHAIN_ID,
    watch: true
  })

  const uploadedMedia = useBytesStore((state) => state.uploadedMedia)
  const getIrysInstance = useBytesStore((state) => state.getIrysInstance)
  const irysData = useBytesStore((state) => state.irysData)
  const setIrysData = useBytesStore((state) => state.setIrysData)
  const [fetchingBalance, setFetchingBalance] = useState(false)

  const estimatePrice = async (irys: WebIrys) => {
    if (!uploadedMedia.stream) {
      return toast.error('Upload cost estimation failed')
    }
    return await irys.utils.getPrice(IRYS_CURRENCY, uploadedMedia.stream?.size)
  }

  const fetchBalance = async (irys?: WebIrys) => {
    setFetchingBalance(true)
    try {
      const instance = irys || irysData.instance
      if (address && instance) {
        const balance = await instance.getBalance(address)
        const price = await estimatePrice(instance)
        setIrysData({
          balance: formatEther(BigInt(balance.toString())),
          estimatedPrice: formatEther(BigInt(price.toString()))
        })
      }
      setFetchingBalance(false)
    } catch (error) {
      setFetchingBalance(false)
      logger.error('[Error Fetch Irys Balance]')
    }
  }

  const initIrys = async () => {
    if (signer && address && !irysData.instance) {
      const irys = await getIrysInstance(signer)
      if (irys) {
        setIrysData({ instance: irys })
        await fetchBalance(irys)
      }
    }
  }

  useEffect(() => {
    if (signer && isMounted()) {
      initIrys().catch((error) => logger.error('[Error Init Irys]'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, isMounted()])

  useEffect(() => {
    if (irysData.instance && isMounted()) {
      fetchBalance(irysData.instance).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [irysData.instance])

  const depositToIrys = async () => {
    if (!irysData.instance) {
      return await initIrys()
    }
    if (!irysData.deposit) {
      return toast.error('Enter deposit amount')
    }
    const depositAmount = parseFloat(irysData.deposit)
    const value = parseUnits(depositAmount.toString() as `${number}`, 9)
    if (!value || Number(value) < 1) {
      return toast.error('Invalid deposit amount')
    }
    if (
      userBalance?.formatted &&
      parseFloat(userBalance?.formatted) < depositAmount
    ) {
      return toast.error(
        `Insufficient funds in your wallet, you have ${userBalance?.formatted} MATIC.`
      )
    }
    setIrysData({ depositing: true })

    // TEMP:START: override irys functions for viem
    irysData.instance.tokenConfig.getFee = async (): Promise<any> => {
      return 0
    }
    irysData.instance.tokenConfig.sendTx = async (data): Promise<string> => {
      const { hash } = await sendTransactionAsync(data)
      return hash
    }
    irysData.instance.tokenConfig.createTx = async (
      amount: `${number}`,
      to: `0x${string}`
    ): Promise<{ txId: string | undefined; tx: any }> => {
      config.to = to
      config.value = parseEther(amount.toString() as `${number}`, 'gwei')
      return { txId: undefined, tx: config }
    }
    // TEMP:END: override irys functions for viem

    try {
      const fundResult = await irysData.instance.fund(value.toString())
      if (fundResult) {
        toast.success(
          `Deposit of ${formatEther(
            BigInt(fundResult?.quantity)
          )} is done and it will be reflected in few seconds.`
        )
       
      }
    } catch (error) {
      toast.error('Failed to deposit storage balance')
      logger.error('[Error Irys Deposit]')
    } finally {
      await fetchBalance()
      setIrysData({
        deposit: null,
        showDeposit: false,
        depositing: false
      })
    }
  }

  const onRefreshBalance = async () => {
    if (!irysData.instance) {
      return await initIrys()
    }
    await fetchBalance()
  }

  const isEnoughBalanceAvailable = irysData.estimatedPrice < irysData.balance

  return (
    <div className="mt-4 w-full space-y-4">
      {!isEnoughBalanceAvailable && !fetchingBalance ? (
        <Callout.Root color="red">
          <Callout.Icon>
            <WarningOutline className="h-4 w-4" />
          </Callout.Icon>
          <Callout.Text highContrast>
            Not enough storage balance available, deposit to continue.
          </Callout.Text>
        </Callout.Root>
      ) : null}
      <div className="space-y-1">
        <Text weight="medium">Estimated cost to upload</Text>
        <div className="flex justify-between">
          {!fetchingBalance ? (
            <Text weight="bold" size="5">
              {Number(irysData.estimatedPrice).toFixed(2)} matic
            </Text>
          ) : (
            <span className="mt-[6px] h-[22px] w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between rounded font-medium opacity-80">
          <span className="flex items-center space-x-1.5">
            <Text>Your storage balance</Text>
            <Tooltip content="Refresh balance" placement="top">
              <IconButton
                size="1"
                variant="soft"
                type="button"
                className="focus:outline-none"
                onClick={() => onRefreshBalance()}
              >
                <MirrorOutline className="h-3 w-3" />
              </IconButton>
            </Tooltip>
          </span>
          <span>
            <Button
              type="button"
              size="1"
              variant="soft"
              onClick={() =>
                setIrysData({
                  showDeposit: !irysData.showDeposit
                })
              }
            >
              <Text>Deposit</Text>
              {irysData.showDeposit ? (
                <ChevronUpOutline className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDownOutline className="ml-1 h-3 w-3" />
              )}
            </Button>
          </span>
        </div>
        <div className="flex justify-between">
          {!fetchingBalance ? (
            <Text weight="bold" size="5">
              {Number(irysData.balance).toFixed(2)} matic
            </Text>
          ) : (
            <span className="mt-[6px] h-[22px] w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
      {irysData.showDeposit && (
        <div className="space-y-1">
          <Text weight="medium">Amount to deposit (MATIC)</Text>
          <Flex gap="2">
            <Input
              type="number"
              placeholder={userBalance?.formatted}
              className="py-1.5 md:py-2"
              autoComplete="off"
              min={0}
              value={
                irysData.deposit ||
                (
                  Number(irysData.estimatedPrice) - Number(irysData.balance)
                ).toFixed(2)
              }
              onChange={(e) => {
                setIrysData({ deposit: e.target.value })
              }}
            />
            <Button
              type="button"
              variant="surface"
              highContrast
              disabled={irysData.depositing}
              onClick={() => depositToIrys()}
            >
              Deposit
            </Button>
          </Flex>
        </div>
      )}
    </div>
  )
}

export default IrysInfo
