<template>
    <div style="height: 100%">
        <mu-appbar style="width: 100%;" color="secondary" title="个人中心"></mu-appbar>
        <div class="header">
            <div class="head">
                <mu-button v-loading="loading" fab style="width: 90px;height: 90px" disabled>
                    <mu-avatar size=90>
                        <img :src="userInfo.headPic">
                    </mu-avatar>
                </mu-button>
            </div>
            <div class="name">
                <mu-text-field class="username-field" action-icon="create" v-model="userInfo.userName"
                               solo>
                </mu-text-field>
                <!--<mu-icon value="create" size="30" @click="editState=false"></mu-icon>-->
            </div>
        </div>
        <div class="content">
            <mu-list>
                <mu-list-item @click="">
                    <mu-icon value="send"/>
                    <mu-list-item-title>修改头像</mu-list-item-title>
                    <input class="cover-file" name="file" type="file" accept="image/png,image/gif,image/jpeg"
                           @change="uploadImg"/>
                </mu-list-item>
                <mu-list-item title="赞助一下">
                    <mu-icon value="inbox"/>
                    <mu-list-item-title @click="support">赞助一下</mu-list-item-title>
                </mu-list-item>
                <mu-list-item title="github地址" @click="">
                    <mu-icon value="grade"/>
                    <mu-list-item-title @click="githubAddr">github地址</mu-list-item-title>
                </mu-list-item>
            </mu-list>
            <!--<mu-divider/>-->
        </div>
        <mu-button color="secondary" @click="exitLogin">退出登录</mu-button>
    </div>

</template>

<script>
    import axios from 'axios';

    function setState(store) {
        store.dispatch('common/validLogin', store.state.common.token);
    }

    export default {
        name: "MinePage",
        data() {
            return {
                userInfo: {
                    userName: '',
                    headPic: 'http://iph.href.lu/200x200?text=请上传头像'
                },
                editState: true,
                uptoken: '',
                loading:false
            }
        },
        methods: {
            loadUserInfo() {
                let uid = this.$store.state.common.uid;
                axios.get('/api/user/get-by-uid?uid=' + uid).then(resp => {
                    this.userInfo = resp.data.data;
                    this.userInfo.userName = this.userInfo.userName ? this.userInfo.userName : this.userInfo.telNum
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            exitLogin() {
                this.$router.push({path: '/login'})
            },
            uploadImg(e) {
                let that = this;
                let file = e.target.files[0];
                that.loading=true;
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
                            that.userInfo.headPic = url;
                            that.loading=false
                        }).catch((err) => {
                            console.log(err)
                        })
                    })
            },
            support() {
                this.$alert(function(h,params){
                    return h("img", {
                    domProps: {
                        src: "https://pic.heartqiu.cn/FgTVyLFD8XIT3h4zMM_61K_jl2k_"
                    },
                    style: {
                        width: "135px",
                        height: "135px",
                        margin: "8px 0px",
                    },
                })}, '赞助一下吧～', {
                    okLabel: '知道了'
                }).then(() => {
                });

            },
            githubAddr(){
                this.$alert('https://github.com/xixichanne/Skill-Tree-PWA', '欢迎star', {
                    okLabel: '知道了'
                }).then(() => {
                });
            }
        },
        mounted() {
            this.loadUserInfo()
        },
        async asyncData({store, route}) {
            setState(store);
        },
        activated() {
            setState(this.$store);
        },
        beforeRouteLeave(to, from, next) {
            axios.post("/api/user/update-by-uid", this.userInfo, {
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
            }).catch(err => {
                console.log('请求失败：' + err.status + ',' + err.statusText);
            });
            next();
        }
    }
</script>

<style scoped>
    .header {
        margin: 30px

    }

    .username-field {
        width: 50%;
        font-size: 20px;
    }

    .cover-file {
        width: 90px;
        height: 90px;
        position: absolute;
        left: 0;
        opacity: 0;
    }
</style>

