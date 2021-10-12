<template>
  <div
    class="tree_select_box row-flex-start"
    @click="optionBoxVisble = !optionBoxVisble"
  >
    <Icon
      type="ios-arrow-down"
      class="arrow_icon"
      :style="{
        transform: optionBoxVisble
          ? 'rotate(' + 180 + 'deg)'
          : 'rotate(' + 0 + 'deg)',
      }"
    />
    <transition name="slide">
      <div class="triangle_up" v-if="optionBoxVisble"></div>
    </transition>
    <transition name="slide">
      <div
        class="option_box column-start-center"
        :style="{ paddingBottom: operateVisiable ? '60px' : '0px' }"
        v-if="optionBoxVisble"
        @click.stop
      >
        <div class="option_wrapper">
          <template v-for="(item, index) in options">
            <div
              class="tree_option_banner nowrap"
              :key="index"
              @click.stop="optionClick(item)"
            >
              <div class="expand_icon_wrapper c_c" v-if="item.children">
                <Icon
                  type="ios-arrow-down"
                  class="expand_icon"
                  :style="{
                    transform: item.expand
                      ? 'rotate(' + 0 + 'deg)'
                      : 'rotate(' + 270 + 'deg)',
                  }"
                />
              </div>
              {{ item.label }}
            </div>
            <template v-if="item.expand && item.children">
              <div
                class="tree_option_banner nowrap"
                style="color: #606764"
                v-for="(it, i) in item.children"
                @click.stop="optionClick(it)"
                :class="{
                  last_option_banner: i === item.children.length - 1,
                }"
                :key="it.label"
              >
                {{ it.label }}
              </div>
            </template>
          </template>
        </div>
        <!-- 是否显示操作框 -->
        <div class="operate_banner row-space-between" v-if="operateVisiable">
          <div class="row-flex-start">
            <Button class="operete_but c_c c_border">新建</Button>
            <Button class="operete_but c_c c_border">删除</Button>
          </div>
          <Button type="primary" class="operete_but">保存</Button>
        </div>
      </div>
    </transition>
    {{ val }}
  </div>
</template>
<script>
export default {
  props: {
    // 监听值
    value: {
      type: String,
    },
    // 下拉项列表
    optionList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //是否需要全部节点，默认只需要叶子节点
    needFullNode: {
      type: Boolean,
      default: false,
    },
    // 是否展示操作栏
    operateVisiable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    options() {
      return this.optionList.map((x) => {
        if (x.children) this.$set(x, "expand", false);
        return x;
      });
    },
  },
  data() {
    return {
      val: this.value,
      optionBoxVisble: false,
      nodes: [],
    };
  },
  // 手动双向绑定
  watch: {
    value(n, o) {
      this.val = n;
    },
  },
  methods: {
    optionClick(s) {
      s.expand = !s.expand;
      if (s.children) return;
      // 修改外部组件监听数据
      this.optionBoxVisble = false;

      if (this.needFullNode) {
        this.nodes = [];
        this.getFullNode(this.optionList, s.id);
        console.log(this.nodes);
        this.$emit("change", this.nodes); //传递根到叶子节点的路径上所有节点的值
      } else {
        this.$emit("change", s.value); //传递叶子结点的值
      }
    },
    getFullNode(children, id) {
      if (!this.needFullNode) return;
      for (let index = 0; index < children.length; index++) {
        const item = children[index];
        this.nodes = this.nodes.concat(item.label);
        if (item.children) {
          if (this.getFullNode(item.children, id)) return true;
        } else {
          if (item.id === id) {
            return true;
          }
        }
        this.nodes.pop();
      }
      return false;
    },
  },
};
</script>
<style lang="scss" scoped>
.tree_select_box {
  position: relative;
  height: 34px;
  cursor: pointer;
  color: #606764;
  padding-left: 6px;
  // width: 100%;
  width: 160px;
  border-radius: 4px;
  border: 1px solid rgba(236, 236, 236, 1);
  background: #fff;
  max-width: 650px;
  .arrow_icon {
    position: absolute;
    transform-origin: center center;
    transition: transform 0.2s;
    right: 15px;
    top: calc(50% - 7px);
  }

  .triangle_up {
    width: 0;
    height: 0;
    position: absolute;
    top: calc(100% + 4px);
    left: 30px;
    z-index: 2009;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #fff;
    border-top-width: 0;
    border-bottom-color: #e8e8e8;
  }
  .triangle_up::after {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 1px;
    left: -7px;
    z-index: 2010;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid #fff;
    border-top-width: 0;
  }

  .option_box {
    position: absolute;
    z-index: 2000;
    padding: 10px 0px;
    top: calc(100% + 10px);
    left: 0px;
    background: #fff;
    width: 100%;
    border-radius: 4px;
    min-height: 50px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(232, 232, 232, 1);
    // padding-bottom: 60px;
    .tree_option_banner {
      font-size: 14px;
      // z-index: 2002;
      color: #999999;
      position: relative;
      width: 100%;
      height: 34px;
      padding: 6px 0px 6px 20px;
    }
    .option_wrapper {
      width: 100%;
      overflow-y: auto;
      flex: 1;
    }
    .operate_banner {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 2002;
      padding: 0 14px;
      background: #fff;
      height: 60px;
      .operete_but {
        width: 60px;
        height: 32px;
      }
    }
    .last_option_banner {
      margin-bottom: 8px;
    }
    .last_option_banner::after {
      content: "";
      position: absolute;
      width: calc(100% - 40px);
      bottom: 0px;
      height: 1px;
      background: #e8e8e8;
      right: 20px;
    }
    .tree_option_banner:hover {
      background: #f5f7fa;
    }
    .expand_icon_wrapper {
      position: absolute;
      z-index: 2003;
      font-size: 12px;
      transform: scale(0.75);
      left: 5px;
      top: 7px;
      .expand_icon {
        font-weight: bold;
        transform-origin: center center;
        transition: transform 0.3s;
      }
    }
  }

  @keyframes slideShow {
    from {
      top: 0px;
    }
    to {
      top: calc(100% + 10px);
    }
  }
  @keyframes slideHide {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0);
    }
  }
  .slide-enter-active {
    animation: slideShow 0.2s;
  }
  .slide-leave-active {
    animation: slideHide 0.2s;
  }
}
</style>

