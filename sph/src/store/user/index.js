import { reqGetCode, reqUserInfo, reqUserRegister, reqLogout } from "@/api"
import { setToken, getToken, removeToken } from "@/utils/token"

const state = {
    code: '',
    token: getToken(),
    userInfo: {}
}

const actions = {
    //获取手机验证码
    async getCode({commit},phone){
        let result = await reqGetCode(phone)
        if(result.code == 200){
            commit('GETCODE',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    },

    //注册
    async userRegister({commit},user){
        let result = await reqUserRegister(user)
        if(result.code == 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    },

    //登录
    async userLogin({commit},data){
        let result = await reqUserLogin(data)
        //服务器下发token，用户唯一标识符
        //将来经常通过带token找服务器要用户信息进行展示
        if(result.code == 200){
            //用户已经登录·成功且获取到token
            commit('USERLOGIN',result.data.token)
            //持久化存储token
            setToken(result.data.token)
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    },
    
    //获取用户信息
    async getUserInfo({commit}){
        let result = await reqUserInfo()
        if(result.code == 200){
            commit('GETUSERINFO',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    },

    //退出登录
    async userLogout({commit}){
        //只是向服务器发起一次请求，通知服务器清除token
        let result = await reqLogout()
        if(result.code == 200){
            commit('CLEAR')
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    }
}

const mutations = {
    GETCODE(state,code){
        state.code = code
    },

    USERLOGIN(state,token){
        state.token = token
    },

    GETUSERINFO(state,userInfo){
        state.userInfo = userInfo
    },

    //清除本地数据
    CLEAR(state){
        //把仓库中用户信息清空
        state.code = ''
        state.userInfo = {}
        //本地存储数据清空
        removeToken()
    }
}

const getters = {

}

export default {
    state,
    actions,
    mutations,
    getters
}