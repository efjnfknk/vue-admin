<template>
    <div class="categories">
  <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
  <div style="margin-top:15px">
            <el-button type="success" plain @click='showAddRoleDialog'>添加角色</el-button>
        </div>
        <tree-grid :treeStructure='true' :columns='columns' :data-source='dataSource' @deleteCate='deleteCategory' @editCate='editCategory'></tree-grid>
        <!-- 添加分类对话框 -->
<el-dialog title="添加商品分类" :visible.sync="adddialogFormVisible">
  <el-form :model="addform">
    <el-form-item label="分类名称" label-width="80px">
      <el-input v-model="addform.cat_name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="父级名称">
     <el-cascader
    :options="categoreList"
    v-model="selectedOptions"
    @change="handleChange"
    :props="cascaderProps">
  </el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="adddialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>

    </div>
</template>

<script>
import { getCategories } from '@/api/index.js'
import TreeGrid from '@/components/TreeGrid/TreeGrid.vue'
export default {
  data () {
    return {
      adddialogFormVisible: false,
      dataSource: [],
      addform: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      columns: [
        {
          text: '分类名称',
          dataIndex: 'cat_name',
          width: ''
        },
        {
          text: '是否有效',
          dataIndex: 'cat_deleted',
          width: ''
        },
        {
          text: '排序',
          dataIndex: 'cat_level',
          width: ''
        }
      ],
      categoreList: [],
      selectedOptions: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  //   通过components属性可以来注入你想使用的组件
  components: {
    'tree-grid': TreeGrid
  },
  methods: {
    handleChange () {},
    showAddRoleDialog () {
      this.adddialogFormVisible = true
      getCategories(2).then(res => {
        this.categoreList = res.data
      })
    },
    deleteCategory () {},
    editCategory () {}
  },
  mounted () {
    getCategories(3).then(res => {
      console.log(res)
      this.dataSource = res.data
    })
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
