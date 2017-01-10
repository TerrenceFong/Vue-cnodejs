<template>

    <nv-head page-type="消息" fix-head="true" :show-menu.sync="showMenu"
        :message-count="message.hasnot_read_messages.length" :need-add="true" >
    </nv-head>

    <div class="page outLayer">
        <ul class="tabs">
            <li class="item br" :class='{"selected": selectItem === 2}' @click="changeItem(2)">已读消息</li>
            <li class="item" :class='{"selected": selectItem === 1}' @click="changeItem(1)">
                未读消息
                <i class="iconfont read" 
                    v-if="message.hasnot_read_messages.length > 0"
                    @click="markall">&#xe60c;</i>
            </li>
        </ul>

        <div class="message markdown-body" v-for="item in currentData">
            <section class="user">
                <img class="head" :src="item.author.avatar_url" />
                <div class="info">
                    <span class="cl">
                        <span class="name">{{item.author.loginname}}</span>
                        <span class="name" v-if="item.type === 'at'">在回复中@了您</span>
                        <span class="name" v-if="item.type === 'reply'">回复了您的话题</span>
                    </span>
                    <span class="cr">
                        <span class="name">{{item.reply.create_at | getLastTimeStr true}}</span>
                    </span>
                </div>
            </section>

            <div class="reply_content" v-html="item.reply.content"></div>

            <div class="topic-title" v-link="{name: 'topic', params: {id:item.topic.id}}">
                话题：{{item.topic.title}}
            </div>
        </div>

        <div class="no-data" v-show="noData">
            <i class="iconfont icon-empty">&#xe60a;</i>
            暂无数据!
        </div>
    </div>

</template>
<script>
    import nvHead from '../components/header.vue'

    export default {
        components:{
            "nv-head":nvHead
        },
        data (){
            return {
                showMenu: false,
                selectItem: 2,
                token: localStorage.token || '',
                // 切换tab时从message获取数据
                message: {
                    hasnot_read_messages: [],
                    has_read_messages: []
                },
                noData: false,
                currentData: []
            }
        },
        route:{
            data (transition){
                this.getMessage()
            }
        },
        methods:{
            /**
             *  切换tab
             *  @Author:  fffffbw
             *  @DateTime 2016-12-21
             *  @param    {int}   idx 2=>已读,1=>未读
             */
            changeItem (idx){
                this.selectItem = idx;
                this.currentData = idx===1 ? this.message.hasnot_read_messages : this.message.has_read_messages;
                this.noData = this.currentData.length === 0 ? true : false;
            },
            // 标记所有为已读
            markall (){
                this.$http.post('https://cnodejs.org/api/v1/message/mark_all', { accesstoken:localStorage.token }).then((response) => {
                    var d = response.body
                    if(d && d.success){
                        this.getMessage(true)
                    }
                }).catch(error => console.log(error))
            },
            // mark 当为 false 时，显示未读。默认为 true，显示已读。
            getMessage (mark = false){
                let _self = this;
                this.$http.get('https://cnodejs.org/api/v1/messages?accesstoken='+_self.token).then((response) => {
                    var d = response.body
                    console.log(response)
                    if(d && d.data){
                        _self.message.hasnot_read_messages = d.data.hasnot_read_messages
                        _self.message.has_read_messages = d.data.has_read_messages
                        if(d.data.hasnot_read_messages.length > 0){
                            _self.currentData = d.data.hasnot_read_messages
                            _self.selectItem = 1
                        }else{
                            _self.currentData = d.data.has_read_messages
                            _self.selectItem = 2
                        }
                        _self.noData = _self.currentData.length === 0 ? true : false
                    }else{
                        _self.noData = true
                    }
                    
                    // 标记已读时保持在未读界面
                    if(mark === true){
                        this.changeItem(1)
                    }
                }).catch(error => console.log(error))
            }
        }
    }
</script>
