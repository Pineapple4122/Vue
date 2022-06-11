<template>
  <div>
      <el-form :model="form" label-width="80px">
          <el-form-item label="SPU名称">
              <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
              <el-select v-model="spu.tmId" placeholder="请选择品牌">
                  <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tradeMarkList" :key="tm.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="SPU描述">
          <el-input type="textarea" v-model="spu.description" placeholder="描述"></el-input>
          </el-form-item>
          <el-form-item label="SPU图片">
            <!-- 上传图片
            file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】 -->
            <el-upload
              action="/dev-api/admin/product/fileUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="spuImageList"
              :on-success="handlerSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="销售属性">
            <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
              <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
            <!-- 展示当前spu的销售属性 -->
            <el-table :data="spu.spuSaleAttrList" style="width: 100%" border >
              <el-table-column type="index" label="序号" width="80px" align="center">
              </el-table-column>
              <el-table-column prop="saleAttrName" label="属性名" width="width">
              </el-table-column>
              <el-table-column prop="prop" label="属性值名称列表" width="width">
                <template slot-scope="{row,$index}">
                  <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                    {{tag.saleAttrValueName}}
                  </el-tag>
                  <el-input class="input-new-tag" v-if="row.inputVisible"
                    v-model="row.inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{row,$index}">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    name: 'SpuForm',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            //spu信息的数据
            spu: {
              //三级分类的id
              category3Id: 0,
              //描述
              description: "",
              //spu名称
              spuName: "",
              //平台的id
              tmId: "",
              //收集SPU图片的信息
              spuImageList: [
                // {
                //   id: 0,
                //   imgName: "string",
                //   imgUrl: "string",
                //   spuId: 0,
                // },
              ],
              //平台属性与属性值收集
              spuSaleAttrList: [
                // {
                //   baseSaleAttrId: 0,
                //   id: 0,
                //   saleAttrName: "string",
                //   spuId: 0,
                //   spuSaleAttrValueList: [
                //     {
                //       baseSaleAttrId: 0,
                //       id: 0,
                //       isChecked: "string",
                //       saleAttrName: "string",
                //       saleAttrValueName: "string",
                //       spuId: 0,
                //     },
                //   ],
                // },
              ],
            },
            tradeMarkList: [],  //品牌信息数据
            spuImageList: [],  //spu图片数据
            saleAttrList: [],  //销售属性数据
            attrIdAndAttrName: '',  //收集未选择的销售属性id和名称
        }
    },

    computed: {
      //计算还未选择的销售属性
      unSelectSaleAttr(){
        //整个平台的销售属性一共三个：尺寸、颜色、版本 ----saleAttrList
        //当前SPU拥有的属于自己的销售属性SPU.spuSaleAttrList  ----颜色
        //数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并未返回一个新的数据
        let result = this.saleAttrList.filter((item) => {
          return this.spu.spuSaleAttrList.every((item1) => {
            return item.name != item1.saleAttrName
          })
        })
        return result
      }
    },

    methods: {
      //照片墙删除某一个图片的时候会触发
      handleRemove(file, fileList) {
        //file参数:代表的是删除的那个张图片
        //fileList:照片墙删除某一张图片以后，剩余的其他的图片
        // console.log(file, fileList,22222);
        //收集照片墙图片的数据
        //对于已有的图片【照片墙中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
        //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
        this.spuImageList = fileList;
      },
      //照片墙图片预览的回调
      handlePictureCardPreview(file) {
        //将图片地址赋值给这个属性
        this.dialogImageUrl = file.url;
        //对话框显示
        this.dialogVisible = true;
      },
      //初始化SpuForm数据
      async initSpuData(spu){
        //获取spu信息
        let spuResult = await this.$API.spu.reqSpu(spu.id)
        if(spuResult.code === 200){
          this.spu = spuResult.data
        }
        //获取品牌信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code === 200){
          this.tradeMarkList = tradeMarkResult.data
        }
        //获取spu图片
        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
        if(spuImageResult.code === 200){
          let listArr = spuImageResult.data
          //由于照片墙显示图片的数据中需要有name和url属性，所以把服务器返回的数据进行修改
          listArr.forEach(item => {
            item.name = item.imgName
            item.url = item.imgUrl

          });
          this.spuImageList = listArr
        }
        //获取平台销售属性
        let saleResult = await this.$API.spu.reqBaseSaleAttrList()
        if(saleResult.code === 200){
          this.saleAttrList = saleResult.data
        }
      },
      //照片墙图片上传成功的回调
      handlerSuccess(response,file,fileList){
        this.spuImageList = fileList
      },
      //添加新的销售属性
      addSaleAttr(){
        const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
        let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
        this.spu.spuSaleAttrList.push(newSaleAttr)
        this.attrIdAndAttrName = ''
      },
      //添加新销售属性值的标签按钮点击事件
      addSaleAttrValue(row){
        //点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
        this.$set(row,'inputVisible',true)
        //通过响应式数据inputValue字段收集新增的销售属性值
        this.$set(row,'inputValue','')
      },
      //添加属性值input输入完成的回调
      handleInputConfirm(row){
        //解构出销售属性当中收集数据
        const {baseSaleAttrId,inputValue} = row
        //新增的销售属性值的名称不能为空
        if(inputValue.trim() === ''){
          this.$message('属性值不能为空!')
          return
        }
        //属性值不能重复
        let result = row.spuSaleAttrValueList.some((item) => item.saleAttrValueName == inputValue)
        if(result) return
        let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
        row.spuSaleAttrValueList.push(newSaleAttrValue)
        row.inputVisible = false
      },
      //保存按钮
      async addOrUpdateSpu(){
        //整理参数
        this.spu.spuImageList = this.spuImageList.map(item=>{
          return {
            imgName: item.name,
            imgUrl: (item.response&&item.response.data) || item.url
          }
        })
        //发请求
        let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
        if(result.code === 200){
          this.$message({type:'success',message:'保存成功'})
          //通知父组件回到场景0
          this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'新增'})
        }
        //清除数据
        Object.assign(this._data,this.$options.data())
      },
      // 父组件点击添加按钮回调中调用的函数
      async addSpuData(category3Id){
        this.spu.category3Id = category3Id
        // 获取品牌信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code == 200){
          this.tradeMarkList = tradeMarkResult.data
        }
        // 获取平台全部销售属性信息
        let saleResult = await this.$API.spu.reqBaseSaleAttrList()
        if(saleResult.code == 200){
          this.saleAttrList = saleResult.data
        }
      },
      //取消按钮的回调
      cancel(){
        //取消按钮的回调，通知父亲切换场景为0
        this.$emit("changeScene", { scene: 0, flag: "" });
        //清理数据
        //Object.assign:es6中新增的方法可以合并对象
        //组件实例this._data,可以操作data当中响应式数据
        //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
        Object.assign(this._data, this.$options.data());
      }
    },
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>