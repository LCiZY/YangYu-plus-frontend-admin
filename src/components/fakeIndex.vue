<template>
<div id="fakeIndex" class="center">
    <div style="height: 90%">
        首页
    </div>
    <div class="foot">
        <div class="foot-item">互联网ICP备案：
             <a href="http://beian.miit.gov.cn">
               粤ICP备2021017347号
            </a>
        </div>
        <div class="foot-item"><i class="sprite"></i><a>安备 号 </a></div>
    </div>
</div>
</template>

<script>
export default {
    name: 'fadeIndex.vue',
}
</script>

<style scoped>
#fakeIndex{
    height: 100vh;
    background: #409eff;
}
.center {
    height: 100%;
    display: block;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-align: center;
}
.foot{
    width: 100vw;
    height: 10%;
    background: #ffffff22;
    display:inline-block;
    align-items: center;
    vertical-align: middle;
    color: #fff;
}

div a{
    color: #fff;
}

div a:hover{
    color: #e5f3ff;
}

.foot-item{
}
.sprite{
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-font-smoothing: antialiased;
    font: 12px "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
    color: #999;
    line-height: 24px;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    display: inline-block;
    background-image: url(//s1.hdslb.com/bfs/seed/jinkela/footer-v2/images/hz_icon.png);
    background-repeat: no-repeat;
    vertical-align: middle;
    margin-right: 3px;
    width: 18px;
    height: 20px;
    background-position: -41px 0px;
}
</style>
