<template>

    <section class="reply">
        <textarea id="content" rows="8" class="text"
            :class="{'err': hasErr}"
            v-model="content"
            placeholder='回复支持Markdown语法,请注意标记代码'>
        </textarea>
        <a class="button" @click="addReply">确定</a>
    </section>

    <nv-alert :show="alert.show" :content="alert.txt"></nv-alert>

</template>
<script>
    import nvAlert from '../components/nvAlert.vue'
    import utils from '../libs/utils'
    import mark from "markdown"

    var markdown = mark.markdown
    export default {
        components:{
            "nv-alert": nvAlert,
        },
        replace:true,
        props: ['topic','replyId','topicId','replyTo','show'],
        data (){
            let _self = this;
            return {
                hasErr: false,
                content: '',
                userId: localStorage.userId || '',
                authorTxt: '<br/><br/><a class="form" href="https://github.com/shinygang/Vue-cnodejs">二次开发的 webapp-cnodejs-vue</a>',
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
        ready (){
            var _self = this;
            if( _self.replyTo ){
                _self.content = '@' + _self.replyTo + ' ';
            }
        },
        methods:{
            addReply (){

                let _self = this;
                if( !_self.content ){
                    _self.hasErr = true;
                }else{
                    let time = new Date(),
                        linkUsers = utils.linkUsers(_self.content), 
                        htmlText = markdown.toHTML(linkUsers) + _self.authorTxt, 
                        reply_content = $('<div class="markdown-text"></div>').append(htmlText)[0].outerHTML, 
                        postData = { accesstoken: localStorage.token, content: _self.content + _self.authorTxt }

                    if( _self.replyId ){
                        postData.reply_id = _self.replyId;
                    }

                    _self.$http.post('https://cnodejs.org/api/v1/topic/' + _self.topicId + '/replies', postData).then((response) => {
                        var res = response.body
                        if(res.success){
                            // 由于topic.sync双向绑定，提交成功后把评论添加到topic.vue的topic数组里，实现了不刷新立刻显示新评论
                            _self.topic.replies.push({
                                author: {
                                    loginname: _self.userId,
                                    avatar_url: localStorage.avatar_url
                                },
                                content: reply_content,
                                create_at: time,
                                id: res.reply_id,
                                reply_id: null,
                                ups: [],
                            });
                        }
                        _self.content = '';

                        // 执行父组件的close事件，close事件触发hideItemReply()，该函数是设置curReplyId为空。
                        // :show="curReplyId"   v-if="curReplyId === item.id"
                        // 当curReplyId为空， 此时v-if为false， 回复框不显示
                        if (_self.show) {
                            // _self.show = '';
                            _self.$emit('close');
                        }
                    }).catch(response => {
                        var error = response.body
                        _self.alert.txt = error.error_msg;
                        _self.alert.show = true;
                        _self.alert.hideFn();
                    })
                }
            }
        }
    }
</script>

<style lang="sass" scoped>
.err {
    border: solid 1px red;
}
</style>