import SafeAppsSDK, { SafeInfo, SendTransactionsResponse, Transaction } from '@gnosis.pm/safe-apps-sdk';

import { RootState } from '@/store';
import { ActionContext } from 'vuex';

export interface GnosisState {
  safeInfo: SafeInfo;
}

const mutations = {
    setSafeInfo: (_state: GnosisState, safeInfo: SafeInfo): void => {
        _state.safeInfo = safeInfo;
    },

};

const appsSdk = new SafeAppsSDK();

const actions = {
    init: async ({ commit, dispatch }: ActionContext<GnosisState, RootState>): Promise<void> => {
        const safe = await appsSdk.getSafeInfo();
        commit('setSafeInfo', safe);
        await dispatch('account/connect', safe, { root:true });
    },
    sendTransactions: async (_context: ActionContext<GnosisState, RootState>, txs: Transaction[]): Promise<SendTransactionsResponse> => {
        return appsSdk.txs.send({txs});
    },
};

function state(): GnosisState {
    return {
        safeInfo: {} as SafeInfo,
    };
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
