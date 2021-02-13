<template>
<div id="indexMain" class="center">
    <div class="main-contain">
        <Card class="contain-card">
            <div style="text-align:center">
                <img src="../assets/imgs/tag.png" class="contain-card-image">
                <h3>软件工程方法学习笔记</h3>
            </div>
        </Card>
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
    name: 'indexMain',
}
</script>

<style scoped>
#indexMain{
    height: 100vh;
    background: #fff;
}
.main-contain{
    height: 90%;
    color:#515a6e;
    display:flex;
}
.contain-card{
    width: 25%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    align-self:center;
}
.contain-card-image{
    width: 25%;
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
    color: #999;
}

div a{
    color: #999;
}

div a:hover{
    color: #000;
}

.foot-item{
        color: #999;
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
