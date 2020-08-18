import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 判断浏览器类型，强制IE不能操作
  var userAgent = navigator.userAgent
  console.log('userAgent')
  console.log(userAgent)
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
  // var isEdge = userAgent.indexOf('Edge') > -1 && !isIE
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion === 7) {
      Message.error('系统暂不支持IE内核的浏览器访问，请更换为chrome或WIN10 Edge浏览器')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    } else if (fIEVersion === 8) {
      Message.error('系统暂不支持IE内核的浏览器访问，请更换为chrome或WIN10 Edge浏览器')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    } else if (fIEVersion === 9) {
      Message.error('系统暂不支持IE内核的浏览器访问，请更换为chrome或WIN10 Edge浏览器')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    } else if (fIEVersion === 10) {
      Message.error('系统暂不支持IE内核的浏览器访问，请更换为chrome或WIN10 Edge浏览器')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    } else {
      // IE版本<=7
      Message.error('系统暂不支持IE内核的浏览器访问，请更换为chrome或WIN10 Edge浏览器')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  } else if (isIE11) {
    Message.error('系统暂不支持IE内核的浏览器访问，请更换为chrome或WIN10 Edge浏览器')
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          var roles = []
          const { role } = await store.dispatch('user/getInfo')
          if (!hasRoles) {
            if (Array.isArray(role)) {
              roles = roles.concat(role)
            } else {
              roles.push(role)
            }
          }
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log(accessRoutes)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }

      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next({ ...to, replace: true })
      // } else {
      //   try {
      //     // get user info
      //     await store.dispatch('user/getInfo')
      //     next({ ...to, replace: true })
      //   } catch (error) {
      //     // remove token and go to login page to re-login
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
