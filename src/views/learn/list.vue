<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-finished" @click="openInShiftWindow()">
        添加视频记录
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目类别">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教练名称">
        <template slot-scope="scope">
          <span>{{ scope.row.coachName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{ scope.row.shiftDateStart }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{ scope.row.shiftDateEnd }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最大可预约数">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已预约人数">
        <template slot-scope="scope">
          <span>{{ scope.row.left }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.backup }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button slot="reference" type="primary" size="small" icon="el-icon-edit" @click="openInShiftWindow(scope.row.id)">
            编辑
          </el-button>
          <el-popconfirm icon="el-icon-info" icon-color="red" title="确定删除吗，将删除其所有预约记录" @onConfirm="handleDel(scope.row.id)">
            <el-button slot="reference" type="danger" size="small" icon="el-icon-delete">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--添加操作的窗口-->
    <el-dialog title="添加教学视频" :visible.sync="inShiftFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="inForm" :model="dataform" :rules="rules">
        <el-form-item label="视频标题" :label-width="formLabelWidth" prop="type">
          <el-select v-model="dataform.title" filterable default-first-option placeholder="标题会显示在APP的视频记录顶部" @change="changeInputType">
            <el-option v-for="(item,index) in typeListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片" :label-width="formLabelWidth" style="width:340px" prop="coachId">
          <el-upload
            class="upload-demo"
            action="http://39.106.220.164:8090/business/upload/withoutId"
            accept=".jpg,.jpeg,.png"
            :headers="tokenHeader"
            :on-success="titleImgHandleSuccess"
            :on-remove="titleImgHandleRemove"
            :before-remove="titleImgBeforeRemove"
            multiple
            :limit="1"
            :on-exceed="titleImgHandleExceed"
            :file-list="dataform.headUrlList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="上传视频" :label-width="formLabelWidth" style="width:340px" prop="coachId">
          <el-upload
            class="upload-demo"
            action="http://39.106.220.164:8090/business/upload/withoutId"
            accept=".mpeg,.mp4,.avi"
            :headers="tokenHeader"
            :on-success="mp4HandleSuccess"
            :on-remove="mp4HandleRemove"
            :before-remove="mp4BeforeRemove"
            multiple
            :limit="1"
            :on-exceed="mp4HandleExceed"
            :file-list="dataform.videoUrlList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传MPEG/mp4/avi文件，且不超过200mb</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inFormCancel">取 消</el-button>
        <el-button type="primary" @click="confirmIn">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as learnVideo from '@/api/learn-video'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getToken } from '@/utils/auth'
export default {
  name: 'AccidentList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      tokenHeader: null,
      inShiftFormVisible: false, // 控制入库窗口的显示隐藏
      // 添加的表单
      dataform: {
        id: undefined,
        title: '',
        headUrl: '',
        headUrlList: [],
        videoUrl: '',
        videoUrlList: []
      },
      formLabelWidth: '120px',
      rules: {
        type: [{ required: true, message: '请选择科目类别', trigger: 'blur' }],
        coachId: [{ required: true, message: '请选择教练', trigger: 'blur' }],
        shiftDateStart: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        shiftDateEnd: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
      }
    }
  },
  created() {
    const token = getToken()
    this.tokenHeader = { 'Authorization': token }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      learnVideo.fetchList(this.listQuery.coachId, this.listQuery.page, this.listQuery.limit).then(response => {
        this.list = response.data.lst
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 打开入库窗口
    openInShiftWindow(id) {
      this.resetDataForm()
      this.inShiftFormVisible = true
      this.$nextTick(() => {
        this.$refs['inForm'].clearValidate()
      })
    },
    // 关闭入库窗口
    inFormCancel() {
      this.resetDataForm()
      this.inShiftFormVisible = false
    },
    // 确定入库操作
    confirmIn() {
      var vm = this
      this.$refs['inForm'].validate((valid) => {
        if (valid) {
          learnVideo.upsertLearn(this.dataform).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            vm.inFormCancel()
            vm.getList()
          })
        }
      })
    },
    handleDel(id) {
      var vm = this
      learnVideo.deleteVideo(id).then(response => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        vm.getList()
      })
    },

    resetDataForm() {
      this.dataform = {
        id: undefined,
        title: '',
        headUrl: '',
        headUrlList: [],
        videoUrl: '',
        videoUrlList: []
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    titleImgHandleRemove(file, fileList) {
      console.log(file, fileList)
    },
    titleImgHandleSuccess(response, file, fileList) {
      if (this.dataform.headUrlList == null) {
        this.dataform.headUrlList = []
      }
      if (response.code === 200) {
        this.dataform.headUrl = response.data[0].url
        this.dataform.headUrlList.push(response.data[0].url)
      }
      this.$message({ message: '上传完成', type: 'success' })
    },
    titleImgHandleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    titleImgBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    mp4HandleRemove(file, fileList) {
      console.log(file, fileList)
    },
    mp4HandleSuccess(response, file, fileList) {
      if (this.dataform.videoUrlList == null) {
        this.dataform.videoUrlList = []
      }
      if (response.code === 200) {
        this.dataform.videoUrl = response.data[0].url
        this.dataform.videoUrlList.push(response.data[0].url)
      }
      this.$message({ message: '上传完成', type: 'success' })
    },
    mp4HandleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    mp4BeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
