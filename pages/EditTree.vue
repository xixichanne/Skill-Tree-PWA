<template>
    <div style="height: fit-content">
        <mu-appbar class="app_bar" title="我的技能树" color="secondary">
            <mu-button icon slot="left" @click="$router.go(-1);">
                <mu-icon value="arrow_back"></mu-icon>
            </mu-button>
            <mu-button icon slot="right">
                <mu-icon value="edit"></mu-icon>
            </mu-button>
        </mu-appbar>
        <mu-container class="main-wrap">
            <mu-row class="info-box" justify-content="between" align-items="center" >
                <mu-col span="3" align-self="center">
                    <mu-paper class="upload-photo" :z-depth="3">
                        <img :src="treeInfo.img" class="cover-img"/>
                    </mu-paper>
                </mu-col>
                <mu-col span="7">
                    <mu-row>
                        <label class="label-style">标题：</label>
                        <span style="color: #767676;font-weight: 500">{{treeInfo.title}}</span>
                    </mu-row>
                    <mu-row>
                        <label class="label-style">类别：</label>
                        <span style="color: #767676;font-weight: 500">{{classify.fatherName}}——{{classify.childName}}</span>
                    </mu-row>
                    <mu-row>
                        <label class="label-style">作者：</label>
                        <mu-avatar size="25">
                            <img :src="userInfo.headPic">
                        </mu-avatar>
                        <span style="color: #767676;font-weight: 500;margin-left: 5px">{{userInfo.userName}}</span>
                    </mu-row>
                </mu-col>
                <mu-col span="1" style="line-height: 15px;">
                    <mu-icon :value="likeState?'favorite':'favorite_border'" color="red" size="30" style="line-height: 30px" @click="like"></mu-icon>
                    <span style="color: #767676;font-weight: 500">{{treeInfo.likes}}</span>
                </mu-col>
            </mu-row>
            <mu-row>
                <label class="label-style" style="margin: 12px">技能树简介:</label>
            </mu-row>
            <mu-row>
                <div class="brief-box">{{treeInfo.brief}}</div>
            </mu-row>
            <mu-alert color="info" @delete="alert1 = false" delete v-if="alert1" transition="mu-scale-transition" class="alert">
                <mu-icon left value="info"></mu-icon>长按节点可点亮该技能哦～
            </mu-alert>
            <div class="tree-background">
                <mu-flex wrap="wrap" class="nodes-box">
                    <div class="list-item" v-for="(item,index) in nodeList">
                        <mu-menu v-if="item.title" placement="right-start">
                            <mu-paper :class="item.light?'icon-box-light':'icon-box'" circle
                                      @touchstart="gotouchstart(item.nid,item.light,index)" @touchmove="gotouchmove" @touchend="gotouchend">
                                <span  class="node-name">{{item.title}}</span>
                            </mu-paper>
                            <mu-list slot="content" class="popup-class" dense>
                                <mu-sub-header>{{item.title}}</mu-sub-header>
                                <mu-list-item button v-for="(jtem,jndex) in item.childs" :key="jndex">
                                    <mu-list-item-content>
                                        <mu-list-item-action style="display: inline">
                                            <mu-icon value="menu"></mu-icon>
                                        </mu-list-item-action>
                                        <mu-list-item-title style="display: inline;vertical-align: super">{{jtem.name}}</mu-list-item-title>
                                    </mu-list-item-content>
                                </mu-list-item>
                            </mu-list>
                        </mu-menu>

                        <mu-paper v-else :z-depth="0" class="icon-box-none" >
                        </mu-paper>
                    </div>
                </mu-flex>
            </div>
        </mu-container>
        <mu-snackbar color="success" :open.sync="snackbarOpen" style="height: 80px;">
            <mu-icon left value="check_circle"></mu-icon>
            {{snackbarText}}
            <mu-button flat slot="action" color="#fff" @click="snackbarOpen = false">Close</mu-button>
        </mu-snackbar>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "EditTree",
        data() {
            return {
                treeInfo:{},
                userInfo:{},
                classify:{},
                nodeList: [
                    {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    }, {
                        nid: ''
                    },
                ],
                likeState:false,
                nodeDetails:[],
                open:false,
                timeOutEvent:0,
                snackbarOpen:false,
                snackbarTimer:3000,
                snackbarText:'成功点亮该节点！',
                alert1:true
            }
        },
        methods: {
            loadDetails() {
                axios.post('/api/skill/skill-detail', {sid: this.$route.query.sid}, {
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
                    this.treeInfo=resp.data.data.skill;
                    this.userInfo=resp.data.data.user;
                    this.classify=resp.data.data.classify;
                    this.loadNodes();
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            loadNodes(){
                let nodes=this.treeInfo.nodes.split(' ')
                nodes.pop();
                console.log(nodes)
                let promiseArr = [];
                nodes.forEach(item=>{
                    promiseArr.push(new Promise((resolve,reject) => {
                        axios.post('/api/skill/get-node-by-nid', {nodeId: item}, {
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
                            this.nodeDetails.push(resp.data.data)
                            console.log(this.nodeDetails)
                            resolve()
                        }).catch(err => {
                            console.log('请求失败：' + err.status + ',' + err.statusText);
                        });

                    }))

                });
                Promise.all(promiseArr).then(val=>{
                    console.log(this.nodeDetails)
                    console.log(typeof this.nodeDetails)
                    this.nodeDetails.forEach(item=>{
                        item.childs=JSON.parse(item.childs)
                        this.nodeList.splice(item.positionCode,1,item)
                    });
                    console.log(this.nodeList)
                })
            },

            queryNodes(){
                let nodes=this.treeInfo.nodes.split(' ')
                nodes.pop();
                console.log(nodes)
                nodes.forEach(item=>{
                    axios.post('/api/skill/get-node-by-nid', {nodeId: item}, {
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
                        this.nodeDetails.push(resp.data.data)
                        console.log(this.nodeDetails)
                    }).catch(err => {
                        console.log('请求失败：' + err.status + ',' + err.statusText);
                    });
                });
            },
            like(){
                this.likeState=!this.likeState;
                this.treeInfo.likes+=this.likeState?1:-1;
                axios.get('/api/skill/likes?sid='+this.$route.query.sid,
                    {
                        headers:{
                            'accesstoken':this.$store.state.common.token
                        }
                    },
                    {  //方式2通过transformRequest方法发送数据，本质还是将数据拼接成字符串
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
                        let myLikesList = resp.data.data;
                        myLikesList.forEach(item=>{
                            if(item.sid==this.$route.query.sid){
                                this.likeState=true
                            }
                        })
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
                        let myLikesList = resp.data.data;
                        myLikesList.forEach(item=>{
                            if(item.sid==this.$route.query.sid){
                                this.likeState=true
                            }
                        })
                    }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            // showDetail(){
            //     this.open=true
            // },
            gotouchstart(nid,light,index){
                let that = this;
                clearTimeout(this.timeOutEvent);//清除定时器
                this.timeOutEvent = 0;
                this.timeOutEvent = setTimeout(function(){
                    //执行长按要执行的内容，
                    that.lightNode(nid,light,index);
                },600);//这里设置定时
            },
            //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
            gotouchend(){
                clearTimeout(this.timeOutEvent);
                if(this.timeOutEvent!=0){
                    //这里写要执行的内容（尤如onclick事件）
                    this.open=true
                }
            },
            //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
            gotouchmove(){
                clearTimeout(this.timeOutEvent);//清除定时器
                this.timeOutEvent = 0;
            },
            lightNode(nid,light,index){
                axios.post('/api/skill/update-light', {light:light?0:1,nodeId:nid}, {
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
                    this.openColorSnackbar(light,index)
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            openColorSnackbar (light,index) {
                let that = this;
                this.snackbarText=light?'成功取消点亮该节点！':'成功点亮该节点！';
                this.nodeList[index].light=!this.nodeList[index].light;
                if (this.snackbarTimer) clearTimeout(this.snackbarTimer);
                this.snackbarOpen = true;
                this.snackbarTimer = setTimeout(() => {
                    that.snackbarOpen = false;
                }, 3000);
            }
        },
        mounted() {
            this.loadDetails();
            this.loadMyLikes();
        }
    }
</script>

<style scoped>
    .main-wrap{
        height: fit-content;
        margin: 30px auto 0;
    }
    .label-style{
        font-size: 16px;
        color: #a18d85;
        font-weight: 700;
    }
    .info-box {
        margin: 0 10px;
    }

    .upload-photo {
        position: relative;
        width: 90px;
        height: 90px;
    }

    .cover-img {
        width: 90px;
        height: 90px;
        position: absolute;
        left: 0;
    }

    .brief-box {
        width: 100%;
        height: 70px;
        margin: 0 10px;
        border: 1px solid #a18d85;
        border-radius: 5px;
        /*background: #fff;*/
        text-align: left;
        text-indent: 2em;
    }

    .list-item {
        width: 20%;
        margin-bottom: 10px;
    }

    .icon-box-light {
        width: 60px;
        height: 60px;
        /*border-radius: 10px;*/
        background-image: url(/static/img/nodeBack.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        padding: 10px 0;
        margin: auto;
        box-shadow: 0 0 40px #73CA65;
    }
    .icon-box{
        width: 60px;
        height: 60px;
        background: #e0e0e0;
        padding: 10px 0;
        margin: auto;
        box-shadow: 0 0 20px rgba(0,0,0,.3);
    }
    .icon-box-none{
        width: 60px;
        height: 60px;
        opacity: 0;
    }
    .tree-background{
        /*margin-top: 10px;*/
        padding: 20px 0 130px 0;
        background-image: url(/static/img/背景.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;
    }
    .nodes-box {
        width: auto;
        /*height: 450px;*/
        margin: 20px 10px;
    }
    .popup-class{
        background: #fafafa;
        width: 200px;
    }
    .mu-popover {
        background: rgba(0, 0, 0, 0.69);
        border-radius: 5px;
    }
    .text-field {
        padding: 10px 0;
        margin-bottom: 10px;
    }

    .node-detail {
        padding: 0 5px;
        background: #e0e0e0;
        border-radius: 10px;
        margin-bottom: 5px;
    }

    .demo-chip {
        position: absolute;
        right: 0;
        z-index: 99;
    }
    .node-name{
        user-select:none;
    }
    .alert{
        margin: 10px;
        width: auto;
        height: 10px;
    }
</style>
