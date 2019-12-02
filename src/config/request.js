import Fly from 'flyio'
import utils from '@/utils'

const fly = new Fly()

fly.interceptors.request.use((request) => {
  request.headers = {
    'content-type': 'application/json',
    // 'chnflg': 'h5'
  }
  console.log('request.url', request.url)
  // request.headers.membertoken = utils.getMemberToken()
  return request
})

fly.interceptors.response.use(
  function (response) {
    // if (response.data.resCode === '00100210' || response.data.resCode === '05111001') {
    //   console.log("token失效，跳转登录页========")
    //   let userInfo = wx.getStorageSync('blUserInfo')
    //   if (userInfo) {
    //     utils.removeUserInfo();
    //   }
    // } else {
      // 添加返回时间
      if (response.headers && response.headers.date) {
        response.data.date = response.headers.date;
      }
      return response.data;
    // }
  },
  function (err) {
    console.log("error-interceptor", err)
  }
)