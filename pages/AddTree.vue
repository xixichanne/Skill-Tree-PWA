<template>
    <div style="height: 100%;overflow: auto">
        <mu-appbar class="app_bar" :title="treeForm.sid?'修改技能树':'新建技能树'" color="secondary"></mu-appbar>
        <mu-container style="height: fit-content">
            <mu-row class="info-box">
                <mu-col span="4" align-self="center">
                    <mu-paper class="upload-photo" :z-depth="3">
                        <img :src="treeForm.img" class="cover-img"/>
                        <input class="cover-file" name="file" type="file" accept="image/png,image/gif,image/jpeg"
                               @change="uploadImg"/>
                    </mu-paper>
                </mu-col>
                <mu-col span="8">
                    <mu-row>
                        <mu-text-field v-model="treeForm.title" label="标题" label-float></mu-text-field>
                    </mu-row>
                    <mu-row>
                        <mu-select label="行业分类" filterable chips v-model="treeForm.classifyFather" class="select-input"
                                   @change="loadTinyClass">
                            <mu-option v-for="(item,index) in bigClass" :key="index" :label="item.name"
                                       :value="item.classifyId"></mu-option>
                        </mu-select>
                        <mu-select label="职业分类" filterable chips v-model="treeForm.classifyChild" class="select-input"
                                   :disabled="jobBtn" :placeholder="text">
                            <mu-option v-for="(item,index) in tinyClass" :key="index" :label="item.name"
                                       :value="item.ccid"></mu-option>
                        </mu-select>
                    </mu-row>
                </mu-col>
            </mu-row>
            <mu-row>
                <label style="color: grey;text-align: left;margin:0 10px">技能树简介:</label>
            </mu-row>
            <mu-row>
                <textarea v-model="treeForm.brief" rows="4" class="brief-box" placeholder="  请输入技能树简介"></textarea>
            </mu-row>
            <div class="tree-background">
                <mu-flex wrap="wrap" class="nodes-box">
                    <div class="list-item" v-for="(item,index) in nodeList">
                        <div class="icon-box">
                            <!--<mu-chip v-if="item.title" class="demo-chip2" @delete="deleteName(index)" delete></mu-chip>-->
                            <span v-if="item.title" class="node-name" @click="openNode(index,2)">{{item.title}}</span>
                            <mu-icon v-else value="add" size="40" color="grey" style="padding: 16px 0"
                                     @click="openNode(index,1)"></mu-icon>
                        </div>
                    </div>
                </mu-flex>
            </div>
            <div style="margin-bottom: 15px">
                <mu-button color="success" style="margin: 0 15px" @click="saveHandle">保存</mu-button>
                <mu-button color="success" style="margin: 0 15px" @click="cancelHandle">取消</mu-button>
            </div>
        </mu-container>

        <mu-dialog width="600" max-width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="nodeModal" scrollable>
            <p style="margin: 0;font-weight: 700;color: #8a8e69">新增节点</p>
            <mu-text-field v-model="nodeInfo.title" label="节点标题" label-float></mu-text-field>
            <mu-row>
                <mu-col span="4">
                    <label>节点详情</label>
                </mu-col>
                <mu-col span="8">
                    <div v-for="(item,index) in nodeChildList" class="node-detail">
                        <mu-chip class="demo-chip" @delete="deleteChild(index)" delete>
                        </mu-chip>
                        <mu-text-field class="text-field" v-model="item.name" placeholder="请输入详情标题"
                                       full-width></mu-text-field>
                        <mu-text-field class="text-field" v-model="item.content" placeholder="请输入详情内容" multi-line
                                       full-width></mu-text-field>
                    </div>
                    <div @click="addChild" style="width: 40px;height: 40px">
                        <mu-icon value="add" size="40" color="grey" style="line-height: 40px"></mu-icon>
                    </div>
                </mu-col>
            </mu-row>
            <mu-button slot="actions" flat color="secondary" @click="addNodeHandle()">确定</mu-button>
            <mu-button slot="actions" flat color="secondary" @click="nodeModal=false">取消</mu-button>
            <mu-button v-if="deleteBtn" slot="actions" color="red" @click="deleteNodeHandle()">删除<mu-icon right value="delete"></mu-icon></mu-button>
        </mu-dialog>
        <mu-snackbar position="bottom" color="error" :open.sync="snackbarOpen" style="height: 80px;">
            <mu-icon left value="warning"></mu-icon>
            {{snackbarText}}
            <mu-button flat slot="action" color="#fff" @click="snackbarOpen = false">Close</mu-button>
        </mu-snackbar>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "AddTree",
        data() {
            return {
                snackbarOpen: false,
                snackbarText: '',
                snackbarTimer: 2000,
                bigClass: [],
                tinyClass: [],
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
                nodeModal: false,
                nodeChildList: [
                    {
                        name: '',
                        content: ''
                    }
                ],
                // coverImg: 'static/img/cover-img.jpg',
                uptoken: '',
                treeForm: {
                    sid:null,
                    img: 'static/img/cover-img.jpg',
                    title: '',
                    brief: '',
                    classifyFather: '',
                    classifyChild: '',
                    nodes: ''
                },
                jobBtn: true,
                deleteBtn:false,
                text: '先选行业',
                nodeInfo: {
                    title: '',
                    positionCode: '',
                    childs: [],
                    light:0
                },
                treeInfo:{},
                nodeDetails:[],
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
                    this.treeForm=resp.data.data.skill;
                    this.classify=resp.data.data.classify;
                    this.loadNodes();
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            loadNodes(){
                let nodes=this.treeForm.nodes.split(' ')
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
                            // this.$set(this.nodeList, resp.data.data.positionCode, {name: resp.data.data.title, nid: resp.data.data.nid});
                            this.nodeDetails.push(resp.data.data)
                            console.log(this.nodeList,this.nodeDetails)
                            resolve()
                        }).catch(err => {
                            console.log('请求失败：' + err.status + ',' + err.statusText);
                        });

                    }))

                });
                Promise.all(promiseArr).then(val=>{
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
            addChild() {
                this.nodeChildList.push({name: '', content: ''})
            },
            deleteChild(index) {
                this.nodeChildList.splice(index, 1)
            },
            addNodeHandle() {
                let that = this;
                if (!this.nodeInfo.title) {
                    this.snackbarOpen = true;
                    this.snackbarText = '请先输入节点标题';
                    this.snackbarTimer = setTimeout(() => {
                        that.snackbarOpen = false;
                    }, 2000);
                    return;
                }
                this.nodeInfo.childs = this.nodeChildList[0].name ? JSON.stringify(this.nodeChildList) : '[]';
                console.log(this.nodeInfo)
                axios.post('http://localhost:81/api/skill/add-node', this.nodeInfo, {
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
                )
                // axios({
                //     method:'post',
                //     url:'/api/skill/add-node',
                //     data: JSON.stringify(this.nodeInfo),
                //     headers:{
                //         'Content-Type':'application/json;charset=UTF-8'
                //     }
                // })
                    .then(resp => {
                    if(resp.data.code==200){
                        console.log(resp.data);
                        this.treeForm.nodes = this.treeForm.nodes + resp.data.data + " ";
                        this.$set(this.nodeList, this.nodeInfo.positionCode, this.nodeInfo);
                        this.nodeList[this.nodeInfo.positionCode].childs=JSON.parse(this.nodeList[this.nodeInfo.positionCode].childs)
                        console.log(this.nodeInfo.positionCode, this.nodeList)
                    }
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
                this.nodeModal = false
            },
            uploadImg(e) {
                let that = this;
                let file = e.target.files[0];
                axios.post('http://localhost:81/qiniu/upload-with-no-pic-name')
                    .then(function (response) {
                        console.log('here' + response.data);
                        that.uptoken = response.data;
                        const axiosInstance = axios.create({withCredentials: false})
                        let data = new FormData();
                        data.append('token', response.data);
                        data.append('file', file);
                        axiosInstance({
                            method: 'POST',
                            url: 'http://up-z2.qiniup.com',
                            data: data,
                            timeout: 30000 // 超时时间，因为图片上传有可能需要很久
                        }).then(data => {
                            let url = 'https://pic.heartqiu.cn/' + data.data.key;
                            that.treeForm.img = url
                        }).catch((err) => {
                            console.log(err)
                        })
                    })
            },
            saveHandle() {
                let that = this;
                if (this.treeForm.img == 'static/img/cover-img.jpg') {
                    this.snackbarOpen = true;
                    this.snackbarText = '请先上传技能树封面';
                    this.snackbarTimer = setTimeout(() => {
                        that.snackbarOpen = false;
                    }, 2000);
                    return;
                }else if(!this.treeForm.title){
                    this.snackbarOpen = true;
                    this.snackbarText = '请先输入技能树标题';
                    this.snackbarTimer = setTimeout(() => {
                        that.snackbarOpen = false;
                    }, 2000);
                    return;
                }else if(!this.treeForm.classifyFather){
                    this.snackbarOpen = true;
                    this.snackbarText = '请先选择技能树所属行业';
                    this.snackbarTimer = setTimeout(() => {
                        that.snackbarOpen = false;
                    }, 2000);
                    return;
                }else if(!this.treeForm.classifyChild){
                    this.snackbarOpen = true;
                    this.snackbarText = '请先选择技能树所属职业';
                    this.snackbarTimer = setTimeout(() => {
                        that.snackbarOpen = false;
                    }, 2000);
                    return;
                }else if(!this.treeForm.brief){
                    this.snackbarOpen = true;
                    this.snackbarText = '请先至少填写一句技能树简介';
                    this.snackbarTimer = setTimeout(() => {
                        that.snackbarOpen = false;
                    }, 2000);
                    return;
                }
                let url='';
                if(this.treeForm.sid){
                    url='/api/skill/update-skill-by-sid'
                }else{
                    url='/api/skill/add-skill-tree'
                }
                axios.post(url, this.treeForm, {
                        headers: {
                            'accesstoken': this.$store.state.common.token
                        }
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
                    this.$router.go(-1);
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            cancelHandle() {
                this.$router.go(-1);
            },
            loadClasses() {
                axios.get('/api/classify/getAll').then(resp => {
                    this.bigClass = resp.data.data
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            loadTinyClass() {
                this.treeForm.classifyChild = ''
                this.bigClass.forEach(item => {
                    if (item.classifyId == this.treeForm.classifyFather) {
                        this.tinyClass = item.childs;
                        this.jobBtn = false;
                        this.text = ''
                    }
                })
            },
            openNode(index,tag) {//1是新增，2是修改
                if(tag==1){
                    this.nodeChildList = [
                        {
                            name: '',
                            content: ''
                        }
                    ];
                    this.nodeInfo = {
                        title: '',
                        positionCode: '',
                        childs: [],
                        light:0
                    };
                    this.deleteBtn=false
                }else{
                    // axios.post('/api/skill/get-node-by-nid', {nodeId: item}, {
                    //         transformRequest: [
                    //             function (data) {
                    //                 let params = '';
                    //                 for (let index in data) {
                    //                     params += index + '=' + data[index] + '&';
                    //                 }
                    //                 return params;
                    //             }
                    //         ]
                    //     }
                    // ).then(resp => {
                    //     this.nodeDetails.push(resp.data.data)
                    //     console.log(this.nodeDetails)
                    // }).catch(err => {
                    //     console.log('请求失败：' + err.status + ',' + err.statusText);
                    // });
                    this.nodeInfo = {
                        title: this.nodeList[index].title,
                        positionCode: index,
                        childs: this.nodeList[index].childs,
                        light:this.nodeList[index].light?1:0
                    };
                    this.nodeChildList = this.nodeList[index].childs;
                    this.deleteBtn=true
                }
                this.nodeModal = true;
                this.nodeInfo.positionCode = index;
            },
            deleteName(index) {
                this.nodeList[index].name = '';
            },
            deleteNodeHandle(){
                this.$set(this.nodeList,this.nodeInfo.positionCode,{nid:''});
                this.nodeModal=false;
            }
        },
        mounted() {
            this.treeForm.sid=this.$route.query.sid;
            if(this.treeForm.sid){
                this.loadDetails();
            }
            this.loadClasses()
        }
    }
</script>

<style scoped>
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

    .cover-file {
        width: 90px;
        height: 90px;
        position: absolute;
        left: 0;
        opacity: 0;
    }

    .select-input {
        display: inline-block;
        width: 50%;
    }

    .brief-box {
        width: 100%;
        margin: 0 10px;
        border: none;
        border-radius: 10px;
    }

    .list-item {
        width: 20%;
        margin-bottom: 10px;
    }

    .icon-box {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        background: #fff;
        margin: auto;
        box-shadow: 0 0 20px #767676;
    }

    .tree-background {
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

    .demo-chip2 {
        right: 0px;
        position: relative;
        left: 14px;
        top: -3px;
        width: 65%;
        background-color: rgb(255, 255, 255, 0);
    }

    .node-name {
        /*font-size: 20px;*/
        /*font-weight: 700;*/
        /*position: relative;*/
        /*top: -25%;*/
        /*width: 50px;*/
        font-size: 14px;
        line-height: 50px;
        font-weight: 400;
        height: 50px;
    }
</style>
