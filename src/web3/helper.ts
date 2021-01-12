import { Interface } from '@ethersproject/abi';
import BigNumber from 'bignumber.js';

import config from '@/config';

import WethAbi from '../abi/Weth.json';

export default class Helper {
    static async wrap(
        amount: BigNumber,
    ): Promise<any> {
        const wethInterface = new Interface(WethAbi);
        const wrapTransaction =
        {
            to: config.addresses.weth,
            data: wethInterface.encodeFunctionData('deposit', []),
            value: `0x${amount.toString(16)}`,
        };
        return [wrapTransaction];
    }

    static async unwrap(
        amount: BigNumber,
    ): Promise<any> {
        const wethInterface = new Interface(WethAbi);
        const unwrapTransaction =
        {
            to: config.addresses.weth,
            data: wethInterface.encodeFunctionData('withdraw', [amount.toString()]),
            value: '0',
        };
        return [unwrapTransaction];
    }
}
