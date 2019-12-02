function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// 提示弹框
const Toast = (msg) => {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 3000
  })
}

// 加载按钮
const Loading = () => {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  // 超时关闭
  setTimeout(() => {
    CloseLoading()
  }, 5000)
}

// 关闭加载按钮
const closeLoading = () => {
  setTimeout(function () {
    wx.hideLoading()
  }, 1000)
}

const dateFormat = (format, time) => {
  let dt = new Date();
  if (time) {
    if (typeof time !== 'number') {
      time = time.toString().replace(/-/g, '/')
    }
    dt = new Date(time);
  }
  var date = {
    "M+": dt.getMonth() + 1,
    "d+": dt.getDate(),
    "h+": dt.getHours(),
    "m+": dt.getMinutes(),
    "s+": dt.getSeconds(),
    "q+": Math.floor((dt.getMonth() + 3) / 3),
    "S+": dt.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length))
    }
  }
  return format
}

// 微信授权
function wxLogin (e) {
  return new Promise((resolve) => {
    wx.login({
      success (res) {
        thirdPartLogin(e, res.code).then(data => {
          console.log('wxLogin***===', data)
          if (data == 'false') { // 获取手机号失败
            resolve('false')
          } else {
            resolve(data)
          }
        })
      },
      failed (res) {
        console.log("failed: " + JSON.stringify(res))
      },
      complete (res) {
        console.log("complete: " + JSON.stringify(res))
      }
    })
  })
}

// 微信登录
function Login() {
  return new Promise((resolve) => {
    wx.login({
      // 登录成功
      complete (res) {
        if (res.code) {
          // 将code存放在缓存中
          wx.setStorageSync('wxCode', res.code)
          // 获取uniocode
          api.getSessionInfo({
            appType: Vue.$APP_ID,
            code: wx.getStorageSync('wxCode')
          }).then(data => {
            console.log('session===>', JSON.stringify(data))
            let result = JSON.parse(data.obj)
            if (result.unionid) {
              // 根据unionid登录
              wx.setStorageSync(Vue.$KEY_UNION_ID, result.unionid)
              wx.setStorageSync(Vue.$KEY_OPEN_ID, result.openid)
              queryByThirdPartyUid(result.unionid, false).then(result => {
                resolve(result)
              })
            }
          })
        } else {
          resolve(false)
        }
      }
    })
  })
}

// 第三方登录
function thirdPartLogin(e, code) {
  return new Promise((resolve) => {
    if (code) {
      // 获取用户信息的授权情况
      wx.setStorageSync('wxInfo', e.mp.detail)
      let params = {
        appType: Vue.$APP_ID,
        code: code,
        encryptedData: e.mp.detail.encryptedData,
        iv: e.mp.detail.iv
      };
      // 获取解密信息接口
      api.getUserInfoByCode(params).then(data => {
        let resData = JSON.parse(data.obj)
        if (resData.data) {
          let openId = resData.data.openId;
          // 要传unionId
          let unionId = resData.data.unionId;
          wx.setStorageSync(Vue.$KEY_UNION_ID, unionId);
          wx.setStorageSync(Vue.$KEY_OPEN_ID, openId);
          // 第三方ID绑定登录
          queryByThirdPartyUid(unionId, true).then(result => {
            if (result) {
              resolve(result)
            } else {
              resolve('false')
            }
          })
        } else {
          console.log('api getUserInfoByCode errmsg==>', resData.errmsg)
          // if (resData.errmsg) {
          //   Toast(resData.errmsg)
          // }
        }
      })
    } else {
      Toast('授权失败')
    }
  })
}


export default {
  formatNumber,
  formatTime
}
