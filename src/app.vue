<style lang="sass">
@import './styles/scss/iconfont/iconfont.css';
// @import './styles/scss/CV.scss';
@import './styles/scss/github-markdown.css';
    .fade-transition {
        transition: opacity .3s ease;
    }
    .fade-enter, .fade-leave {
        opacity: 0;
    }
</style>

<template>
    <div>
        <!-- <router-view keep-alive></router-view> -->
        <router-view></router-view>
    </div>
</template>

<script>
// require('./styles/scss/iconfont/iconfont.css');
require('./styles/scss/CV.scss');
// require('./styles/scss/github-markdown.css');
module.exports = {
    
}
</script>