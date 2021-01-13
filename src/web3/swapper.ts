import BigNumber from 'bignumber.js';
import { Interface } from '@ethersproject/abi';
import { Swap } from '@balancer-labs/sor/dist/types';

import ERC20ABI from '../abi/ERC20.json';
import ExchangeProxyABI from '../abi/ExchangeProxy.json';

import config from '@/config';
import { ETH_KEY } from '@/utils/helpers';

const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const exchangeProxyAddress = config.addresses.exchangeProxy;

export default class Swapper {
    static async swapIn(
        swaps: Swap[][],
        assetInAddress: string,
        assetOutAddress: string,
        assetInAmount: BigNumber,
        assetOutAmountMin: BigNumber,
    ): Promise<any> {
        if (assetInAddress === ETH_KEY) {
            assetInAddress = ETH_ADDRESS;
        }
        if (assetOutAddress === ETH_KEY) {
            assetOutAddress = ETH_ADDRESS;
        }

        const exchangeProxyContractInterface = new Interface(ExchangeProxyABI);
        const exchangeTransaction =
        {
            to: exchangeProxyAddress,
            data: exchangeProxyContractInterface.encodeFunctionData(
                'multihopBatchSwapExactIn', 
                [
                    swaps,
                    assetInAddress,
                    assetOutAddress,
                    assetInAmount.toString(),
                    assetOutAmountMin.toString(),
                ]),
            value: assetInAddress === ETH_ADDRESS ? `0x${assetInAmount.toString(16)}` : '0',
        };

        if (assetInAddress === ETH_ADDRESS){
            return [exchangeTransaction];
        }

        const erc20ContractInterface = new Interface(ERC20ABI);
        const setApprovalTransaction = {
            to: assetInAddress,
            data: erc20ContractInterface.encodeFunctionData('approve', [exchangeProxyAddress, assetInAmount.toString()]),
            value: '0',
        };

        return [setApprovalTransaction, exchangeTransaction];
    }

    static async swapOut(
        swaps: Swap[][],
        assetInAddress: string,
        assetOutAddress: string,
        assetInAmountMax: BigNumber,
    ): Promise<any> {
        if (assetInAddress === ETH_KEY) {
            assetInAddress = ETH_ADDRESS;
        }
        if (assetOutAddress === ETH_KEY) {
            assetOutAddress = ETH_ADDRESS;
        }

        const exchangeProxyContractInterface = new Interface(ExchangeProxyABI);
        const exchangeTransaction =
        {
            to:exchangeProxyAddress,
            data: exchangeProxyContractInterface.encodeFunctionData(
                'multihopBatchSwapExactOut', 
                [
                    swaps,
                    assetInAddress,
                    assetOutAddress,
                    assetInAmountMax.toString(),
                ]),
            value: assetInAddress === ETH_ADDRESS ? `0x${assetInAmountMax.toString(16)}` : '0',
        };

        if (assetInAddress === ETH_ADDRESS){
            return [exchangeTransaction];
        }

        const erc20ContractInterface = new Interface(ERC20ABI);
        const setApprovalTransaction = {
            to: assetInAddress,
            data: erc20ContractInterface.encodeFunctionData('approve', [exchangeProxyAddress, assetInAmountMax.toString()]),
            value: '0',
        };
        const revokeApprovalTransaction = {
            to: assetInAddress,
            data: erc20ContractInterface.encodeFunctionData('approve', [exchangeProxyAddress, '0']),
            value: '0',
        };

        return [setApprovalTransaction, exchangeTransaction, revokeApprovalTransaction];
    }
}
