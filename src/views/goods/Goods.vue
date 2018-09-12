<template>
    <div class="goods">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>食品管理</el-breadcrumb-item>
            <el-breadcrumb-item>食品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 搜索框+输入款 -->
            <router-view></router-view>
        </el-card>
    </div>
</template>

<script>
export default {}
</script>

<style scoped>
.el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
</style>
