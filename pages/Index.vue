<template>
    <div style="height: -webkit-fill-available;" ref="wrapper">
        <mu-appbar class="app_bar" title="为您推荐" color="secondary"></mu-appbar>
        <div>
            <scroller
                :on-refresh="refresh"
                :on-infinite="load"
                ref="my_scroller"
            >
                <div style="height: 56px;"></div>
                <div class="content-box">
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

                </div>
            </scroller>
        </div>
        <!--<mu-button class="load-button" flat color="secondary" @click="load">加载更多-->
        <!--</mu-button>-->
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
                recommandList: [],
                page: -1,
                size: 10,
                scroll: ''
            }
        },
        methods: {
            // loadIndex(page, size) {
            //     axios.post('/api/skill/index', {page: page, size: size}, {
            //             transformRequest: [
            //                 function (data) {
            //                     let params = '';
            //                     for (let index in data) {
            //                         params += index + '=' + data[index] + '&';
            //                     }
            //                     return params;
            //                 }
            //             ]
            //         }
            //     ).then(resp => {
            //         console.log(resp.data);
            //         this.recommandList.push(...resp.data.data);
            //         this.recommandList.concat(resp.data.data);
            //         this.$refs.my_scroller.finishPullToRefresh();
            //         this.$refs.my_scroller.finishInfinite(0);
            //         console.log(this.recommandList)
            //         // console.log(document.documentElement.scrollTop,this.scroll)
            //         // this.changeScrollTop();
            //     }).catch(err => {
            //         console.log('请求失败：' + err.status + ',' + err.statusText);
            //         this.$refs.my_scroller.finishPullToRefresh();
            //         this.$refs.my_scroller.finishInfinite(0);
            //     });
            // },
            goDetail(sid) {
                this.$router.push({path: '/details', query: {sid: sid}})
            },
            load(done) {
                this.page += 1;
                axios.post('/api/skill/index', {page: this.page, size: this.size}, {
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
                    if (resp.data.data.length == 0) {
                        done(true)
                         this.$refs.my_scroller.finishInfinite(2);
                        this.infinite = undefined
                    } else {
                        this.recommandList.push(...resp.data.data);
                        // this.recommandList.concat(resp.data.data);
                        done(true)
                    }
                    console.log(this.recommandList)
                    // console.log(document.documentElement.scrollTop,this.scroll)
                    // this.changeScrollTop();
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                    done(true)
                });
            },
            refresh(done) {
                this.recommandList = [];
                this.page=0;
                axios.post('/api/skill/index', {page: this.page, size: this.size}, {
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
                    // this.recommandList.concat(resp.data.data);
                    console.log(this.recommandList)
                    done()
                    this.$refs.my_scroller.finishInfinite(2);
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                    done()
                });
            },
        },
        async asyncData({store, route}) {
            setState(store);
        },
        activated() {
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
        z-index 1000
        position relative

    .content-box
        display flex
        flex-flow row wrap
        justify-content start
        align-items baseline
        width 100%
        height fit-content
        -webkit-overflow-scrolling touch
        z-index 10

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
