//平台属性管理模块请求文件
import request from '@/utils/request'

// 获取SPU列表数据的接口
export const reqSpuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

