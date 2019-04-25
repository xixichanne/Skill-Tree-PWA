<template>
        <!--<nav class="tab-bar">-->
            <!--<router-link :to="{-->
                        <!--name: 'index',-->

                    <!--}" id="defaultTab" class="tab-item mui-active">-->
                    <!--<i class="iconfont" id="icon1">&#xe608;</i>-->
                    <!--<span class="mui-tab-label">首页</span>-->
            <!--</router-link>-->

            <!--<router-link :to="{-->
                        <!--name: 'sortPage'-->
                    <!--}" class="tab-item">-->
                <!--<i class="iconfont" id="icon2">&#xe606;</i>-->
                <!--<span class="mui-tab-label">分类</span>-->
            <!--</router-link>-->
            <!--<router-link :to="{-->
                        <!--name: 'minePage'-->
                    <!--}" class="tab-item">-->
                <!--<div class="logo-wrapper">-->
                    <!--<div class="logo">-->
                        <!--<img class="icon-tree" src="../static/img/logo-tree.png"/>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</router-link>-->
            <!--<router-link :to="{-->
                        <!--name: 'search'-->
                    <!--}" class="tab-item" >-->
                <!--<i class="iconfont" id="icon3">&#xe603;</i>-->
                <!--<span class="mui-tab-label">探索</span>-->
            <!--</router-link>-->
            <!--<router-link :to="{-->
                        <!--name: 'minePage'-->
                    <!--}" class="tab-item">-->
                <!--<i class="iconfont" id="icon4">&#xe605;</i>-->
                <!--<span class="mui-tab-label">我的</span>-->
            <!--</router-link>-->
        <!--</nav>-->

    <mu-container v-show="show">
        <mu-bottom-nav color="secondary" class="tab-bar">
            <mu-bottom-nav-item title="首页" icon="home" to="/"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="分类" icon="sort" to="/sort-page"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="资料盒" icon="library_books" to="/mine-box"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="我的" icon="person" to="/mine-page"></mu-bottom-nav-item>
        </mu-bottom-nav>
    </mu-container>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "TabBar",
        computed: {
            ...mapState('appShell/appTab', [
                'show',
                'actions'
            ]),
            ...mapState('appShell/common', [
                'isPageSwitching'
            ])
        },
    }
</script>

<style lang="stylus" scoped>
    .tab-bar{
        height 70px
        width 100%
    }
    .logo-wrapper
        display: inline-block
        vertical-align: top
        position: relative
        top: -40px
        margin: 0 12px
        padding: 6px
        width: 75px
        height: 75px
        box-sizing: border-box
        border-radius: 50%
        background: #075a1b
        box-shadow 0px 0px 20px 2px #075a1b
        .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
        .icon-tree
            width 60px

</style>
