<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type" class="filter-item" clearable filterable default-first-option placeholder="选择科目来搜索">
        <el-option v-for="(item,index) in typeListOptions" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.coachId" class="filter-item" :remote-method="getQueryRemoteCoachList" clearable filterable default-first-option remote placeholder="选择教练来搜索">
        <el-option v-for="(item,index) in targetCoachListOptions" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-finished" @click="openInShiftWindow">
        添加记录
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="success" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目类别">
        <template slot-scope="scope">
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教练名称">
        <template slot-scope="scope">
          <span>{{ scope.row.ccode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最大可预约数">
        <template slot-scope="scope">
          <span>{{ scope.row.result }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已预约人数">
        <template slot-scope="scope">
          <span>{{ scope.row.responsibility }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="openInShiftWindow(scope.row.id)">
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
    <el-dialog title="添加班次记录" :visible.sync="inShiftFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="inForm" :model="dataform" :rules="rules">
        <el-form-item label="选择科目" :label-width="formLabelWidth" prop="cid">
          <el-select v-model="dataform.type" filterable default-first-option placeholder="输入部分编号来搜索">
            <el-option v-for="(item,index) in typeListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择教练" :label-width="formLabelWidth" style="width:340px" prop="happenTime">
          <el-select v-model="dataform.coachId" :remote-method="getRemoteCoachList" filterable default-first-option remote placeholder="输入教练名称来搜索">
            <el-option v-for="(item,index) in coachListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程开始时间" :label-width="formLabelWidth" style="width:400px" prop="location">
          <el-date-picker v-model="dataform.shiftDateStart" class="filter-item" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="课程结束时间" :label-width="formLabelWidth" style="width:400px" prop="reason">
          <el-date-picker v-model="dataform.shiftDateEnd" class="filter-item" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="最大可预约人数" :label-width="formLabelWidth" style="width:400px" prop="result">
          <el-input v-model="dataform.total" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" style="width:400px" prop="result">
          <el-input v-model="dataform.backup" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inFormCancel">取 消</el-button>
        <el-button type="primary" @click="confirmIn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as shift from '@/api/shift'
import * as coach from '@/api/coach'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
export default {
  name: 'AccidentList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      downloadLoading: false,
      listLoading: false,
      listQuery: {
        type: '',
        coachId: '',
        page: 1,
        limit: 20
      },
      inShiftFormVisible: false, // 控制入库窗口的显示隐藏
      typeListOptions: [{ id: 1, name: '科目二' }, { id: 2, name: '科目三' }],
      coachListOptions: [],
      targetCoachListOptions: [],

      // 添加的表单
      dataform: {
        id: undefined,
        type: '',
        coachId: undefined,
        shiftDateStart: '',
        shiftDateEnd: '',
        total: '',
        backup: ''
      },
      formLabelWidth: '120px',
      rules: {
        cid: [{ required: true, message: '请选择一个藏品', trigger: 'blur' }],
        location: [{ required: true, message: '发生地点为必填项', trigger: 'blur' }],
        reason: [{ required: true, message: '事故原因为必填项', trigger: 'blur' }],
        result: [{ required: true, message: '处理结果为必填项', trigger: 'blur' }],
        responsibility: [{ required: true, message: '责任人为必填项', trigger: 'blur' }],
        happenTime: [{ required: true, message: '发生时间为必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      shift.fetchList(this.listQuery.coachId, this.listQuery.page, this.listQuery.limit).then(response => {
        this.list = response.data.lst
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getQueryRemoteCoachList() {
      var vm = this
      coach.fetchList(this.listQuery.type).then(response => {
        vm.targetCoachListOptions = response.data
      })
    },
    getRemoteCoachList() {
      var vm = this
      coach.fetchList(this.dataform.type).then(response => {
        vm.coachListOptions = response.data
      })
    },
    // 打开入库窗口
    openInShiftWindow(id) {
      var vm = this
      this.resetDataForm()
      this.inShiftFormVisible = true
      this.$nextTick(() => {
        this.$refs['inForm'].clearValidate()
        vm.restOptions()
      })
      if (id) {
        shift.fetchDetail(id).then(response => {
          vm.dataform = response.data
        })
      }
    },
    // 关闭入库窗口
    inFormCancel() {
      this.resetDataForm()
      this.restOptions()
      this.inShiftFormVisible = false
    },
    // 确定入库操作
    confirmIn() {
      var vm = this
      this.$refs['inForm'].validate((valid) => {
        if (valid) {
          shift.upsertShift(this.dataform).then(response => {
            this.$notify({
              title: 'Success',
              message: '添加班次成功',
              type: 'success',
              duration: 2000
            })
            vm.inFormCancel()
            vm.getList()
          })
        }
      })
    },

    resetDataForm() {
      this.dataform = {
        cid: undefined,
        storeId: '',
        counter: 0
      }
    },
    restOptions() {
      this.collectionListOptions = []
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['藏品名称', '藏品编号', '损坏地点', '事故原因', '处理结果', '责任人', '事故时间', '备注']
        const filterVal = ['cname', 'ccode', 'location', 'reason', 'result', 'responsibility', 'happenTime', 'backup']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '事故记录导出' + parseTime(new Date())
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
