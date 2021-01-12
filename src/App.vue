<template>
    <div id="app">
        <Header />
        <router-view class="view" />

        <ModalSettings :open="isSettingsModalOpen" />
        <NotificationList
            :items="notifications"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import { RootState } from '@/store';

import Header from '@/components/Header.vue';
import ModalSettings from '@/components/ModalSettings.vue';
import NotificationList from '@/components/NotificationList.vue';

export default defineComponent({
    components: {
        Header,
        ModalSettings,
        NotificationList,
    },
    setup() {
        const store = useStore<RootState>();

        const isSettingsModalOpen = computed(() => store.state.ui.modal.settings.isOpen);

        const notifications = computed(() => store.state.ui.notifications);

        onMounted(() => {
            store.dispatch('assets/init');
            store.dispatch('gnosis/init');
        });

        return {
            isSettingsModalOpen,
            notifications,
        };
    },
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

:root {
    /* Gnosis Theme */
    --gnosis-primary: #008c73;
    --gnosis-primary-light: #a1d2ca;
    --gnosis-primary-hover: #005546;
    --gnosis-primary-disabled: #008c7380;
    --gnosis-secondary: #001428;
    --gnosis-secondary-light: #b2b5b2;
    --gnosis-secondary-hover: #5d6d74;
    --gnosis-secondary-disabled: #00142880;
    --gnosis-red: #f02525;

    /* Balancer */
    --background-primary: #fff;
    --background-secondary: #fff;
    --background-header: #fff;
    --background-form: #f7f5f5;
    --background-control: #fff;
    --background-hover: #fcfcfc;
    --border-form: #f7f5f5;
    --border-input: #f7f5f5;
    --accent: var(--gnosis-primary);
    --accent-dark: var(--gnosis-primary-hover);
    --text-primary: #000;
    --text-secondary: #5d6d74;
    --text-control: #000;
    --text-inverted: #000;
    --success: #21b66f;
    --info: #7685d5;
    --warning: #ffc780;
    --error: var(--gnosis-red);
    --font-size-tiny: 11px;
    --font-size-small: 14px;
    --font-size-medium: 16px;
    --font-size-large: 18px;
    --font-size-header: 24px;
    --border-radius-large: 25px;
    --border-radius-medium: 10px;
    --border-radius-small: 5px;
    --block-height: 50px;
}

body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: var(--font-size-medium);
    margin: 0;
    background: var(--background-primary);
    color: var(--text-primary);
}

input {
    appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input:invalid {
    box-shadow: none;
}

.view {
    min-height: calc(100vh - 96px);
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

@media only screen and (max-width: 768px) {
    .brand {
        margin-left: 16px;
    }

    .title {
        display: none;
    }

    .view {
        min-height: initial;
    }
}
</style>
