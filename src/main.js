/**
 * Created by aresn on 16/6/20.
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
import filters from './filters/filters';
import Routers from './router';
import FastClick from 'fastclick';

import App from './app';
import Env from './config/env';

// let App = Vue.extend({});

//Resource
Vue.use(VueResource);

//可以让浏览器不发送OPTIONS预请求
Vue.http.options.emulateJSON = true


Vue.use(VueRouter);

// 强制跨域请求
$.ajaxSettings.crossDomain = true;

// 开启debug模式
Vue.config.debug = true;

// 实例化Vue的filter
// views里大部分组件均用上了过滤器，所以直接全局注册
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
console.log(filters)

// 路由配置
let router = new VueRouter({
    // 是否开启History模式的路由,默认开发环境开启,生产环境不开启。如果生产环境的服务端没有进行相关配置,请慎用
    // history: Env != 'production',
    hashbang: true,
    // history: true,
    // saveScrollPosition: true,
    transitionOnLoad: true
});

router.map(Routers);

// fastclick => 消除点击300ms延迟
FastClick.attach(document.body);

// router.beforeEach(() => {
//     window.scrollTo(0, 0);
// });

//登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((transition) => {
    // 调整后使页面保持在最上方
	window.scrollTo(0, 0);
	
    // 处理左侧滚动不影响右边
    $("html, body, #page").removeClass("scroll-hide");

    // 判断路由中是否有 自定义字段auth 
    if (transition.to.auth) {
    	console.log(transition.to.auth)
        if (localStorage.userId) {
            // 处理切换过程的下一步
            transition.next();
        } else {
            var redirect = encodeURIComponent(transition.to.path);
            // 取消当前切换并重定向到另一个路由
            // 重定向后把当前的路由路径设置为url参数
            transition.redirect('/login?redirect=' + redirect);
        }
    } else {
        transition.next();
    }
});

router.afterEach(() => {

});

// router.redirect({
//     '*': "/index"
// });
router.start(App, '#app');