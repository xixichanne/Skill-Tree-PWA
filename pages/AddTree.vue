<template>
    <div style="height: 100%;overflow: auto">
        <mu-appbar class="app_bar" title="新建技能树" color="secondary"></mu-appbar>
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
                            <mu-chip v-if="item.name" class="demo-chip2" @delete="deleteName(index)" delete></mu-chip>
                            <span v-if="item.name" class="node-name">{{item.name}}</span>
                            <mu-icon v-else value="add" size="40" color="grey" style="padding: 16px 0"
                                     @click="openNode(index)"></mu-icon>
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
        </mu-dialog>

    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "AddTree",
        data() {
            return {
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
                    img: 'static/img/cover-img.jpg',
                    title: '',
                    brief: '',
                    classifyFather: '',
                    classifyChild: '',
                    nodes: ''
                },
                jobBtn: true,
                text: '先选行业',
                nodeInfo: {
                    title: '',
                    positionCode: '',
                    childs: [],
                }
            }
        },
        methods: {
            addChild() {
                this.nodeChildList.push({name: '', content: ''})
            },
            deleteChild(index) {
                this.nodeChildList.splice(index, 1)
            },
            addNodeHandle() {
                if(!this.nodeInfo.title){
                    this.$toast.error('请先输入节点标题')
                    return;
                }
                this.nodeInfo.childs = JSON.stringify(this.nodeChildList);
                axios.post('/api/skill/add-node', this.nodeInfo, {
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
                    this.treeForm.nodes = this.treeForm.nodes + resp.data.data + " ";
                    this.$set(this.nodeList, this.nodeInfo.positionCode, {name: this.nodeInfo.title, nid: ''});
                    console.log(this.nodeInfo.positionCode, this.nodeList)
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
                this.nodeModal = false
            },
            uploadImg(e) {
                let that = this
                let file = e.target.files[0];
                axios.post('http://localhost:81/qiniu/upload-with-no-pic-name')
                    .then(function (response) {
                        console.log('here' + response.data)
                        that.uptoken = response.data
                        const axiosInstance = axios.create({withCredentials: false})
                        let data = new FormData()
                        data.append('token', response.data)
                        data.append('file', file)
                        axiosInstance({
                            method: 'POST',
                            url: 'http://up-z2.qiniup.com',
                            data: data,
                            timeout: 30000 // 超时时间，因为图片上传有可能需要很久
                        }).then(data => {
                            let url = 'https://pic.heartqiu.cn/' + data.data.key
                            that.treeForm.img = url
                        }).catch((err) => {
                            console.log(err)
                        })
                    })
            },
            saveHandle() {
                axios.post('/api/skill/add-skill-tree', this.treeForm, {
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
                this.bigClass.forEach(item => {
                    if (item.classifyId == this.treeForm.classifyFather) {
                        this.tinyClass = item.childs;
                        this.jobBtn = false;
                        this.text = ''
                    }
                })
            },
            openNode(index) {
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
                };
                this.nodeModal = true;
                this.nodeInfo.positionCode = index;
            },
            deleteName(index) {
                this.nodeList[index].name = '';
            }
        },
        mounted() {
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
        font-size: 20px;
        font-weight: 700;
        position: relative;
        top: -25%;
        width: 50px;
    }
</style>
