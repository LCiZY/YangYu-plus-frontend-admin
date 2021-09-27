<template>
    <div id="app">
        <router-view/>
        <div class="global-loading" v-show="isShowLoading">
            <Spin size="large"></Spin>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'App',
    data() {
        return {
            keepAliveData: ['manage'],
        }
    },
    computed: {
        ...mapState([
            'isShowLoading',
        ]),
    },
}
</script>

<style>
body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
li, ul, p, div, body, html, table {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html, body {
    height: 100%;
    overflow: hidden;
}
li {
    list-style: none;
}
#app {
    height: 100%;
    overflow-y: scroll;
}
/* loading */
.global-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255,255,255,.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.ivu-split-trigger.ivu-split-trigger-horizontal {
    height: 0!important;
    border: none!important;
}
.ivu-split-trigger.ivu-split-trigger-vertical {
    width: 0!important;
    border: none!important;
}
#activity .ivu-modal-body{
    padding: 0!important;
}

.query-c {
  display: flex;
  justify-content: space-between;
}
.refresh-btn {
  margin-top: auto;
}
#course > div > div.ivu-table-wrapper.ivu-table-wrapper-with-border > div.ivu-table.ivu-table-small.ivu-table-border > div.ivu-table-body.ivu-table-overflowX > table > tbody > tr.inactive-table-info-row>td {
  /* background: #f3efef!important; */
  color: rgba(40, 40, 40, 0.5)
}
</style>
