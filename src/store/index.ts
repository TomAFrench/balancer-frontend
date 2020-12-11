import { createStore } from 'vuex';

import account, { AccountState } from './modules/account';
import assets, { AssetState } from './modules/assets';
import gnosis, { GnosisState } from './modules/gnosis';
import ui, { UIState } from './modules/ui';

export interface RootState {
	account: AccountState;
    assets: AssetState;
    gnosis: GnosisState;
	ui: UIState;
}

const store = createStore({
    modules: {
        account,
        assets,
        gnosis,
        ui,
    },
});

export default store;
