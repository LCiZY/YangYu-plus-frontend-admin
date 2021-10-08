import Vue from 'vue'
import axios from 'axios'
import ViewUI from 'view-design'
import App from './App'
import store from './store'
import router from './router'
import 'view-design/dist/styles/iview.css'
import './permission'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'



// import ECharts modules manually to reduce bundle size
import {
    CanvasRenderer
} from 'echarts/renderers'
import {
    BarChart
} from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent
} from 'echarts/components'

use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    TooltipComponent
]);

Vue.component('v-chart', ECharts)

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(Viewer, {
    defaultOptions: {
      zIndex: 9999
    }
})

Vue.prototype.$axios = axios

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})