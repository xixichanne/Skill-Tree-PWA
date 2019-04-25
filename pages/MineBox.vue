<template>
    <div style="height: 100%">
        <mu-tabs :value.sync="active" inverse color="secondary" text-color="rgba(0, 0, 0, .54)"
                 indicator-color="secondary" center>
            <mu-tab @click="loadMyTrees">我的技能树</mu-tab>
            <mu-tab @click="loadMyLikes">我的点赞</mu-tab>
        </mu-tabs>
        <mu-flex class="content-box" v-if="active === 0" wrap="wrap">
            <div v-for="(item,index) in myTreesList" class="list-item" @click="goEdit(item.sid)">
                <img class="img-box" :src="item.img"/>
                <p style="margin:0 auto">{{item.title}}</p>
            </div>
            <div class="list-item">
                <mu-paper :z-depth="3" class="icon-box" @click="addNewTree">
                    <mu-icon value="add" size="60" color="grey" style="padding: 10px 0"></mu-icon>
                </mu-paper>
            </div>
        </mu-flex>
        <mu-flex class="content-box" v-if="active === 1" wrap="wrap">
            <div v-for="(item,index) in myLikesList" class="list-item" @click="goDetail(item.sid)">
                <img class="img-box" :src="item.img"/>
                <p style="margin:0 auto">{{item.title}}</p>
            </div>
        </mu-flex>
        <div style="float: none"></div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import axios from 'axios';

    function setState(store) {
        store.dispatch('common/validLogin', store.state.common.token);
    }

    export default {
        name: 'MineBox',
        metaInfo: {},
        data() {
            return {
                active: 0,
                myTreesList: [],
                myLikesList: []
            };
        },
        methods: {
            loadMyTrees() {
                axios.post('/api/skill/get-by-uid', {uid: this.$store.state.common.uid}, {
                    transformRequest: [
                        function (data) {
                            let params = '';
                            for (let index in data) {
                                params += index + '=' + data[index] + '&';
                            }
                            return params;
                        }
                    ]
                }).then(resp => {
                    console.log(resp.data);
                    this.myTreesList = resp.data.data
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            loadMyLikes() {
                axios.post('/api/skill/get-skill-by-likes-with-uid', {uid: this.$store.state.common.uid}, {  //方式2通过transformRequest方法发送数据，本质还是将数据拼接成字符串
                    transformRequest: [
                        function (data) {
                            let params = '';
                            for (let index in data) {
                                params += index + '=' + data[index] + '&';
                            }
                            return params;
                        }
                    ]
                })
                    .then(resp => {
                        console.log(resp.data);
                        this.myLikesList = resp.data.data
                    }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            addNewTree(){
                this.$router.push({path:'/add-tree'})
            },
            goEdit(sid){
                this.$router.push({path:'/edit-tree',query:{sid:sid}})
            },
            goDetail(sid){
                this.$router.push({path:'/details',query:{sid:sid}})
            }

        },
        mounted() {
            this.loadMyTrees()
        },
        async asyncData({store, route}) {
            setState(store);
        },
        activated() {
            setState(this.$store);
        }
    };
</script>

<style scoped>
    .content-box {
        margin: 20px 10px;
    }

    .list-item {
        width: 25%;
        margin-bottom: 10px;
    }

    .img-box {
        width: 70px;
        height: 70px;
        border-radius: 10px;
    }

    .icon-box {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        background: #fff;
        padding: 10px 0;
        margin: auto;
    }
</style>
