<template>
    <div>
        <!-- 搜索框+输入款 -->
        <el-input placeholder="请输入内容" v-model="serachKey" class="search-input" @keyup.native.enter='searchUserList'>
            <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
        </el-input>
        <el-button type="success" plain @click='$router.push({path:"add"})'>添加用户</el-button>

        <el-table :data="goodslist" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="500">
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)" width="155">
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量">
            </el-table-column>
            <el-table-column prop="add_time" label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.add_time}}
                </template>
            </el-table-column>
            <el-table-column width="130" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="success" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page="pagenum" :page-sizes="[10,20,30,40]" :page-size="pagesize" layout="total,sizes,prev,pager,next,jumper" :total='total'>

        </el-pagination>
    </div>

</template>

<script>
import {getGoods} from '@/api/index.js'
export default {
  data () {
    return {
      // 搜索关键字
      serachKey: '',
      // 商品列表数据
      goodslist: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    getGoodsList () {
      getGoods({
        query: this.keywords,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！')
        }
        this.goodslist = res.data.goods
        this.total = res.data.total
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.pagesize = newSize
      this.getGoodsList()
    },
    // 监听页码值， 改变的事件
    handleCurrentChange (newPage) {
      this.pagenum = newPage
      this.getGoodsList()
    },
    removeGoods (row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>
.search-input {
  width: 300px;
}
</style>
