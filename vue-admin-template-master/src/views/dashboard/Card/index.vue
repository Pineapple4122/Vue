<template>
   <div>
     <el-row :gutter="10">
        <el-col :span="6">
           <el-card>
              <Detail></Detail>
           </el-card>
        </el-col>
        <el-col :span="6">
           <el-card>
              <Detail></Detail>
           </el-card>
        </el-col>
        <el-col :span="6">
           <el-card>
              <Detail></Detail>
           </el-card>
        </el-col>
        <el-col :span="6">
           <el-card>
              <Detail></Detail>
           </el-card>
        </el-col>
     </el-row>
  </div>
</template>

<script>
import Detail from './Detail'

export default {
   name: 'Card',
   components: {
      Detail
   }
}
</script>

<style>

</style>