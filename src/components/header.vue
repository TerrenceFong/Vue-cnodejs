<template>
    <!-- 遮罩 -->
    <div class="page-cover"
            v-if="showMenu&&fixHead"
            @click="showMenus">
    </div>

    <!-- 顶部栏 -->
    <header :class="{ 'show': showMenu&&fixHead, 'fix-header': fixHead, 'no-fix': !fixHead }" id="hd">
        <div class="nv-toolbar">
            <!-- 唤醒左侧菜单按钮 -->
            <div class="toolbar-nav"
                    @click="openMenu"
                    v-if="fixHead">
            </div>

            <!-- 登陆界面返回按钮 -->
            <a class="return-nav" v-if="returnHead" v-link="{path: '/list'}"></a>

            <span v-text="pageType"></span>

            <!-- 显示未读消息 -->
            <i class="num" v-if="messageCount > 0"> {{messageCount}} </i>

            <!-- 发布文章 -->
            <i v-if="needAdd" v-show="!messageCount || messageCount <= 0"
                class="iconfont add-icon" v-link="{name:'add'}">&#xe60f;</i>
        </div>
    </header>

    <!-- 左侧菜单栏 -->
    <nv-menu :show-menu="showMenu" v-if="fixHead" ></nv-menu>
</template>

<script>
    // import utils from '../libs/utils'       //加载公用函数
    import nvMenu from './menu.vue'

    export default {
        components:{
            'nv-menu': nvMenu
        },
        replace:true,
        props: ['pageType', 'fixHead', 'showMenu', 'messageCount', 'needAdd', 'returnHead'],
        data (){
            return {
            }
        },
        methods: {
            openMenu (){
                $("html, body, #page").addClass("scroll-hide");
                $(".outLayer, .add-container").addClass("innerScroll-hide");
                this.showMenu = !this.showMenu;
            },
            showMenus (){
                this.showMenu = !this.showMenu;
                $("html, body, #page").removeClass("scroll-hide");
                $(".outLayer, .add-container").removeClass("innerScroll-hide");
            }
        }
    }
</script>
