<template>
  <div style="padding: 10px; overflow: scroll; max-height: calc(100vh - 88px)">
    <div style="background: #fff; border-radius: 8px; padding: 20px">
      <div class="query-c">
        <div>
          查询商家：
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
        :data="merchantsDisplayed"
      ></Table>
    </div>
  </div>
</template>

<script>
import { isNumber } from "../../utils/getInfo";
import { get } from "@/api";
import { getTimeFromUnix } from "../../utils/getInfo";

export default {
  name: "queryMerchant",
  data() {
    return {
      searchContent: "",
      searchType: "id",
      searchTypeList: [
        {
          value: "id",
          label: "根据商家id查询",
        },
        {
          value: "name",
          label: "根据商家名称查询",
        },
      ],
      tableDataLoading: false,
      merchantsDisplayed: [],
      columns: [
        {
          title: "商家",
          key: "merchantAvatarUrl",
          resizable: true,
          width: 120,
          render: (h, params) =>
            h("div", { style: { textAlign: "center" } }, [
              h("img", {
                attrs: {
                  src: params.row.merchantAvatarUrl,
                },
                style: {
                  width: "64px",
                  verticalAlign: "middle",
                },
              }),
            ]),
        },
        {
          title: "商家ID",
          key: "merchantId",
          resizable: true,
          width: 120,
        },
        {
          title: "商家名",
          key: "merchantName",
          resizable: true,
          width: 120,
        },
        {
          title: "商家联系方式",
          key: "merchantContact",
          resizable: true,
          width: 120,
        },
        {
          title: "商家认证状态",
          key: "merchantCertificateState",
          resizable: true,
          width: 120,
          render: (h, params) =>
            h("div", [
              h(
                "strong",
                params.row.merchantCertificateState === "Y"
                  ? "已认证"
                  : "未认证"
              ),
            ]),
        },
        {
          title: "商家状态",
          key: "merchantStatus",
          resizable: true,
          width: 120,
          render: (h, params) =>
            h("div", [
              h(
                "strong",
                params.row.merchantStatus === 0 ? "正常" : "被平台封禁"
              ),
            ]),
        },
        {
          title: "商家入驻时间",
          key: "registerTime",
          resizable: true,
          width: 240,
          render: (h, params) =>
            h("div", [h("strong", getTimeFromUnix(params.row.registerTime))]),
        },
        {
          title: "商家地点",
          key: "merchantSite",
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
                      this.activateMerchantById(
                        params.row.merchantId,
                        params.row
                      );
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
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.deactivateMerchantById(
                        params.row.merchantId,
                        params.row
                      );
                    },
                  },
                },
                "封禁"
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
                      this.deleteMerchantById(params.row.merchantId);
                    },
                  },
                },
                "删除"
              ),
            ]),
        },
      ],
    };
  },
  methods: {
    search() {
      let self = this;
      this.tableDataLoading = true;
      if (this.searchType == "id") {
        if (!isNumber(this.searchContent)) return;
        get("/merchant/queryMerchantById", {
          params: { merchantId: this.searchContent },
        })
          .then((res) => {
            console.log(res);
            if (res && res != "" && res != "fail") {
              self.merchantsDisplayed = [res];
            } else {
              self.merchantsDisplayed = [];
            }
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
    activateMerchantById(id, row) {
      let self = this;
      get("/merchant/activate", {
        params: { merchantId: id },
      })
        .then((res) => {
          self.$Notice.success({
            title: "操作成功",
          });
          row.merchantStatus = 0;
        })
        .catch((error) => {
          console.log("activateMerchantById failed:", error);
          self.$Notice.error({
            title: "操作失败",
          });
        });
    },
    deactivateMerchantById(id, row) {
      let self = this;
      get("/merchant/deactivate", {
        params: { merchantId: id },
      })
        .then((res) => {
          self.$Notice.success({
            title: "操作成功",
          });
          row.merchantStatus = 1;
        })
        .catch((error) => {
          console.log("deactivateMerchantById failed:", error);
          self.$Notice.error({
            title: "操作失败",
          });
        });
    },
    deleteMerchantById(id) {
      let self = this;
      get("/merchant/delete", {
        params: { merchantId: id },
      })
        .then((res) => {
          if (res && res != "" && res != "fail") {
            self.$Notice.success({
              title: "操作成功",
            });
            self.search();
          }
        })
        .catch((error) => {
          console.log("delete fail:", error);
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
