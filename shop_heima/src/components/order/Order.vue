<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>订单管理</el-breadcrumb-item>
         <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
         <el-row>
            <el-col :span="8">
               <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable
                  @input="getGoodsList">
                  <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
               </el-input>
            </el-col>
         </el-row>

         <el-table :data="orderList" border stripe >
            <el-table-column type="index" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="90px" align="center">
            </el-table-column>
            <el-table-column prop="pay_status" label="是否付款" width="150px" align="center">
               <template slot-scope="{row}">
                  <el-tag type="success" v-if="row.pay_status==='1'">已付款</el-tag>
                  <el-tag type="danger" v-else>未付款</el-tag>
               </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="90px" align="center">
            </el-table-column>
            <el-table-column prop="create_time" label="下单时间" width="200px" align="center">
               <template slot-scope="{row}">
                  {{row.create_time | dateFormat}}
               </template>
            </el-table-column>
            <el-table-column label="操作" width="180px" align="center">
               <template slot-scope="{row}">
                  <el-button type="primary" icon="el-icon-edit" size="mini"
                   @click="showBox(row.order_id)"></el-button>
                  <el-button type="success" icon="el-icon-location" size="mini"
                   @click="showProgressBox"></el-button>
               </template>
            </el-table-column>
         </el-table>

         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 20, 50]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
         </el-pagination>
      </el-card>

      <el-dialog
         title="修改地址"
         :visible.sync="editDialogVisible"
         width="50%"
         @close="$refs.editFormRef.resetFields()">
         <el-form :model="editForm" label-width="80px" status-icon :rules="editFormRules" ref="editFormRef">
         <el-form-item label="省市区/县" prop="address1">
            <el-cascader
               v-model="editForm.address1"
               :options="cityData"
               :props="{ expandTrigger: 'hover', ...cateProps, checkStrictly:'true' }"
               @change="handleChange" clearable></el-cascader>
         </el-form-item>
         <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editForm.address2"></el-input>
         </el-form-item>
         </el-form>
         <div slot="footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editGoods">确 定</el-button>
         </div>
      </el-dialog>

      <el-dialog title="物流进度" :visible.sync="progressVisible"
         width="50%">
         <el-timeline>
            <el-timeline-item
               v-for="(activity, index) in progressInfo"
               :key="index"
               :timestamp="activity.time">
               {{activity.context}}
            </el-timeline-item>
         </el-timeline>
      </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
   name: 'Order',
   data() {
      return {
         queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 10,
         },
         orderList: [],
         total: 0,
         editDialogVisible: false,
         editForm: {
            address1: [],
            address2: ''
         },
         editFormRules: {
            address1: [{required: true, message:'请选择省市区县', trigger: 'blur'}],
            address2: [{required: true, message:'请填写详细地址', trigger: 'blur'}]
         },
         cityData,
         progressVisible: false,
         progressInfo: [],
      }  
   },
   created() {
      this.getOrderList()
   },
   methods: {
      async getOrderList(){
         const {data:res} = await this.$http.get('orders',{
            params: this.queryInfo
         })
         if(res.meta.status !== 200){
            return this.$message.error('获取订单列表信息失败！')
         }
         this.orderList = res.data.goods
         this.total = res.data.total
      },
      handleSizeChange(newSize){
         this.queryInfo.pagesize = newSize
         this.getOrderList()
      },
      handleCurrentChange(newPage){
         this.queryInfo.pagenum = newPage
         this.getOrderList()
      },
      async showProgressBox(){
         const {data:res} = await this.$http.get('/kuaidi/1106975712662')
         if(res.meta.status !== 200){
            return this.$message.error('获取物流进度失败！')
         }
         this.progressInfo = res.data
         this.progressVisible = true
      }
   },
}
</script>

<style>

</style>