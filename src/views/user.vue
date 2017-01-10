<template>

    <nv-head page-type="用户信息" fix-head="true" :show-menu="false" :need-add="true" ></nv-head>

    <div class='outLayer' v-if="userShow">   
        <section class="userinfo">
            <img class="u-img" :src="user.avatar_url" /><br/>
            <span class="u-name" v-text="user.loginname"></span>
            <div class="u-bottom">
                <span class="u-time" v-text="user.create_at | getLastTimeStr false"></span>
                <span class="u-score">积分：{{user.score}}</span>
            </div>
            <div class="u-logout" @click="logout" v-if="showLogout">退出</div>
        </section>

        <section class="topics">
            <ul class="user-tabs">
                <li class="item br" :class='{"selected": selectItem === 1}' @click="changeItem(1)">最近回复</li>
                <li class="item" :class='{"selected": selectItem === 2}' @click="changeItem(2)">最新发布</li>
            </ul>

            <div class="message markdown-body" v-for="item in currentData">
                <section class="user">
                    <img class="head" :src="item.author.avatar_url"
                        v-link="{ name:'user', params: {loginname: item.author.loginname} }" />
                    <div class="info" v-link="{ name: 'topic', params: {id: item.id} }">
                        <div class="t-title">{{item.title}}</div>
                        <span class="cl">
                            <span class="name">{{item.author.loginname}}</span>
                        </span>
                        <span class="cr">
                            <span class="name">{{item.last_reply_at | getLastTimeStr true}}</span>
                        </span>
                    </div>
                </section>
            </div>

            <div class="no-data" v-show="currentData.length === 0">
                <i class="iconfont icon-empty">&#xe60a;</i>
                暂无数据!
            </div>
        </section>
    </div>

    <nv-alert :show="alert.show" :content="alert.txt"></nv-alert>

</template>
<script>
    import nvHead from '../components/header.vue'
    import nvAlert from '../components/nvAlert.vue'

    export default  {
        components:{
            "nv-alert": nvAlert,
            "nv-head":nvHead
        },
        data (){
            let _self = this;
            return {
                user: {},
                currentData: [],
                selectItem: 1,
                userShow: true,
                /*弱提示*/
                alert: {
                    txt: '',
                    show: false,
                    hideFn: function(){
                        let timer;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            _self.alert.show = false;
                        }, 3000);
                    }
                }
            }
        },
        route:{
            data (transition){
                let _self = this;
                let loginname = transition.to.params.loginname;

                this.$http.get('https://cnodejs.org/api/v1/user/'+loginname).then((response) => {
                    var d = response.body
                    if(d && d.data){
                        let data = d.data;
                        // 存储个人信息到user
                        _self.user = data;
                        if(data.recent_replies.length > 0){
                            _self.currentData = data.recent_replies;
                        }else{
                            _self.currentData = data.recent_topics;
                            _self.selectItem = 2;
                        }
                    }
                }).catch(response => {
                    var error = response.body
                    _self.userShow = false
                    _self.alert.txt = error.error_msg;
                    _self.alert.show = true;
                    _self.alert.hideFn();
                    setTimeout(function(){
                        _self.$route.router.go("/list");
                    },2000)
                })
            }
        },
        methods:{
            //切换tab
            changeItem (idx){
                this.selectItem = idx;
                this.currentData = idx===1 ? this.user.recent_replies : this.user.recent_topics;
            },
            logout (){
                var self = this
                var logoutPromise = function(){
                    return new Promise(function(resolve, reject){
                        localStorage.removeItem('loginname');
                        localStorage.removeItem('avatar_url');
                        localStorage.removeItem('userId');
                        localStorage.removeItem('token');
                        if (true) {
                            resolve()
                        }else{
                            reject(new Error("clear error"));
                        }
                    })
                }
                logoutPromise().then(function(){
                    let redirect = encodeURIComponent('/list');
                    self.$route.router.go('/login?redirect=' + redirect);
                }).catch( error => console.log('发生错误：',error) )
            }
        },
        computed: {
            showLogout(){
                return this.user.loginname === localStorage.loginname
            }
        }
    }
</script>
