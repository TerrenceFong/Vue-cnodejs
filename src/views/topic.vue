<template>

    <nv-head page-type="主题"
            :show-menu.sync="showMenu"
            :need-add="true"
            fix-head="true">
    </nv-head>

    <div id="page" class='outLayer'
        :class="{'show-menu':showMenu}"
        v-if="topic.title">

        <h2 class="topic-title" v-text="topic.title"></h2>
        <section class="author-info">
            <img class="avatar" :src="topic.author.avatar_url" v-link="{ name: 'user', params: {loginname:topic.author.loginname} }" />
            <div class="col">
                <span>{{topic.author.loginname}}</span>
                <time>
                    发布于:{{topic.create_at | getLastTimeStr true}}
                </time>
            </div>
            <div class="right">
                <span class="tag"
                    :class="topic.tab | getTabClassName item.good item.top">
                    {{topic.tab|getTabStr topic.good topic.top}}
                </span>
                <span class="name">{{topic.visit_count}}次浏览</span>
            </div>
        </section>

        <section class='markdown-body topic-content' v-html="topic.content"></section>

        <h3 class="topic-reply">
            <strong>{{ topic.reply_count }}</strong> 回复
        </h3>

        <section class="reply-list">
            <ul>
                <li v-for="item in topic.replies">
                    <section class="user">
                        <img class="head" :src="item.author.avatar_url"
                            v-link="{ name: 'user', params: {loginname: item.author.loginname} }"/>
                        <div class="info">
                            <span class="cl">
                                <span class="name" v-text="item.author.loginname"></span>
                                <span class="name mt10">
                                    <span></span>
                                    发布于:{{item.create_at | getLastTimeStr true}}</span>
                            </span>
                            <span class="cr">
                                <span class="iconfont icon"
                                    :class="{ 'uped': isUps(item.ups) }"
                                    @click="upReply(item)">&#xe608;</span>
                                {{ item.ups.length }}
                                <span class="iconfont icon" @click="addReply(item.id)">&#xe609;</span>
                            </span>
                        </div>
                    </section>

                    <div class="reply_content" v-html="replaceText(item.content)"></div>

                    <nv-reply v-if="userId && curReplyId === item.id"
                        :topic.sync="topic"
                        :topic-id="topicId"
                        :reply-id="item.id"
                        :reply-to="item.author.loginname"
                        :show="curReplyId"
                        @close="hideItemReply">
                    </nv-reply>
                </li>
            </ul>
        </section>

        <nv-top></nv-top>

        <nv-reply v-if="userId"
            :topic.sync="topic"
            :topic-id="topicId"
            :reply-id="" >
        </nv-reply>

    </div>

    <div class='no-data' v-if="noData">
        <i class="iconfont icon-empty">&#xe60a;</i>
        该话题不存在!
    </div>

    <nv-alert :show="alert.show" :content="alert.txt"></nv-alert>

</template>
<script>
    import nvHead from '../components/header.vue'
    import nvAlert from '../components/nvAlert.vue'
    import nvReply from '../components/reply.vue'
    import nvTop from '../components/backtotop.vue'

    export default {
        components:{
            "nv-head": nvHead,
            "nv-alert": nvAlert,
            "nv-reply": nvReply,
            "nv-top": nvTop
        },
        data (){
            let _self = this;
            return {
                showMenu: false,     //是否展开左侧菜单
                topic: {},           //主题
                noData: false,
                topicId: '',
                curReplyId: '',      //
                userId: localStorage.userId || '',
                /*弱提示*/
                alert: {
                    txt: '',
                    show: false,
                    hideFn: function(){
                        let timer;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            _self.alert.show = false;
                        }, 1000);
                    }
                }
            }
        },
        route:{
            data (transition){
                let _self = this;
                //隐藏左侧展开菜单
                _self.showMenu = false;

                //获取url传的tab参数
                _self.topicId = transition.to.params.id;

                //加载主题数据
                this.$http.get('https://cnodejs.org/api/v1/topic/'+_self.topicId).then((response) => {
                    var d = response.body
                    if(d && d.data){
                        // 数据请求成功后，把所有数据保存到topic数组里
                        _self.topic = d.data;
                    }
                    else{
                        _self.noData = true;
                    }
                }).catch(response => {
                    console.log(response)
                    var error = response.body
                    if(error.success === false){
                        _self.$route.router.go('/index');
                    }
                })
            }
        },
        methods:{
            replaceText (text){
                return text.replace(/href="\/user\/+/igm, 'href="/#!/user/')
            },
            isUps (ups){
                let _self = this;
                return $.inArray(_self.userId, ups) >= 0;
            },
            addReply (id){
                this.curReplyId = id;
                let _self = this;
                // 未登录评论则跳转到登陆界面
                if( !_self.userId ){
                    _self.$route.router.go('/login?redirect='+encodeURIComponent(this.$route.path));
                }
            },
            hideItemReply (){
                console.log(this.curReplyId)
                this.curReplyId = '';
            },
            upReply (item){
                let _self = this;
                if( !_self.userId ){
                    _self.$route.router.go('/login?redirect='+encodeURIComponent(this.$route.path));
                }else{
                    _self.$http.post('https://cnodejs.org/api/v1/reply/'+item.id+'/ups', { accesstoken: localStorage.token }).then((response) => {
                        var res = response.body
                        if(res.success){
                            if(res.action == "down"){
                                let index = $.inArray(_self.userId, item.ups);
                                item.ups.splice(index,1);
                            }else{
                                item.ups.push(_self.userId);
                            }
                        }
                    }).catch(response => {
                        let error = response.body
                        _self.alert.txt = error.error_msg;
                        _self.alert.show = true;
                        _self.alert.hideFn();
                    })
                }
            }
        }
    }
</script>
