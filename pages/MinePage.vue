<template>
    <div style="height: 100%">
        <mu-appbar style="width: 100%;" color="secondary" title="个人中心"></mu-appbar>
        <div class="header">
            <div class="head">
                <mu-avatar size=90>
                    <img :src="userInfo.headPic">
                </mu-avatar>
            </div>
            <div class="name">
                <mu-text-field class="username-field" :disabled="editState" action-icon="create"
                               @action-click="editState=false" solo>{{userInfo.userName}}
                </mu-text-field>
                <!--<mu-icon value="create" size="30" @click="editState=false"></mu-icon>-->
            </div>
        </div>
        <div class="content">
            <mu-list>
                <mu-list-item @click="">
                    <mu-icon value="send"/>
                    <mu-list-item-title>修改头像</mu-list-item-title>
                </mu-list-item>
                <mu-list-item title="赞助一下" @click="">
                    <mu-icon value="inbox"/>
                    <mu-list-item-title>赞助一下</mu-list-item-title>
                </mu-list-item>
                <mu-list-item title="github地址" @click="">
                    <mu-icon value="grade"/>
                    <mu-list-item-title>github地址</mu-list-item-title>
                </mu-list-item>
                <mu-list-item title="清除缓存" @click="">
                    <mu-icon value="drafts"/>
                    <mu-list-item-title>清除缓存</mu-list-item-title>
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
                    headPic:'http://iph.href.lu/200x200?text=请上传头像'
                },
                editState: true,
            }
        },

        methods: {
            loadUserInfo() {
                let uid = this.$store.state.common.uid;
                axios.get('/api/user/get-by-uid?uid=' + uid).then(resp => {
                    this.userInfo = resp.data.data
                }).catch(err => {
                    console.log('请求失败：' + err.status + ',' + err.statusText);
                });
            },
            exitLogin() {
                this.$router.push({path: '/login'})
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
        }
    }
</script>

<style scoped>
    .header {
        margin: 30px

    }

    .username-field {
        width: 90px;
        font-size: 30px;
    }
</style>

