<template>
    <div style="height: fit-content" ref="wrapper">
        <mu-appbar class="app_bar" title="为您推荐" color="secondary"></mu-appbar>
        <div :class="loading?'overlay':''" v-loading="loading">
            <mu-load-more class="content-box" @load="load" :loading="loading" @refresh="refresh" :refreshing="refreshing" >
                <mu-card v-for="(item, index) in recommandList" :key="index"
                         style="width: 45%; max-width: 375px;margin:10px 0 0 3%!important;"
                         @click="goDetail(item.sid)">
                    <mu-card-media class="img-card-media" :title="item.title"
                                   :sub-title="item.classifyFatherName+'-'+item.classifyChildName">
                        <img :src="item.img">
                    </mu-card-media>
                    <mu-card-text>
                        {{item.brief}}
                    </mu-card-text>
                    <mu-row style="font-size: 14px">
                        <mu-col span="2">
                            <mu-avatar size="25">
                                <img :src="item.headPic">
                            </mu-avatar>
                        </mu-col>
                        <mu-col span="3"><span>{{item.userName?item.userName:item.telNum}}</span></mu-col>
                        <mu-col span="2" offset="3">
                            <mu-icon value="favorite_border" color="red" size="20"></mu-icon>
                        </mu-col>
                        <mu-col span="2"><span>{{item.likes}}</span></mu-col>
                    </mu-row>
                </mu-card>
                <mu-button class="load-button" flat color="secondary">加载更多
                </mu-button>
            </mu-load-more>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import axios from 'axios';


    function setState(store) {
        store.dispatch('appShell/appTab/setAppTab', {
            show: true,
        });
        store.dispatch('common/validLogin', store.state.common.token);
    }

    export default {
        name: 'Index',
        metaInfo: {
            title: 'Home',
            titleTemplate: '%s - Lavas',
            meta: [
                {name: 'keywords', content: 'lavas PWA'},
                {name: 'description', content: '基于 Vue 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题'}
            ]
        },
        data() {
            return {
                count: 111,
                loading: false,
                refreshing: false,
                recommandList: [],
                page: 0,
                size: 10,
                scroll:''
            }
        },
        methods: {
            loadIndex(page, size) {
                this.loading = true;
                axios.post('/api/skill/index', {page: page, size: size}, {
                        transformRequest: [
                            function (data) {
                                let params = '';
                                for (let index in data) {
                                    params += index + '=' + data[index] + '&';
                                }
                                return params;
                            }
                        ]
                    }
                ).then(resp => {
                    console.log(resp.data);
                    this.recommandList.push(...resp.data.data);
                    this.recommandList.concat(resp.data.data);
                    this.loading = false;
                    console.log(document.documentElement.scrollTop,this.scroll)
                    this.changeScrollTop();
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            goDetail(sid) {
                this.$router.push({path: '/details', query: {sid: sid}})
            },
            changeScrollTop(){
                this.$nextTick(() => {
                    document.documentElement.scrollTop = this.scroll;
                    console.log(document.documentElement.scrollTop)
                })
            },
            load() {
                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                let wrapperScrollTop = this.$refs.wrapper.scrollTop;
                console.log('scrollTop', scrollTop);
                this.scroll = scrollTop;
                this.page += 1;
                this.loadIndex(this.page, this.size)
            },
            refresh () {
                this.refreshing = true;
                this.recommandList=[];
                this.loadIndex(0, 10);
                this.refreshing = false;

            },
        },
        mounted() {
            this.loadIndex(0, 10);
        },
        async asyncData({store, route}) {
            setState(store);
        },
        activated() {
            this.$refs.wrapper.scrollTop = this.scroll
            setState(this.$store);
        },
    };
</script>

<style lang="stylus" scoped>
    .overlay
        height 100%
        position fixed
        z-index 100
        width 100%

    .app_bar
        width 100%

    .content-box
        display flex
        flex-flow row wrap
        justify-content start
        align-items baseline
        width 100%
        height fit-content
        -webkit-overflow-scrolling touch

    mu-card:last-child
        flex-basis 100%

    .mu-card
        width: 45%;
        max-width: 375px;
        height: fit-content;
        margin: 10px auto;

    .mu-card-media-title
        padding 5px

    .mu-card-title
        text-align left
        font-size 16px
        font-weight 500
        line-height 20px

    .mu-card-sub-title
        text-align left
        font-size 10px
        line-height 10px

    .mu-card-text
        padding 5px
        font-size 12px
        text-align left
        font-weight bolder

    .load-button
        margin-bottom 10px
</style>
