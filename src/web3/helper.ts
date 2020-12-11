import { Contract } from '@ethersproject/contracts';
import { ErrorCode } from '@ethersproject/logger';
import { Web3Provider } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';

import { logRevertedTx } from '@/utils/helpers';
import config from '@/config';

import WethAbi from '../abi/Weth.json';

export default class Helper {
    static async wrap(
        provider: Web3Provider,
        amount: BigNumber,
    ): Promise<any> {
        const wethContract = new Contract(config.addresses.weth, WethAbi, provider.getSigner());
        const overrides = {
            value: `0x${amount.toString(16)}`,
        };
        try {
            return await wethContract.deposit(overrides);
        } catch(e) {
            if (e.code === ErrorCode.UNPREDICTABLE_GAS_LIMIT) {
                const sender = await provider.getSigner().getAddress();
                logRevertedTx(sender, wethContract, 'deposit', [], overrides);
            }
            return e;
        }
    }

    static async unwrap(
        provider: Web3Provider,
        amount: BigNumber,
    ): Promise<any> {
        const wethContract = new Contract(config.addresses.weth, WethAbi, provider.getSigner());
        try {
            return await wethContract.withdraw(amount.toString(), {});
        } catch(e) {
            if (e.code === ErrorCode.UNPREDICTABLE_GAS_LIMIT) {
                const sender = await provider.getSigner().getAddress();
                logRevertedTx(sender, wethContract, 'withdraw', [amount.toString()], {});
            }
            return e;
        }
    }
}
