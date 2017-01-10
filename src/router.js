/**
 * Created by aresn on 16/8/22.
 */
const routers = {
    '/':{				//首页
        name:'home',
        component: function(resolve){
            require(['./views/index.vue'],resolve);
        }
    },
    /* 404路由 */
    '*': {
        component: function(resolve){
            require(['./views/index.vue'],resolve);
        }
    },
    '/cnodevue':{               //首页
        name:'home',
        component: function(resolve){
            require(['./views/index.vue'],resolve);
        }
    },
    '/list':{               //首页
        name:'list',
        component: function(resolve){
            require(['./views/list.vue'],resolve);
        }
    },
    '/topic/:id':{               //专题
        name:'topic',
        component: function(resolve){
            require(['./views/topic.vue'],resolve);
        }
    },
    '/add':{               //发布
        name:'add',
        component: function(resolve){
            require(['./views/new.vue'],resolve);
        },
        // 自定义字段，判断登陆状态
        auth: true
    },
    '/message':{               //消息
        name:'message',
        component: function(resolve){
            require(['./views/message.vue'],resolve);
        },
        // 自定义字段，判断登陆状态
        auth: true
    },
    '/about':{               //关于
        name:'about',
        component: function(resolve){
            require(['./views/about.vue'],resolve);
        }
    },
    '/login':{               //登录
        name:'login',
        component: function(resolve){
            require(['./views/login.vue'],resolve);
        }
    },
    '/user/:loginname':{               //用户信息
        name:'user',
        component: function(resolve){
            require(['./views/user.vue'],resolve);
        }
    }
};
export default routers;