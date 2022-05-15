// 获取品牌管理数据的模块
import request from '@/utils/request'

// 获取当前页品牌列表
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

export const reqAddOrUpdateTradeMark = (trademark)=>{
    if(trademark.id){
        // 参数中有id--->修改品牌
        request({url:'/admin/product/baseTrademark/update',method:'put',data:trademark})
    }else{
        // 没有id--->新增品牌
        request({url:'/admin/product/baseTrademark/add',method:'post',data:trademark})
    }
}

// 删除品牌
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})