<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form
        ref="searchFormRef"
        :model="orderInfo"
        label-suffix=":"
        label-position="left"
        :label-width="80"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单编号" prop="carName">
              {{ orderInfo.orderNo }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态" prop="carName">
              待支付
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单来源" prop="carName">
              小程序端
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="买家名称" prop="carName"> L </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="买家电话" prop="carName">
              131****1111
              <span class="ml-3px link">查看</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出行人数" prop="carName"> 1 </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付方式" prop="carName"> - </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付时间" prop="carName"> - </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单时间" prop="carName">
              2023-03-14 16:38
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票信息" prop="carName">
              暂无发票信息
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="mb-10px" shadow="never">
      <div class="info-wrap">
        <div class="title-wrap">路线信息</div>
        <div class="content-wrap">
          <table class="info-table">
            <colgroup>
              <col style="width: 8%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
            </colgroup>
            <thead>
              <tr>
                <th>路线主图</th>
                <th>路线名称</th>
                <th>路线描述</th>
                <th>出行时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <el-image
                    src="https://imgcache.dealmoon.com/thumbimg.dealmoon.com/dealmoon/f45/d74/022/f7246d0ba033a4b6e4ee6ed.jpg_1280_1280_3_964e.jpg"
                  ></el-image>
                </td>
                <td>
                  <span>雪山房车之旅 体验大自然 享受自由冒险</span>
                </td>
                <td>
                  <span
                    >在房车之旅中，您可以进行各种户外活动，如徒步旅行、滑雪、钓
                    鱼、皮划艇等。亲身体验大自然的魅力，享受一次自由的冒险之旅。</span
                  >
                </td>
                <td>
                  <span>2023-03-18 10:00～11:30</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="info-wrap">
        <div class="title-wrap">车辆信息</div>
        <div class="content-wrap">
          <table class="info-table">
            <colgroup>
              <col style="width: 8%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
            </colgroup>
            <thead>
              <tr>
                <th>车辆主图</th>
                <th>车辆名称</th>
                <th>车辆描述</th>
                <th>车牌号码</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <el-image
                    src="https://p26.toutiaoimg.com/origin/motor-img/1a5d02003fa8464e94c0c4070c04757c?from=pc"
                  ></el-image>
                </td>
                <td>
                  <span>飞翔铁C PLUS房车</span>
                </td>
                <td>
                  <span>飞翔铁C PLUS房车 </span>
                </td>
                <td>
                  <span>粤A 3R123</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="info-wrap">
        <div class="title-wrap">乘车人信息</div>
        <div class="content-wrap">
          <table class="info-table">
            <colgroup>
              <col style="width: 8%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
            </colgroup>
            <thead>
              <tr>
                <th>姓名</th>
                <th>证件类型</th>
                <th>证件号码</th>
                <th>手机号码</th>
                <th>座位名称</th>
                <th>座位描述</th>
                <th>选座情况</th>
                <th>核销二维码</th>
                <th>单价(元)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> 李浩辉 </td>
                <td>
                  <span>身份证</span>
                </td>
                <td>
                  <span>4466**********3333</span>
                  <span class="ml-3px link">查看</span>
                </td>
                <td>
                  <span>131****1111</span>
                  <span class="ml-3px link">查看</span>
                </td>
                <td>
                  <span>一等座</span>
                </td>
                <td>
                  <span>非常舒服的座位</span>
                </td>
                <td>
                  <span class="link">点击查看</span>
                </td>
                <td>
                  <span class="link">点击查看</span>
                </td>
                <td>
                  <span>88.88</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="price-wrap">
        <span class="mr-3px">总金额:</span>
        <span class="price">88.88</span>
        <span class="ml-3px">元</span>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
const orderInfo = ref({
  orderId: 100,
  orderNo: 'O202303141635475492190617601',
  status: 0,
  price: '88.88',
  payPrice: '-',
  routeName: '雪山房车之旅 体验大自然 享受自由冒险',
  tripTime: '2023-03-18 10:00~11:30',
  createTime: new Date()
});
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0px;
}
.info-wrap {
  .title-wrap {
    display: flex;
    align-items: center;
    height: 24px;
    &::before {
      content: ' ';
      margin-right: 5px;
      width: 2px;
      height: 18px;
      background-color: #1975ff;
      transform: translateY(1px);
    }
  }
  .content-wrap {
    margin-top: 10px;
  }
  .info-table {
    margin-bottom: 20px;
    width: 100%;
    font-size: 12px;
    border-spacing: 0;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    thead {
      background-color: #f7f8fa;
    }
    // tr {
    //   line-height: 22px;
    // }
    th {
      color: rgba(0, 0, 0, 0.8);
      font-weight: 400;
      text-align: left;
      border-right: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
    }

    th,
    td {
      padding: 9px 12px;
    }
    td {
      border-right: 1px solid #ebebeb;
    }
  }
}

.price-wrap {
  font-size: 14px;
  text-align: right;
  .price {
    // font-size: 42px;
    font-size: 16px;
    font-weight: bold;
  }
}

</style>
