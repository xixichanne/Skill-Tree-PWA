/**
 * @file common module
 * @author lavas
 */
import axios from 'axios';
const SET_LOGIN = 'setLogin';
const SET_TOKEN='setToken'
const SET_UID='setUid'


export const state = () => {
    return {
        login: false,
        token:null,
        uid:''
    };
};

export const mutations = {
    [SET_LOGIN](state, login) {
        state.login = login;
    },
    [SET_TOKEN](state, token) {
        state.token = token;
    },
    [SET_UID](state, uid) {
        state.uid = uid;
    },
};

export const actions = {
    setLogin({commit}, login) {
        commit(SET_LOGIN, login);
    },
    setToken({commit}, token) {
        commit(SET_TOKEN, token);
    },
    setUid({commit}, uid) {
        commit(SET_UID, uid);
    },
    async validLogin({commit},accesstoken) {
        console.log(accesstoken)
        let checkLogin=axios({
            method:'get',
            url:'/api/user/check-self',
            headers:{
                'accesstoken':accesstoken
            }
        })
        // 可以给服务端发请求，验证用户的登录状态，此处模拟未登录
        let token=null;
        let login=false;
        let check = await checkLogin;
        console.log(check)
        if(check.data.code==200){
            login=true;
            token=accesstoken;
        };

        // 并设置 store 中的登录状态
        commit(SET_LOGIN, login);
        commit(SET_TOKEN,token)
    }
};
