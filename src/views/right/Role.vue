<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加角色 -->
        <div style="margin-top:15px">
            <el-button type="success" plain @click='showAddRoleDialog'>添加角色</el-button>
        </div>
        <template>
            <el-table :data="roleList" border style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for='first in scope.row.children' :key="first.id" style="padding:5px 0;">
                            <el-col :span='4'>
                                <el-tag closable type="success" @click="deleteroleright(scope.row,first.id)">
                                    {{first.authName}}
                                </el-tag>
                            </el-col>
                            <el-col :span='20'>
                                <el-row v-for='second in first.children' :key="second.id" style="padding:2px">
                                    <el-col :span='4'>
                                        <el-tag closable type="info" @close="deleteroleright(scope.row,second.id)">
                                            {{second.authName}}
                                        </el-tag>
                                    </el-col>
                                    <el-col :span='20'>
                                        <el-tag closable type="warning" v-for="third in second.children" :key='third.id' style="padding:0 4px;margin:0 4px" @close="deleteroleright(scope.row,third.id)">
                                            {{third.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row v-if="scope.row.children.length===0">
                            <el-col>该角色没有任何的权限，请前往添加</el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="描述" prop="roleDesc">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top">
                            <el-button type="success" icon="el-icon-edit" plain></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button type="primary" icon="el-icon-delete" plain></el-button>
                        </el-tooltip>
                        <el-tooltip content="分配权限" placement="top">
                            <el-button type="primary" icon="el-icon-check" plain @click="showGrantDialog(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!-- 授权角色对话 -->
        <el-dialog title="授权角色" :visible.sync="grantdialogTableVisible">
            <div class="height:400px;iverflow:auto">
                <el-tree :data="rightList" show-checkbox node-key="id" ref='tree' :default-checked-keys="checkArr" :props="defaultProps">
                </el-tree>
                 </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="grantdialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" @click="grantRightSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加角色 -->
        <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible">
  <el-form :model="addroleform" :rules="rules" ref="addRoleForm">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="addroleform.roleName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="addroleform.roleDesc" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>
import {
  getAllRoleList,
  deleteroleright,
  getAllRightsList,
  grantroleright,
  addRole
} from '@/api/index.js'
export default {
  data () {
    return {
      roleid: '',
      roleList: [],
      grantdialogTableVisible: false,
      rightList: [],
      checkArr: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addroleform: {
        roleDesc: '',
        roleName: ''
      },
      addRoleDialogVisible: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { }
        ]
      }
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    // 添加角色对话框
    showAddRoleDialog () {
      this.addRoleDialogVisible = true
    },
    // 实现添加用户的功能
    addRoleSubmit () {
      // 调用接口
      addRole(this.addroleform).then((res) => {
        if (res.meta.status === 201) {
          this.$message({
            message: '添加角色成功',
            type: 'success'
          })
          // 将对话框隐藏
          this.addRoleDialogVisible = false
          // 刷新页面显示
          this.initList()
        } else {
          this.$message({
            message: '失败',
            type: 'warning'
          })
        }
        this.$refs['addRoleForm'].resetFields()
      })
    },
    grantRightSubmit () {
    //   console.log(this.$refs.tree.getCheckedNodes())
      // 1.获取对象数组
      var nodeArr = this.$refs.tree.getCheckedNodes()
      // 遍历数组，获取到每个对象
      var idArr = nodeArr.map((value) => {
        return value.id + ',' + value.pid
      })
      //   console.log(idArr)
      // 3.将数组的元素拆分
      var strArr = idArr.join(',')
      //   console.log(strArr)
      // 4排除重复的值
      var ridsArr = strArr.split(',')
      //   console.log(ridsArr)
      // 5.去除重复值
      var tempSet = new Set(ridsArr)
      //   console.log(tempSet)
      var final = Array.from(tempSet)
      //   console.log(final.join(','))
      // 获取到这个值
      var rids = final.join(',')
      // 调用接口，为角色授权grantroleright

      grantroleright({roleid: this.roleid, rids: rids})
        .then(res => {
          if (res.meta.status === 200) {
            this.$message({
              message: res.meta.msg,
              type: 'success'
            })
            this.initList()
            this.grantdialogTableVisible = false
            this.$refs.tree.setCheckedKeys([])
          }
        })
    },
    // 授权角色对话框
    showGrantDialog (row) {
      // 显示对话框
      this.grantdialogTableVisible = true
      // 加载所有的权限数据
      getAllRightsList('tree').then(res => {
        this.rightList = res.data
      })
      // 将当前的角色id存储到Data的属性中
      this.roleid = row.id
      console.log(row)
      // 加载默认选中项---遍历当前角色的权限数组
      this.checkArr.length = 0
      if (row.children.length > 0) {
        row.children.forEach((first) => {
          if (first.children.length > 0) {
            first.children.forEach((second) => {
              if (second.children.length > 0) {
                second.children.forEach(third => {
                  this.checkArr.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    // 加载角色列表
    initList () {
      getAllRoleList().then(res => {
        // console.log(res.data)
        this.roleList = res.data
      })
    },
    // 删除指定角色的指定权限
    deleteroleright (row, rightid) {
      deleteroleright(row.id, rightid).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          row.children = res.data
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
</style>
