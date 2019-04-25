<template>
    <div class="container-wrap">
        <mu-appbar style="width: 100%;" color="primary" title="登录"></mu-appbar>
        <div style="margin: 30px">
            <img src="static/img/logo-tree.png">
            <p>欢迎使用技能树</p>
            <p>(建议添加至桌面使用哦～）</p>
            <mu-linear-progress color="green" style="width: 80%;margin: 10px auto;"></mu-linear-progress>
        </div>
        <mu-form class="login-box" ref="form" :model="validateForm" label-position="top">
            <mu-form-item class="content" label="手机号" label-float prop="tel" :rules="telRules">
                <div class="mu-form-item-content">
                <mu-text-field class="input" v-model="validateForm.tel" prop="username"></mu-text-field>
                <mu-button round color="success" @click="getVerifyCode" :disabled="!btnState">{{btnText}}</mu-button>
                </div>
            </mu-form-item>
            <mu-form-item label="验证码" label-float prop="password" :rules="passwordRules">
                <mu-text-field  v-model="validateForm.password" prop="password"></mu-text-field>
            </mu-form-item>
            <mu-form-item>
                <mu-button class="login-button" color="primary" @click="submit">登录</mu-button>
            </mu-form-item>
        </mu-form>
        <mu-dialog class="dialog" width="50%" :open.sync="modal">
            <mu-icon value="clear" size="48"></mu-icon>
            <p style="margin:0">{{modalText}}</p>
        </mu-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import axios from 'axios';
    import {sendSms} from "../core/alicloudSMS";

    let state = {
        appTabState: {
            show: false
        }
    };

    function setState(store) {
        store.dispatch('appShell/appTab/setAppTab', state.appTabState.show);
    }
    export default {
        name: "Login",
        data() {
            return {
                telRules: [
                    {validate: (val) => val.length ==11, message: '请输入正确的手机号码'}
                ],
                passwordRules: [
                    {validate: (val) => !!val, message: '请输入验证码'},
                ],
                validateForm: {
                    tel: '',
                    password: '',
                },
                verify:'',
                wait:60,
                btnState:true,
                modal:false,
                modalText:'请输入手机号',
                btnText:'获取验证码'
            }
        },
        methods: {
            // ...mapState('appShell/appTab', {
            //     appTabShow: state => state.show
            // }),
            // async login() {
            //
            //     // 如果未登录，设置登录成功
            //     if (!this.$store.state.common.login) {
            //
            //         // 修改 store 中的登录状态为 true
            //         await this.$store.dispatch('common/setLogin', true);
            //         this.$refs.tips.innerHTML = 'tips：登录成功';
            //     }
            //     // 如果登录显示已登录
            //     else {
            //         this.$refs.tips.innerHTML = 'tips：已登录';
            //     }
            // },
            getVerifyCode(){
                if(this.validateForm.tel.length==0){
                    this.modal=true;
                    this.modalText='请输入手机号'
                    return;
                }
                //阿里云验证码
                let verityCode=parseInt(Math.random() * (999999 - 100000 + 1) + 100000);
                console.log(verityCode);
                this.verify=verityCode;
                // sendSms(this.validateForm.tel,verityCode)
                axios.post('/api/msg/sendMsg',{phoneNumbers:this.validateForm.tel,templateParam:this.verify},{  //方式2通过transformRequest方法发送数据，本质还是将数据拼接成字符串
                    transformRequest:[
                        function(data){
                            let params='';
                            for(let index in data){
                                params+=index+'='+data[index]+'&';
                            }
                            return params;
                        }
                    ]
                })
                    .then(resp => {
                        let code=JSON.parse(resp.data.data).Code=='OK'?1:-1;
                        console.log(code)
                        if(code==1){
                            //60s冷却
                            this.time();
                        }else {
                            this.modal=true;
                            this.modalText='请输入合法手机号'
                            return;
                        }
                    }).catch(err => {
                    console.log('请求失败：'+err.status+','+err.statusText);
                });

            },
            time() {
                if (this.wait == 0) {
                    this.btnState=true;
                    this.btnText='获取验证码';
                    this.wait = 60;
                } else {
                    this.btnState=false;
                    this.btnText=this.wait+"秒后重新发送";
                    this.wait--;
                    setTimeout(()=>{this.time()}, 1000)
                }
            },
            async submit() {
                if(this.verify==this.validateForm.password){
                    axios.post('/api/user/register',{telNum:this.validateForm.tel},{  //方式2通过transformRequest方法发送数据，本质还是将数据拼接成字符串
                        transformRequest:[
                            function(data){
                                let params='';
                                for(let index in data){
                                    params+=index+'='+data[index]+'&';
                                }
                                return params;
                            }
                        ]
                    })
                        .then(resp => {
                            console.log(resp.data);
                            this.$store.dispatch('common/setLogin', true);
                            this.$store.dispatch('common/setToken', resp.data.data.code);
                            this.$store.dispatch('common/setUid', resp.data.data.uid);
                            console.log(resp.data.data.code);
                            this.$router.push({path:'/'})
                        }).catch(err => {
                        console.log('请求失败：'+err.status+','+err.statusText);
                    });
                }else{
                    this.modal=true;
                    this.modalText='验证码错误'
                    return;
                }
            },

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
    .container-wrap{
        width: 100%;
        min-height: fit-content;
        height: 100%;
        margin: 0;
        margin-bottom: 0!important;
    }
    .login-box{
        width: 100%;
        max-width: 330px;
        margin: 30px auto;
        text-align: left;
    }
    .mu-form-item-content{
        width: 100%;
        flex-wrap: nowrap;
    }
    .login-button{
        margin: 10px auto;
    }
    .dialog{
        text-align: center;
        padding: 20px 30px;
    }
</style>
