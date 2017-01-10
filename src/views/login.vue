<template>

    <nv-head page-type="登录" :return-head='true'></nv-head>

    <section class="page-body">
        <div class="label">
            <input class="txt" type="text" placeholder="Access Token" v-model="token" maxlength="36" value="7fc3f08a-ff2c-4e53-b105-f74b03f1f535"/>
        </div>
        <div class="label">
            <a class="button">选择二维码图片</a>
            <input class="file" type="file" id="file_upload" @change="readPic" accept="image/*" capture="camera"/>

            <a class="button" @click="logon">登录</a>
        </div>
    </section>

    <nv-alert :content="alert.txt" :show="alert.show"></nv-alert>

    <nv-loading :show="loading.show" :show-txt="loading.showTxt"></nv-loading>
   
</template>

<script>
    // import {qrcode}  from '../libs/llqrcode'
    import nvHead from '../components/header.vue'
    import nvAlert from '../components/nvAlert.vue'
    import nvLoading from '../components/loading.vue'

    // 判断设备ua
    let browser = {
        versions: function() {
            let u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
            };
        }(),
    }
    export default {
        components:{
            "nv-head":nvHead,
            "nv-alert":nvAlert,
            "nv-loading":nvLoading
        },
        data () {
            let self = this;
            return {
                // 登陆token
                token: '',
                // 控制提示框
                alert: {
                    txt: '',
                    show: false,
                    // 3秒后自动隐藏
                    hideFn:function(){
                        let timer;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            self.alert.show = false;
                        }, 3000);
                    }
                },
                loading:{
                    show:false,
                    showTxt:'二维码识别中'
                }
            }
        },
        methods: {
            logon (){
                let self = this;
                if(self.token == ''){
                    let text = "令牌格式错误,应为36位UUID字符串";
                    self.alert.txt = text;
                    self.alert.show = true;
                    self.alert.hideFn();
                    return false;
                }
                this.$http.post('https://cnodejs.org/api/v1/accesstoken', { accesstoken: self.token }).then((response) => {
                    console.log(response)
                    var res = response.body
                    // 把个人信息永久存储在本地
                    localStorage.loginname = res.loginname;
                    localStorage.avatar_url = res.avatar_url;
                    localStorage.userId = res.id;
                    localStorage.token = self.token;
                    // 根据url的redirect参数重定向，如果没有该参数，则重定向到首页
                    let redirect = decodeURIComponent(self.$route.query.redirect || '/');
                    self.$route.router.go(redirect);
                }).catch(response => {
                    var error = response.data;
                    self.alert.txt = error.error_msg;
                    self.alert.show = true;
                    self.alert.hideFn();
                    return false;
                })
            },
            // 二维码识别
            readPic (e){
                let self = this;
                let file = e.currentTarget.files[0];//  this is my image
                let reader = new FileReader();

                reader.onload = function (e) {
                    let dataURL = reader.result;

                    let param = { "imgurl": dataURL };
                    console.log(param)

                    self.loading.show = true;
                    self.$http.post('http://218.244.138.206:5002/api/qrcode/index.php', param).then((response) => {
                        console.log(response)

                        var $data = JSON.parse(response.body)

                        self.loading.show = false;
                        if( $data.status === 0){
                            self.token = "";
                            self.alert.txt = $data.msg;
                            self.alert.show = true;
                            self.alert.hideFn();
                            return false;
                        }
                        else{
                            self.token = $data.qrtext;
                        }
                    }).catch(response => {
                        console.log(response)
                        self.loading.show = false;
                        self.token = "";
                        self.alert.txt = "二维码识别不成功，请稍稍重试"
                        self.alert.show = true;
                        self.alert.hideFn();
                    })
                    
                }
                reader.readAsDataURL(file);
            },
        }
    }
</script>
<style lang="sass">

.page-body {
    padding: 50px 15px;
    min-height: 400px;
    background: #fff;
    .label{
        display: inline-block;
        width: 100%;
        margin-top: 15px;
        position: relative;
        left: 0;
        top: 0;

        .txt{
            padding: 12px 0;
            border:none;
            border-bottom: 1px solid #4fc08d;
            background-color: transparent;
            width: 100%;
            font-size: 14px;
            color: #313131;
        }
        .button {
            display: inline-block;
            width: 48%;
            height: 42px;
            line-height: 42px;
            border-radius: 3px;
            color: #fff;
            font-size: 16px;
            background-color: #4fc08d;
            border: none;
            border-bottom: 2px solid #3aa373;
            text-align: center;
            vertical-align: middle;
        }
        .button:first-child{
            margin-right: 2%;
        }
        .file{
            position: absolute;
            top: 0;
            left: 0;
            height: 42px;
            width: 48%;
            outline: medium none;
            filter:alpha(opacity=0);
            -moz-opacity:0;
            opacity:0;
        }
    }
}
</style>