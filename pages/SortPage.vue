<template>
    <div class="container-wrap">
        <mu-tabs :value.sync="active" color="secondary" class="tab-box" indicator-color="#3e885b">
            <mu-tab v-for="(item,index) in classFather" :key="index" class="class-father" @click="changeTab(item)">{{item.name}}</mu-tab>
        </mu-tabs>
        <div v-for="(item,index) in classFather" :key="index" v-if="active === index" class="sub-tab-list">
            <mu-paper class="sub-tabs-box" :z-depth="5">
                <div class="sub-tabs" :class="jndex==idx?'selected':''" v-for="(jtem,jndex) in item.childs"
                     @click="cid=active+1;ccid=jtem.ccid;getClassContent();idx=jndex">
                    <mu-ripple class="mu-ripple-demo demo-1">{{jtem.name}}</mu-ripple>
                </div>
            </mu-paper>
        </div>
        <mu-list class="main-content">
            <p v-if="treeList.length==0" style="width: fit-content;margin: 80px;}">暂无更多数据</p>
            <mu-list-item v-else avatar :ripple="false" button v-for="(item,index) in treeList" :key="index" class="tree-item" @click="goDetail(item)">
                <mu-list-item-action>
                    <img :src="item.img" class="tree-img">
                </mu-list-item-action>
                <mu-list-item-content style="margin-left: 10px">
                    <mu-list-item-title style="font-weight: 500">{{item.title}}</mu-list-item-title>
                    <mu-list-item-sub-title>
                        <span style="color: rgba(0, 0, 0, .87)">{{item.userName||item.telNum}}-</span>{{item.brief}}
                    </mu-list-item-sub-title>
                </mu-list-item-content>
            </mu-list-item>
            <mu-flex justify-content="around" style="width: 65%;position: absolute;bottom: 10px;">
                <mu-button small fab color="rgb(216, 216, 216)" @click="beforePage" :disabled="btn1">
                    <mu-icon size="28" value="navigate_before"></mu-icon>
                </mu-button>
                <mu-button small fab color="rgb(216, 216, 216)" @click="nextPage" :disabled="btn2">
                    <mu-icon size="28" value="navigate_next"></mu-icon>
                </mu-button>
            </mu-flex>
        </mu-list>
    </div>
</template>

<script>
    import axios from 'axios';

    function setState(store) {
        store.dispatch('common/validLogin', store.state.common.token);
    }

    export default {
        name: "SortPage",
        data() {
            return {
                active: 0,
                classFather: [],
                treeList: [],
                idx: 0,
                page:0,
                pageSize: 0,
                cid:1,
                ccid:9,
                btn1:true,
                btn2:false,
            };
        },
        methods: {
            getWindowHeight(){
                this.pageSize=Math.floor((document.documentElement.clientHeight-200-40)/77)
            },
            loadClass() {
                axios.get('/api/classify/getAll').then(resp => {
                    console.log(resp.data);
                    this.classFather = resp.data.data
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            getClassContent() {
                axios.post('/api/skill/get-by-classify', {
                        classifyId: this.cid,
                        classifyChildId: this.ccid,
                        page: this.page,
                        size: this.pageSize
                    }, {
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
                    this.treeList = resp.data.data
                    if(this.treeList.length<this.pageSize){
                        this.btn2=true
                    }else{
                        this.btn2=false
                    }
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            changeTab(item){
                this.idx=0;
                this.cid=item.classifyId;
                this.ccid=item.childs[0].ccid
                this.getClassContent();
            },
            goDetail(item) {
                if(item.creater==this.$store.state.common.uid){
                    this.$router.push({path:'/edit-tree',query:{sid:item.sid}})
                }else{
                    this.$router.push({path: '/details', query: {sid: item.sid}})
                }
            },
            beforePage(){
                if(this.page){
                    this.page-=1;
                    if(this.page==0){
                        this.btn1=true
                    }
                    this.getClassContent();
                }else return;
            },
            nextPage(){
                this.page+=1;
                this.btn1=false
                this.getClassContent();
            }
        },
        mounted() {
            this.loadClass();
            this.getWindowHeight();
            this.getClassContent()
        },
        async asyncData({store, route}) {
            setState(store);
        },
        activated() {
            setState(this.$store);
        }
    }
</script>

<style scoped>
    .container-wrap {
        height: 100%;
    }

    .tab-box {
        overflow-x: auto;
        position: fixed;
        height: 80px;
    }

    .sub-tab-list {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 80px;
        overflow-y: auto;
    }

    .sub-tabs-box {
        width: 28%;
        height: 100%;
        background: rgb(216, 216, 216);
    }

    .sub-tabs {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #fcfffc;
    }

    .class-father {
        width: 120px;
    }

    .main-content {
        position: fixed;
        top: 80px;
        left: 32%;
        bottom: 70px;
        padding: 0;
        overflow-y: auto;
    }

    .tree-item {
        height: fit-content;
        width: 65%;
        margin: 5px 0 10px;
        border-bottom: 1px solid #a18d85;
        padding: 10px 0;
        background: #fcfffc;
        border-radius: 10px;
    }

    .tree-img {
        width: 60px;
        height: 60px;
        border-radius: 5px;
    }

    .selected {
        background: #bac7be;
    }

    .mu-ripple-demo {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 16px;
        border-radius: 4px;
    }

</style>
