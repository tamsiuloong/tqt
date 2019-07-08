import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const params = {
    grant_type:"password",
    username:userName,
    password
  }
  return axios.request({

    url: '/oauth/token',
    params,
    method: 'POST',
    // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
    // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
    auth: {
      username: 'tqt',
      password: 'tqt'
    }
  })
}
export const register = (form) => {
  return axios.request({
    url: '/api/user/register',
    data:form,
    method: 'POST',
    //也不知道为什么，classes.id在服务端获取不到，也不打算浪费时间了。so...
    params:{
      classesId:form.classes.id
    }
  })
}
export const getUserInfo = (token) => {
  return axios.request({
    url: '/api/user/info',
    params: {
      access_token:token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'api/message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'api/message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'api/message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'api/message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'api/message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'api/message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
