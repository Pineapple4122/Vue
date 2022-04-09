import Mock from "mockjs"

//引入json数据，webpack默认对外暴露图片和json格式数据
import banner from './banner.json'
import floor from './floor.json'

//第一个参数是需要拦截的URL,第二个参数是数据模板。mock可根据数据模板生成模拟数据
Mock.mock('/mock/banner',{code:200,data:banner})
Mock.mock('/mock/floor',{code:200,data:floor})