<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table :data="attrList" style="width: 100%" border >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin:0px 20px">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table :data="attrInfo.attrValueList" style="width: 100%;margin:20px 0px" border >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowTable: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: '',//属性名
        attrValueList: [ //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId,valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    }
  },

  methods: {
    //自定义事件，获取子组件CategorySelect的分类id
    getCategoryId({categoryId,level}){
      if(level == 1){
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      }else if(level == 2){
        this.category2Id = categoryId
        this.category3Id = ''
      }else{
        this.category3Id = categoryId
        //三级分类都有了才发请求
        this.getAttrList()
      }
    },
    async getAttrList(){
      const {category1Id,category2Id,category3Id} = this
      let result = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id)
      if(result.code == 200){
        this.attrList = result.data
      }
    },
    //添加属性值按钮
    addAttrValue(){
      //向属性值数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //属性的id,注意新增的时候没有值为undefined
        valueName: '', //属性值的名称
        flag: true,  //每个属性值添加一个标记，用于切换属性值的查看模式和编辑模式
      })
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    //添加属性按钮
    addAttr(){
      this.isShowTable=false //切换table显示与隐藏
      //清除数据,收集三级分类的id
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      }
    },
    //修改属性按钮
    updateAttr(row){
      this.isShowTable = false
      //将选中的属性值赋值给attrInfo，row就是attrList数组中的某一个attr
      //这里要用深拷贝，因为包含复杂数据类型，所以{...row}仍然是浅拷贝
      this.attrInfo = cloneDeep(row)
      //修改属性时，给相应属性值添加flag标记
      this.attrInfo.attrValueList.forEach(item => {
        //item.flag = false 不行
        //这里要添加响应式属性，变化时vue才能监测到
        this.$set(item,'flag',false)
      });
    },
    // 切换查看模式，展示span
    toLook(row){
      //属性值不能为空
      if(row.valueName.trim() == ''){
        this.$message('请你输入一个正常的属性值')
        return
      }
      //新增属性值不能与已有重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        //row是新增的属性值，不做判断
        if(row !== item){
          return row.valueName == item.valueName
        }
      })
      if(isRepeat) return
      row.flag = false
    },
    //点击span,切换编辑
    toEdit(row,index){
      row.flag = true
      //this.$refs[index] 为undefined
      //点击span，切换到input，页面需要进行重绘，耗时，不能立马获取到input
      this.$nextTick(()=>{
        this.$refs[index].focus()  //input框实现聚焦
      })
    },
    //气泡弹出框确定按钮
    deleteAttrValue(index){
      //当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 保存按钮
    async addOrUpdateAttr(){
      //整理参数
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        //过滤掉属性值为空的
        if(item.valueName != ''){
          //删除flag标记
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({type:'success',message:'保存成功'})
        this.getAttrList()
      } catch (error) {
        
      }
    }
  },
}
</script>

<style>

</style>