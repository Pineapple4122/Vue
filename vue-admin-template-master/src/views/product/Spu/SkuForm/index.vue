<template>
  <div>
      <el-form :model="form" label-width="80px">
          <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
          <el-form-item label="SKU名称">
              <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
          </el-form-item>
          <el-form-item label="价格(元)">
              <el-input type="number" v-model="skuInfo.price" placeholder="价格(元)"></el-input>
          </el-form-item>
          <el-form-item label="重量(千克)">
              <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
          </el-form-item>
          <el-form-item label="规格描述">
          <el-input type="textarea" v-model="skuInfo.skuDesc" placeholder="规格描述"></el-input>
          </el-form-item>
          <el-form-item label="平台属性">
              <el-form :inline="true" :model="form" label-width="80px">
                  <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
                      <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
                          <el-option :value="`${attr.id}:${attrValue.id}`" :label="attrValue.valueName" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
                      </el-select>
                  </el-form-item>
              </el-form>
          </el-form-item>
          <el-form-item label="销售属性">
              <el-form :inline="true" :model="form" label-width="80px">
                  <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
                      <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
                          <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.saleAttrValueList" :key="saleAttrValue.id"></el-option>
                      </el-select>
                  </el-form-item>
              </el-form>
          </el-form-item>
          <el-form-item label="图片列表">
              <el-table :data="spuImageList" style="width: 100%" border @selection-change="handleSelectionChange">
                  <el-table-column type="selection" label="label" width="80px">
                  </el-table-column>
                  <el-table-column prop="prop" label="图片" width="width">
                      <template slot-scope="{row,$index}">
                          <img :src="row.imgUrl" style="width:100px;height:100px">
                      </template>
                  </el-table-column>
                  <el-table-column prop="imgName" label="名称" width="width">
                  </el-table-column>
                  <el-table-column prop="prop" label="操作" width="width">
                      <template slot-scope="{row,$index}">
                          <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
                          <el-button v-else>默认</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
              <el-button @click="cancel">取消</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    name: 'SkuForm',
    data() {
        return {
            spuImageList: [],  //存储图片的信息
            spuSaleAttrList: [],  //存储销售属性
            attrInfoList: [],  //存储平台属性的数据
            //收集sku数据的字段
            skuInfo: {
                //第一类收集的数据：父组件给的数据
                category3Id: 0,
                spuId: 0,
                tmId: 0,
                //第二类：需要通过数据双向绑定v-model收集
                skuName: "",
                price: 0,
                weight: "",
                skuDesc: "",
                //第三类：需要自己书写代码
                //默认图片
                skuDefaultImg: "",
                //收集图片的字段
                skuImageList: [
                // {
                //   id: 0,
                //   imgName: "string",
                //   imgUrl: "string",
                //   isDefault: "string",
                //   skuId: 0,
                //   spuImgId: 0,
                // },
                ],
                //平台属性
                skuAttrValueList: [
                // {
                //   attrId: 0,
                //   valueId: 0,
                // },
                ],
                //销售属性
                skuSaleAttrValueList: [
                // {
                //   id: 0,
                //   saleAttrId: 0,
                //   saleAttrName: "string",
                //   saleAttrValueId: 0,
                //   saleAttrValueName: "string",
                //   skuId: 0,
                //   spuId: 0,
                // },
                ],
            },
            spu:{},
            //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
            imageList:[]
        }
    },

    methods: {
        //获取sku列表数据
        async getData(category1Id,category2Id,spu){
            //收集父组件传递的数据
            this.skuInfo.category3Id = spu.category3Id
            this.skuInfo.spuId = spu.id
            this.skuInfo.tmId = spu.tmId
            this.spu = spu
            //发请求获取数据
            let result = await this.$API.spu.reqSpuImageList(spu.id)
            if(result.code === 200){
                //服务器返回的数据没有isDefault，需要加上
                let list = result.data
                list.forEach(item => {
                    item.isDefault = 0
                });
                this.spuImageList = list
            }
            let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
            if(result1.code === 200){
                this.spuSaleAttrList = result1.data
            }
            let result2 = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id)
            if(result2.code === 200){
                this.attrInfoList = result2.data
            }
        },
        //table表格复选框按钮的回调
        handleSelectionChange(params){
            //params就是选中的每一行图片数据
            this.imageList = params
        },
        //设置默认图片（排他）
        changeDefault(row){
            this.spuImageList.forEach(item => {
                item.isDefault = 0
            })
            row.isDefault = 1
            //收集默认图片的地址
            this.skuInfo.skuDefaultImg = row.imgUrl
        },
        //取消按钮
        cancel(){
            this.$emit('changeScenes',0)
            Object.assign(this._data,this.$options.data())
        },
        //保存按钮
       async save(){
            const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this
            //整理参数
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item) => {
                if(item.attrIdAndValueId){
                    const [attrId,valueId] = item.attrIdAndValueId.split(':')
                    prev.push({attrId,valueId})
                }
                return prev
            },[])
            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
                if(item.attrIdAndValueId){
                    const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':')
                    prev.push({saleAttrId,saleAttrValueId})
                }
                return prev
            },[])
            skuInfo.skuImageList = imageList.map(item => {
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id
                }
            })
            //发请求
            let result = await this.$API.spu.reqAddSku(skuInfo)
            if(result.code === 200){
                this.$message({type:'success',message:'添加SKU成功'})
                this.$emit('changeScenes',0)
            }
        }
    },
}
</script>

<style>

</style>