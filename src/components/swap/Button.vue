<template>
    <Button
        :disabled="disabled"
        :text="text"
        :primary="true"
        :loading="loading"
        @click="handleClick"
    />
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { PropType, defineComponent, toRefs, computed } from 'vue';
import { useStore } from 'vuex';

import config from '@/config';
import { RootState } from '@/store';
import { ETH_KEY, scale } from '@/utils/helpers';
import { SwapValidation } from '@/utils/validation';

import Button from '@/components/Button.vue';

enum Type {
    Connect,
    Swap,
}

export default defineComponent({
    components: {
        Button,
    },
    props: {
        addressIn: {
            type: String,
            required: true,
        },
        amountIn: {
            type: String,
            required: true,
        },
        addressOut: {
            type: String,
            required: true,
        },
        transactionPending: {
            type: Boolean,
            required: true,
        },
        validation: {
            type: Number as PropType<SwapValidation>,
            required: true,
        },
    },
    emits: ['swap'],
    setup(props, { emit }) {
        const store = useStore<RootState>();

        const { addressIn, addressOut, amountIn, transactionPending, validation } = toRefs(props);

        const account = computed(() => {
            const { address } = store.state.account;
            return address || '';
        });

        const type = computed(() => {
            if (!account.value) {
                return Type.Connect;
            } else {
                return Type.Swap;
            }
        });

        const disabled = computed(() => {
            if (type.value === Type.Connect) {
                const { address } = store.state.account;
                return !address;
            } else {
                return validation.value !== SwapValidation.NONE ||
                    transactionPending.value;
            }
        });

        const text = computed(() => {
            if (loading.value) {
                return actionText.value;
            }
            if (disabled.value) {
                return errorText.value;
            } else {
                return actionText.value;
            }
        });

        const loading = computed(() => {
            if (type.value === Type.Connect) {
                const { address } = store.state.account;
                return !address;
            } else {
                return transactionPending.value;
            }
        });

        const errorText = computed(() => {
            if (validation.value === SwapValidation.EMPTY_INPUT) {
                return 'Enter amount';
            }
            if (validation.value === SwapValidation.INVALID_INPUT) {
                return 'Invalid amount';
            }
            if (validation.value === SwapValidation.WRONG_NETWORK) {
                return 'Wrong network';
            }
            if (validation.value === SwapValidation.INSUFFICIENT_BALANCE) {
                return 'Not enough funds';
            }
            if (validation.value === SwapValidation.NO_SWAPS) {
                return 'Not enough liquidity';
            }
            return '';
        });

        const actionText = computed(() => {
            if (type.value === Type.Connect) {
                return 'Connect Wallet';
            }
            if (type.value === Type.Swap) {
                return 'Swap';
            }
            return '';
        });

        function handleClick(): void {
            emit('swap');
        }

        return {
            disabled,
            text,
            loading,
            handleClick,
        };
    },
});
</script>
