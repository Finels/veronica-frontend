<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" class="sub-navbar">
        <el-button v-loading="loading" style="margin-left: 15px;" type="success" @click="submitForm">
          保存
        </el-button>
        <el-button v-loading="loading" type="warning" @click="cancelBtn">
          取消
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="name">
              <MDinput v-model="postForm.name" :maxlength="100" required>
                教练名称
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
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="资源类别:" class="postInfo-container-item">
                          <el-select v-model="postForm.resourceId" placeholder="请选择资源类别" clearable class="filter-item">
                            <el-option v-for="item in resourceOptionList" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="科目类别:" class="postInfo-container-item">
                          <el-select v-model="postForm.type" placeholder="请选择科目类别" clearable class="filter-item">
                            <el-option v-for="item in typeListOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="联系方式:" class="postInfo-container-item">
                          <el-input v-model="postForm.tel" placeholder="请输入联系方式" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
                <!-- <el-col :span="10">
                  <el-form-item label-width="120px" label="入馆时间" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                  </el-form-item>
                </el-col> -->
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="备注:">
          <el-input v-model="postForm.backup" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入备注" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <!-- <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item> -->

        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <dropzone
            id="myVueDropzone"
            url="http://localhost:8090/business/upload"
            accepted-files="image/*,application/pdf,.psd"
            :default-img="postForm.imgUrls"
            :max-files="1"
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
import { fetchDetail, upsertCoach, fetchResourceList } from '@/api/coach'
import Dropzone from '@/components/Dropzone'
import router from '../../../router'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  id: undefined,
  name: '', // 教练名称
  tel: '',
  imgUrls: [],
  backup: ''
}

export default {
  name: 'Detail',
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
      storeListOptions: [],
      rules: {
        name: [{ required: true, message: '名称为必填项', trigger: 'change' }]
      },
      typeListOptions: [{ id: '1', name: '科目二' }, { id: '2', name: '科目三' }],
      resourceOptionList: [],
      tempRoute: {},
      tempPicture: []
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.backup == null ? 0 : this.postForm.backup.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.in_time))
      },
      set(val) {
        this.postForm.in_time = new Date(val)
      }
    }
  },
  created() {
    this.getResourceOptionList()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      if (id != null) {
        fetchDetail(id).then(response => {
          this.postForm = response.data
          // this.postForm.imgArray = response.data.imgUrls
          // this.postForm.imgUrls = null
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getResourceOptionList() {
      fetchResourceList().then(response => {
        this.resourceOptionList = response.data
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
          if (this.postForm.imgUrls != null && this.postForm.imgUrls.length > 1) {
            this.$message({ message: '教练图片只能上传一张,请删除后重试', type: 'error' })
            this.loading = false
            return
          }
          // if (this.postForm.imgUrls != null && this.postForm.imgUrls.length > 0 && this.postForm.imgUrls[0].url != null) {
          //   for (var i in this.postForm.imgUrls) {
          //     this.postForm.imgUrls[i] = this.postForm.imgUrls[i].url
          //   }
          // }
          console.log(this.postForm)
          upsertCoach(this.postForm).then(response => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
            router.back()
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelBtn() {
      if (this.loading) {
        return
      }
      router.back()
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
