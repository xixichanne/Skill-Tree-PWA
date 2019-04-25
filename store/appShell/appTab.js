
export const SET_APP_TAB = 'SET_APP_TAB';

export const state = () => {
    return {
        show: true,
    };
};

export const mutations = {
    [SET_APP_TAB](state, tabVisibility) {
        state.show = tabVisibility;
    }
};

export const actions = {
    setAppTab({commit}, appTab) {
        commit(SET_APP_TAB, appTab);
    }
};
