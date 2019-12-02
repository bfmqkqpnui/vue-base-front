import request from './request'
import constant from '@/constant/config'

const platform = 'mp'
const middleWare = constant.Config.netType === 'prd' ? 'https://mh5.bl.com/h5_gateway' : 'https://mh5.st.bl.com/h5_gateway'
const baseUrlApi = (platform === 'h5') ? '/api' : middleWare

export default {
  // 查询按钮信息
  btnKey: (r) => request.post('/dict/list.htm', r, {
    baseURL: baseUrlApi
  }),
}
