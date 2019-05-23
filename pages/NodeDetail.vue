<template>
    <div style="height: 100%;overflow: auto">
        <mu-appbar class="app_bar" title="节点详情" color="info">
            <mu-button icon slot="left" @click="$router.go(-1);">
                <mu-icon value="arrow_back"></mu-icon>
            </mu-button>
            <mu-button icon slot="right">
                <mu-icon value=""></mu-icon>
            </mu-button>
        </mu-appbar>
        <div>
            <p class="node-title" >{{nodeInfo.name}}</p>
            <p class="node-content" >{{nodeInfo.content}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NodeDetail",
        data(){
          return{
              nodeInfo:{
                  name:'',
                  content:''
              }
          }
        },
        mounted(){
            this.nodeInfo.name=this.$route.query.name;
            this.nodeInfo.content=this.$route.query.content;
            console.log(this.nodeInfo)
        }
    }
</script>

<style scoped>
.node-title{
    font-size: 24px;
    text-align: left;
    font-weight: 700;
    margin: 20px;
}
    .node-content{
        font-size: 14px;
        text-align: left;
        margin: 20px;
        text-indent: 2em;
    }
</style>
