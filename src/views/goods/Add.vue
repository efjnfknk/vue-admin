<template>
    <div class="goodsAdd">
            <el-steps :active="activeName-0" finish-status="success">
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
                <el-step title="步骤 3"></el-step>
                <el-step title="步骤 4"></el-step>
                <el-step title="步骤 5"></el-step>
            </el-steps>
            <template>
                <el-form :model="addform" label-width="100px">
                    <el-tabs v-model="activeName" tab-position='left' style="margin-top:20px">
                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="商品名称">
                                <el-input v-model="addform.goods_name" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格">
                                <el-input v-model="addform.goods_price" type="number" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量">
                                <el-input v-model="addform.goods_weight" type="number" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量">
                                <el-input v-model="addform.goods_number" type="number" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类">
                                <el-cascader :options="cateList" v-model="selectedOptions" :props="cateProps" @change="handleChange"></el-cascader>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                        <el-tab-pane label="商品属性" name="2">
                          <div class="amap-wrapper">
                            <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
                          </div>
                        </el-tab-pane>
                        <el-tab-pane label="商品图片" name="3">
                            <el-upload class="upload-demo"
                             action="http://localhost:8888/api/private/v1/upload"
                              :on-preview="handlePreview"
                              :on-remove="handleRemove"
                              :on-success='uploadDone'
                              :before-upload='beforeUpload'
                              :headers="getToken()"
                              :file-list="fileList"
                              list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-tab-pane>
                          <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addform.goods_introduce" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" style='height:400px'>
                        </quill-editor>
                    </el-tab-pane>
                    </el-tabs>
                     <el-button type="success" class="addBtn" @click='addGoodsSubmit'>添加商品</el-button>
                </el-form>
            </template>

        <!-- 大图预览 -->
        <el-dialog :visible.sync="previewdialogVisible" title="提示" width="70%">
            <img :src="imgsrc" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { getCategories, addGoods } from '@/api/index.js'
export default {
  data () {
    return {
      editorOption: {},
      previewdialogVisible: false,
      imgsrc: '',
      activeName: '',
      addform: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      cateList: [],
      selectedOptions: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      fileList: []
    }
  },
  mounted () {
    getCategories({ type: 3 }).then(res => {
      this.cateList = res.data
    })
  },
  methods: {
    myQuillEditor () {},
    // 添加商品
    addGoodsSubmit () {
      console.log(this.addform)
      addGoods(this.addform).then(res => {
        // console.log(res)
        if (res.meta.status === 201) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          this.$router.push({ 'path': 'list' })
        }
      })
    },
    // 选择分类时触发的函数
    handleChange (value) {
      this.addform.goods_cat = value.join(',')
      // console.log(this.addform)
    },
    // 文件上传前的处理函数（
    beforeUpload (file) {
      console.log(file)
      if (file.size > 500 * 1024) {
        this.$message({
          type: 'warning',
          message: '文件大小必须在500KB内'
        })
        return false
      }
    },
    // 文件上传成功之后的钩子函数
    uploadDone (response, file, fileList) {
      this.addform.pics.push({pic: response.data.tmp_path})
    },
    // 获取token值
    getToken () {
      var token = localStorage.getItem('mytoken')
      return {Authorization: token}
    },
    handleRemove (file, fileList) {
      if (!file.fileList) {
        return
      }
      // 获取当前用户已删除的文件路劲
      var delFile = file.response.data.tmp_path
      // 在this.addform.pics中查找文件名称对应的索引，将对应的元素删除
      var index = this.addform.pics.findIndex(value => {
        return value.pic === delFile
      })
      this.addform.pics.splice(index, 1)
    },
    handlePreview (file) {
      this.imgsrc = 'http://localhost:8888/' + file.response.data.tmp_path
      this.previewdialogVisible = true
    },
    onEditorBlur (quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      // console.log('editor blur!', quill)
    },
    onEditorReady (quill) {
      // console.log('editor blur!', quill)
    }
  }
}
</script>

<style scoped>
.addBtn {
  float: right;
  margin: 20px 0px;
}
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>
