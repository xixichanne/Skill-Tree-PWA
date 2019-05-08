/**
 * @file entry
 * @author channe(277609604@qq.com)
 */

import Vue from 'vue';
import Meta from 'vue-meta';

import {createRouter} from '@/.lavas/router';
import {createStore} from '@/.lavas/store';
import AppComponent from './App.vue';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import Loading from 'muse-ui-loading';
import Toast from 'muse-ui-toast';
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
Vue.use(Message);

import VueScroller from 'vue-scroller'

Vue.use(VueScroller)

Vue.use(Toast);
Vue.use(Loading);

Vue.use(MuseUI);
Vue.use(Meta);
import theme from 'muse-ui/lib/theme';
theme.add('teal', {
    primary: '#2f4b26',
    secondary: '#3e885b',
    success: '#85bda6',
    warning: '#bedcfe',
    info:'#c0d7bb'
}, 'light');

theme.use('teal');



Vue.config.productionTip = false;

export function createApp() {
    let router = createRouter();
    let store = createStore();
    let App = Vue.extend({
        router,
        store,
        ...AppComponent
    });
    return {App, router, store};
}

if (module.hot) {
    module.hot.accept();
}
