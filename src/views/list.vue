<template>
    <!-- 全局header -->
    <nv-head :page-type="searchKey.tab | getTitleStr"
            fix-head="true"
            :need-add="true"
            :show-menu.sync="showMenu">
    </nv-head>
    
    <section id="page">
        <!-- 首页列表 -->
        <ul class="posts-list">
            <li v-for="item in topics" v-link="{ name: 'topic', params: {id: item.id} }">

                <h3 v-text="item.title"
                        :class="item.tab | getTabClassName item.good item.top"
                        :title="item.tab | getTabStr item.good item.top">
                </h3>
                <div class="content">
                    <img class="avatar" :src="item.author.avatar_url" />
                    <div class="info">
                        <p>
                            <span class="name">
                                {{item.author.loginname}}
                            </span>
                            <span class="status" v-if="item.reply_count > 0">
                                <b>{{item.reply_count}}</b>
                                /{{item.visit_count}}
                            </span>
                        </p>
                        <p>
                            <time>
                                {{item.create_at | getLastTimeStr true}}
                            </time>
                            <time>
                                {{item.last_reply_at | getLastTimeStr true}}
                            </time>
                        </p>
                    </div>
                </div>
            </li>
        </ul>
    </section>

    <nv-top></nv-top>
</template>

<script>
    import nvHead from '../components/header.vue'
    import nvTop from '../components/backtotop.vue'

    export default {
        components:{
            "nv-head":nvHead,
            "nv-top":nvTop
        },
        data (){
            return {
                showMenu: false,
                scroll:true,
                topics:[],
                searchKey:{
                    page:1,
                    limit:20,
                    tab:'all',
                    mdrender:true
                },
                searchDataStr:'',
                scrollTop:0
            }
        },
        route:{
            // list组件 加载和设置当前组件的数据
            data (transition){
                console.log(this.searchKey.limit)
                // this.searchKey.limit = 20;
                let query = transition.to.query
                let tab = query.tab || 'all'
                // console.log(query)
                console.log(tab)

                //记录首次加载的查询条件
                if(this.searchDataStr == ""){
                    this.searchDataStr = JSON.stringify(this.searchKey);
                }
                //如果从左侧切换分类，则清空查询条件
                if(transition.from.name === "list"){
                    //this.searchKey.page = 1;
                    
                    // 以下注释是源代码 逻辑错误 没有起到作用  (或者说直接去掉.limit的赋值语句)
                    // this.searchDataStr.limit = 20;
                    // this.searchKey = JSON.parse(this.searchDataStr);
                    var newSearchDataStr = JSON.parse(this.searchDataStr)
                    newSearchDataStr.limit = 20
                    this.searchKey = newSearchDataStr;
                }
                

                //如果从详情返回并且typeid一样才去sessionStorge
                if(sessionStorage.searchKey 
                    && transition.from.name === "topic"
                    && sessionStorage.tab == tab){

                    console.log(transition.from.name)
                    this.topics = JSON.parse(sessionStorage.topics);
                    this.searchKey = JSON.parse(sessionStorage.searchKey);
                    this.$nextTick(()=> $(window).scrollTop(sessionStorage.scrollTop));
                }
                else{
                    //页面初次加载获取的数据
                    this.searchKey.tab = tab;
                    this.getTopics();
                }
                this.showMenu = false;

                //滚动加载
                $(window).on('scroll', () => {
                    this.getScrollData();
                });

            },
            // list组件被移除时调用
            deactivate (transition){
                $(window).off('scroll');
                if(transition.to.name === "topic"){
                    // 移除时获取的滚动高度一直为0，现阶段通过getScrollData()方法实时获取this.scrollTop值
                    console.log(this.scrollTop)
                    sessionStorage.scrollTop = this.scrollTop;
                    sessionStorage.topics = JSON.stringify(this.topics);
                    sessionStorage.searchKey = JSON.stringify(this.searchKey);
                    // transition.from => 当前路径的路由对象
                    sessionStorage.tab = transition.from.query.tab || 'all';
                }
                else{
                    sessionStorage.removeItem("scrollTop");
                    sessionStorage.removeItem("topics");
                    sessionStorage.removeItem("searchKey");
                    sessionStorage.removeItem("tab");
                }
                // 执行相关操作后再进入下一个生命周期（activate）
                transition.next();
            }
        },
        methods:{
            getTopics (){
                let params = $.param(this.searchKey);
                this.$http.get('https://cnodejs.org/api/v1/topics?'+params).then((response) => {
                    this.scroll = true;
                    if(response && response.body.data){
                        this.topics = response.body.data;
                    }
                }).catch(function(response) {
                    console.log("error:")
                    console.log(response)
                })
            },
            //滚动加载数据
            getScrollData (){
                this.scrollTop = $(window).scrollTop()
                if(this.scroll){
                    let totalheight = parseFloat( $(window).height() ) + parseFloat( $(window).scrollTop() );
                    if ($(document).height() <= totalheight + 200) {
                        // 请求数据成功之前禁止滚动加载数据 避免滚到最下方时多次触发该事件
                        this.scroll = false;
                        this.searchKey.limit += 20;
                        this.getTopics();
                    }
                }
            }
        }
    }
</script>
