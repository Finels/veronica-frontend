<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" class="sub-navbar">
        <el-button v-loading="loading" style="margin-left: 15px;" type="success" @click="submitForm">
          保存
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="name">
              <MDinput v-model="postForm.name" :maxlength="100" required>
                驾校名称
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-card class="box-card" style="margin-bottom:20px">
                  <div slot="header" class="clearfix">
                    <span>基础信息</span>
                  </div>
                  <div class="component-item">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label-width="90px" label="联系方式:" class="postInfo-container-item">
                          <el-input v-model="postForm.tel" placeholder="请输入联系方式" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label-width="90px" label="联系地址:" class="postInfo-container-item">
                          <el-input v-model="postForm.location" placeholder="请输入联系地址" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="驾校简介:">
          <el-input v-model="postForm.introduce" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入驾校简介" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <!-- <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item> -->

        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <dropzone
            id="orgDropzone"
            url="http://localhost:8090/business/upload"
            accepted-files="image/*"
            :default-img="postForm.imgUrls"
            :max-files="4"
            :show-remove-link="showRemoveLink"
            @dropzone-removedFile="dropzoneR"
            @dropzone-success="dropzoneS"
            @dropzone-successmultiple="dropzoneM"
            @dropzone-fileAdded="dropzoneBefore"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchDetail, upsertOrg } from '@/api/org'
import Dropzone from '@/components/Dropzone'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  id: undefined,
  name: '', // 驾校名称
  introduce: '', // 驾校简介
  location: '', // 驾校地址
  tel: '', // 联系方式
  imgUrls: []
}

export default {
  name: 'OrgDetail',
  components: { MDinput, Dropzone, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // const validateRequire = (rule, value, callback) => {
    //   if (value === '') {
    //     this.$message({
    //       // message: rule.field + '为必传项',
    //       message: rule.field + '为必传项',
    //       type: 'error'
    //     })
    //     callback(new Error('此项为必传项'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      showRemoveLink: true,
      rules: {
        name: [{ required: true, message: '名称为必填项', trigger: 'change' }]
      },
      tempPicture: []
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.introduce.length
    }
  },
  created() {
    this.fetchData()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData() {
      fetchDetail().then(response => {
        this.postForm = response.data
        // this.postForm.imgArray = response.data.imgUrls
        // this.postForm.imgUrls = null
      }).catch(err => {
        console.log(err)
      })
    },
    dropzoneBefore(file) {
      this.loading = true
      console.log(file)
    },
    dropzoneR(file) {
      // console.log(this.postForm.imgUrls)
      // this.$message({ message: '删除成功', type: 'success' })
      // if (this.postForm.imgUrls != null && this.postForm.imgUrls[0].key != null) {
      for (var i in this.postForm.imgUrls) {
        if (this.postForm.imgUrls[i].id.indexOf(file.upload.uuid) !== -1) {
          this.postForm.imgUrls.splice(i, 1)
          break
        }
      }
      // }
      console.log(this.postForm.imgUrls)
    },
    dropzoneS(file) {
      // console.log(file)
      // this.$message({ message: '保存成功', type: 'success' })
    },
    dropzoneM(file, response, xhr) {
      console.log(file)
      this.loading = false
      if (response.code === 200) {
        if (this.postForm.imgUrls == null) {
          this.postForm.imgUrls = []
        }
        this.postForm.imgUrls.push.apply(this.postForm.imgUrls, response.data)
      }
      // console.log(this.postForm.imgUrls)
      this.$message({ message: '图片上传完成', type: 'success' })
    },
    submitForm() {
      console.log(this.postForm)
      if (this.loading) {
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          // if (this.postForm.imgUrls != null && this.postForm.imgUrls.length > 0 && this.postForm.imgUrls[0].url != null) {
          //   for (var i in this.postForm.imgUrls) {
          //     this.postForm.imgUrls[i] = this.postForm.imgUrls[i].url
          //   }
          // }
          console.log(this.postForm)
          upsertOrg(this.postForm).then(response => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    // getRemoteUserList(query) {
    //   searchUser(query).then(response => {
    //     if (!response.data.items) return
    //     this.userListOptions = response.data.items.map(v => v.name)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.component-item{
  min-height: 100px;
}
</style>
