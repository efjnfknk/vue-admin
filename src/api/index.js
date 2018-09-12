import axios from 'axios'
// 配置基准路劲
const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 1. 获取token值
  var token = localStorage.getItem('mytoken')
  // config进行请求头的属性 通过headers属性
  // 写入请求头
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 登陆
export const login = (params) => {
  return axios.post('login', params).then((res) => {
    return res.data
  })
}
// 获取所有用户数据
export const getAllUserList = (pa) => {
  return axios.get('users', {params: pa}).then((res) => {
    return res.data
  })
}
// 实现添加用户数据
export const addUser = (pa) => {
  return axios.post('users', pa).then((res) => {
    return res.data
  })
}
// 实现编辑用户数据
export const editUser = (pa) => {
  return axios.put(`users/${pa.id}`, pa).then((res) => {
    return res.data
  })
}
// 实现单个用户数据的删除
export const deleteUserById = (id) => {
  return axios.delete(`users/${id}`).then((res) => {
    return res.data
  })
}

// 实现单个用户状态的修复
export const updateUserStateById = (pa) => {
  return axios.put(`users/${pa.id}/state/${pa.state}`).then((res) => {
    return res.data
  })
}
// 获取所有角色列表数据
export const getAllRoleList = () => {
  return axios.get('roles').then((res) => {
    return res.data
  })
}
// 实现单个用户的分配
export const grantRoleById = (pa) => {
  return axios.put(`users/${pa.id}/role`, {rid: pa.rid}).then((res) => {
    return res.data
  })
}
// 获取所有权限列表数据
export const getAllRightsList = (type) => {
  return axios.get(`rights/${type}`).then((res) => {
    return res.data
  })
}
// 删除指定角色的指定权限
export const deleteroleright = (roleid, rightid) => {
  return axios.delete(`roles/${roleid}/rights/${rightid}`).then((res) => {
    return res.data
  })
}
// 为指定角色授权权限
export const grantroleright = (pa) => {
  return axios.post(`roles/${pa.roleid}/rights`, {rids: pa.rids}).then((res) => {
    return res.data
  })
}
// 添加角色
export const addRole = (pa) => {
  return axios.post('roles', pa)
    .then(res => {
      return res.data
    })
}
// 获取左侧菜单项数据
export const getLeftMenu = () => {
  return axios.get(`menus`).then((res) => {
    return res.data
  })
}
// 获取商品分类数据
export const getCategories = (type) => {
  return axios.get(`categories`, {params: {'type': type}}).then((res) => {
    return res.data
  })
}
// 添加分类数据
export const addCategory = (pa) => {
  return axios.post('categories', pa).then(res => {
    return res.data
  })
}
// 获取商品数据列表
export const getGoods = (pa) => {
  return axios.get(`goods`, {params: pa}).then((result) => {
    return result.data
  })
}
// 添加分类
export const addGoods = (pa) => {
  return axios.post('goods', pa).then(res => {
    return res.data
  })
}
