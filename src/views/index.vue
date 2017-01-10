<template>
    <!-- 全局header -->
    <div>
        <img class="index" src="../images/index.png">
    </div>
</template>
<script>
    export default {
        ready (){
            setTimeout(() => {
                this.$route.router.go({ name: 'list'});
            },500);
        }
    }
</script>
<style lang="sass">
    .index{
        width: 100%;
        background-color: #fff;
        margin-top: 40%;
    }
</style>

