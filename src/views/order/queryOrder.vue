<template>
  <div style="padding: 10px; overflow: scroll; max-height: calc(100vh - 88px)">
    <div style="background: #fff; border-radius: 8px; padding: 20px">
    <div class="query-c">
      <div>
        查询订单：
        <Input
          search
          @on-search="search"
          v-model="searchContent"
          style="width: auto"
        >
          <Select v-model="searchType" slot="prepend" style="width: 150px">
            <Option
              v-for="item in searchTypeList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </Input>
      </div>
      <Button
        type="primary"
        :loading="tableDataLoading"
        @click="search"
        class="refresh-btn"
      >
        <span v-if="!tableDataLoading">刷新</span>
        <span v-else>Loading...</span>
      </Button>
    </div>
          <br />

    <Table
      size="small"
      border
      :loading="tableDataLoading"
      :columns="columns"
      :data="ordersDisplayed"
    ></Table>
  </div>
</div>

</template>

<script>
import { isNumber } from '../../utils/getInfo';
import { get } from "@/api";
import { getTimeFromUnix } from "../../utils/getInfo";

export default {
  name: "queryOrder",
  data() {
    return {
      searchContent: "",
      searchType: "id",
      searchTypeList: [
        {
          value: "id",
          label: "根据订单id查询",
        },
        {
          value: "userId",
          label: "根据下单用户id查询",
        },
        {
          value: "merchantId",
          label: "根据商家id查询",
        },
      ],
      tableDataLoading: false,
      ordersDisplayed: [],
      columns: [
        {
          title: "订单",
          key: "orderAvatarUrl",
          resizable: true,
          width: 120,
          render: (h, params) =>
            h("div", {style:{textAlign: 'center'}},[
              h(
                "img", {
                  attrs: {
                    src: params.row.orderAvatarUrl
                  },
                  style: {
                    width: "64px",
                    verticalAlign: "middle"
                  },
                }
              ),
            ]),
        },
        {
          title: "订单ID",
          key: "orderId",
          resizable: true,
          width: 120,
        },
        {
          title: "订单名",
          key: "orderName",
          resizable: true,
          width: 120,
        },
        {
            title: "订单联系方式",
          key: "orderContact",
          resizable: true,
          width: 120,
        },
        {
          title: "订单认证状态",
          key: "orderCertificateState",
          resizable: true,
          width: 120,
        },
        {
          title: "订单状态",
          key: "orderStatus",
          resizable: true,
          width: 120,
          render: (h, params) =>
            h("div", [
              h(
                "strong", params.row.orderStatus === 0 ? '正常' : '被平台封禁'
              ),
            ]),
        },
        {
            title: "订单地点",
            key: "orderSite",
            resizable: true,
            width: 240,
        },
        {
          title: "订单入驻时间",
          key: "registerTime",
          resizable: true,
          width: 240,
          render: (h, params) =>
            h("div", [
              h(
                "strong", getTimeFromUnix(params.row.registerTime)
              ),
            ]),
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 200,
          align: "center",
          render: (h, params) =>
            h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.activateOrderById(params.row.orderId, params.row);
                    },
                  },
                },
                "解禁"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.rowIndex = params.index;
                      this.deactivateOrderById(params.row.orderId, params.row);
                    },
                  },
                },
                "封禁"
              ),
            ]),
        },
      ],
    };
  },
  methods: {
    search() {
      let self = this
      this.tableDataLoading = true
      if (this.searchType == "id") {
        if(!isNumber(this.searchContent)) return
        get("/order/queryOrderById", {
          params: { orderId: this.searchContent },
        })
          .then((res) => {
            console.log(res);
            self.ordersDisplayed = [res];
            self.tableDataLoading = false;
          })
          .catch((error) => {
            console.log("查询失败");
            self.tableDataLoading = false;
          });
      }
      if (this.searchType == "name") {

      }
    },
    activateOrderById(id, row) {
        let self = this
        get("/order/activate", {
          params: { orderId: id },
        })
          .then((res) => {
            self.$Notice.success({
                title: "操作成功",
            });
            row.orderStatus = 0
          })
          .catch((error) => {
            console.log("error:", error);
            self.$Notice.error({
                title: "操作失败",
            });
          });
    },
    deactivateOrderById(id, row) {
        let self = this
        get("/order/deactivate", {
          params: { orderId: id },
        })
          .then((res) => {
            self.$Notice.success({
                title: "操作成功",
            });
            row.orderStatus = 1
          })
          .catch((error) => {
            console.log("error:", error);
            self.$Notice.error({
                title: "操作失败",
            });
          });
    },
  },
};
</script>

<style scoped>
</style>
