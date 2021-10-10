<template>
  <div style="padding: 10px; overflow: scroll; max-height: calc(100vh - 88px)">
    <div style="background: #fff; border-radius: 8px; padding: 20px">
      <div>
        <Form
          ref="merchantInfo"
          :model="merchantInfo"
          :rules="merchantValidate"
          :label-width="120"
        >
          <FormItem
            label="商家头像"
            prop="merchantAvatarUrl"
            style="text-align: center"
          >
            <img
              v-show="
                merchantInfo.merchantAvatarUrl &&
                merchantInfo.merchantAvatarUrl != ''
              "
              :src="merchantInfo.merchantAvatarUrl"
              style="width: 20%"
            />
            <Upload
              ref="uploadAvatar"
              action="https://api.mumuzi.site/image/upload"
              name="image"
              :on-success="uploadCoverSuccess"
              :on-remove="handleRemoveCoverPic"
              :show-upload-list="true"
              :on-error="uploadFail"
              :format="['jpg', 'jpeg', 'png']"
            >
              <Button icon="ios-cloud-upload-outline">上传商家头像</Button>
            </Upload>
          </FormItem>
          <FormItem label="商家名" prop="merchantName">
            <Input
              v-model="merchantInfo.merchantName"
              placeholder="输入商家名"
            ></Input>
          </FormItem>
          <FormItem label="手机号" prop="merchantId">
            <Input
              v-model="merchantInfo.merchantId"
              placeholder="输入商家手机号"
            ></Input>
          </FormItem>
          <FormItem label="登录密码" prop="merchantPassword">
            <Input
              v-model="merchantInfo.merchantPassword"
              placeholder="输入商家密码"
            ></Input>
          </FormItem>
          <FormItem label="邮箱" prop="merchantMail">
            <Input
              v-model="merchantInfo.merchantMail"
              placeholder="输入商家邮箱"
            ></Input>
          </FormItem>
          <FormItem label="地点" prop="merchantSite">
            <Input
              v-model="merchantInfo.merchantSite"
              placeholder="商家所在地"
            ></Input>
          </FormItem>
          <FormItem label="联系方式" prop="merchantContact">
            <Input
              v-model="merchantInfo.merchantContact"
              placeholder="输入商家联系方式"
            ></Input>
          </FormItem>
          <FormItem label="认证状态" prop="merchantCertificateState">
            <Select
              v-model="merchantInfo.merchantCertificateState"
              placeholder="选择认证状态"
            >
              <Option value="N">未认证</Option>
              <Option value="Y">已认证</Option>
            </Select>
          </FormItem>
          <FormItem style="text-align: center">
            <Button
              type="primary"
              :loading="submitLoading"
              @click="validateFormAndSubmit()"
            >
              <span v-if="!submitLoading">提交</span>
              <span v-else>Loading...</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from "@/api";
import Vue from "vue";

export default {
  name: "auditMerchant",
  data() {
    return {
      merchantInfo: {
        merchantId: "",
        merchantMail: "",
        merchantPassword: "",
        merchantAvatarUrl: "",
        merchantName: "",
        merchantSite: "",
        merchantContact: "",
        merchantCertificateState: "",
      },
      submitLoading: false,
      merchantValidate: {
        merchantName: [
          { required: true, message: "商家名不能为空", trigger: "blur" },
        ],
        merchantId: [
          { required: true, message: "商家手机号不能为空", trigger: "blur" },
        ],
        merchantPassword: [
          { required: true, message: "商家密码不能为空", trigger: "blur" },
        ],
        merchantMail: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "Incorrect email format", trigger: "blur" },
        ],
        merchantAvatarUrl: [
          { required: true, message: "商家头像不能为空", trigger: "change" },
        ],
        merchantSite: [
          { required: true, message: "商家地点不能为空", trigger: "blur" },
        ],
        merchantContact: [
          { required: true, message: "商家联系方式不能为空", trigger: "blur" },
        ],
        merchantCertificateState: [
          {
            required: true,
            message: "商家认证状态不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    validateFormAndSubmit() {
      let self = this;
      this.$refs["merchantInfo"].validate((valid) => {
        if (valid) {
          let form = new FormData();
          form.append("merchantId", this.merchantInfo.merchantId);
          form.append("merchantMail", this.merchantInfo.merchantMail);
          form.append("merchantPassword", this.merchantInfo.merchantPassword);
          form.append("merchantAvatarUrl", this.merchantInfo.merchantAvatarUrl);
          form.append("merchantName", this.merchantInfo.merchantName);
          form.append("merchantSite", this.merchantInfo.merchantSite);
          form.append("merchantContact", this.merchantInfo.merchantContact);
          form.append(
            "merchantCertificateState",
            this.merchantInfo.merchantCertificateState
          );
          post("/merchant/add", form, {
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then((res) => {
              console.log("新增商家结果:", res);
              if (res && res != "" && res.code == 0) {
                self.$Message.success("提交成功");
              } else {
                self.$Message.error(res.msg);
              }
              self.submitLoading = false;
            })
            .catch((error) => {
              self.$Message.error("提交失败");
              self.submitLoading = false;
            });
        } else {
          this.$Message.error("请检查信息是否填写正确或完整！");
        }
      });
    },
    handleRemoveCoverPic(file, fileList) {
      //删除封面图的回调
      Vue.set(this.merchantInfo, "merchantAvatarUrl", "");
    },
    uploadCoverSuccess(response, file, fileList) {
      //上传封面图成功的回调
      if (this.$refs.uploadAvatar.fileList.length > 1)
        this.$refs.uploadAvatar.fileList.shift(1);
      Vue.set(this.merchantInfo, "merchantAvatarUrl", response);
    },
    uploadFail() {
      this.$Message.error("上传失败");
    },
  },
};
</script>

<style scoped>
</style>
