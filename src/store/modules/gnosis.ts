import initSdk, { SafeInfo, SdkInstance, Transaction } from '@gnosis.pm/safe-apps-sdk';
import { RootState } from '@/store';
import { ActionContext } from 'vuex';

export interface GnosisState {
  safeInfo: SafeInfo;
  appsSdk: SdkInstance;
}

const mutations = {
    setSafeInfo: (_state: GnosisState, safeInfo: SafeInfo): void => {
        _state.safeInfo = safeInfo;
    },
    setAppsSdk: (_state: GnosisState, appsSdk: SdkInstance): void => {
        _state.appsSdk = appsSdk;
    },
};

const actions = {
    init: async ({ state, commit, dispatch }: ActionContext<GnosisState, RootState>): Promise<void> => {
        await commit('setAppsSdk', initSdk());
        state.appsSdk.addListeners({
            onSafeInfo: (safeInfo: SafeInfo) => dispatch('loadSafeInfo', safeInfo),
        });
    },
    loadSafeInfo: async ({ commit, dispatch }: ActionContext<GnosisState, RootState>, safeInfo: SafeInfo): Promise<void> => {
        commit('setSafeInfo', safeInfo);
        await dispatch('account/connect', safeInfo, { root:true });
    },
    sendTransactions: async ({ state }: ActionContext<GnosisState, RootState>, transactions: Transaction[]): Promise<void> => {
        state.appsSdk.sendTransactions(transactions);
    },
};

function state(): GnosisState {
    return {
        safeInfo: {} as SafeInfo,
        appsSdk: {} as SdkInstance,
    };
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
