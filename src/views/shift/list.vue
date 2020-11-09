<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.resource" placeholder="请选择资源类别" clearable class="filter-item">
        <el-option v-for="item in resourceOptionList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.type" class="filter-item" clearable placeholder="选择科目来搜索" @change="getQueryRemoteCoachList">
        <el-option v-for="(item,index) in typeListOptions" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.coachId" class="filter-item" clearable placeholder="选择教练来搜索">
        <el-option v-for="(item,index) in targetCoachListOptions" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-finished" @click="openInShiftWindow()">
        添加记录
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-finished" @click="openBatchInShiftWindow()">
        批量添加记录
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
    <el-dialog title="添加班次记录" :visible.sync="inShiftFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="inForm" :model="dataform" :rules="rules">
        <el-form-item label="选择科目" :label-width="formLabelWidth" prop="type">
          <el-select v-model="dataform.type" filterable default-first-option placeholder="请选择科目类别" @change="changeInputType">
            <el-option v-for="(item,index) in typeListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择教练" :label-width="formLabelWidth" style="width:340px" prop="coachId">
          <el-select v-model="dataform.coachId" filterable default-first-option placeholder="输入教练名称来搜索">
            <el-option v-for="(item,index) in coachListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程开始时间" :label-width="formLabelWidth" style="width:400px" prop="shiftDateStart">
          <el-date-picker v-model="dataform.shiftDateStart" class="filter-item" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" />
          <!-- <el-time-select v-model="dataform.shiftDateStart" placeholder="起始时间" :picker-options="{ start: '06:00', step: '00:15', end: '18:30' }" /> -->
        </el-form-item>
        <el-form-item label="课程结束时间" :label-width="formLabelWidth" style="width:400px" prop="shiftDateEnd">
          <el-date-picker v-model="dataform.shiftDateEnd" class="filter-item" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" />
          <!-- <el-time-select v-model="dataform.shiftDateEnd" placeholder="结束时间" :picker-options="{ start: '06:00', step: '00:15', end: '22:00', minTime: dataform.shiftDateStart }" /> -->
        </el-form-item>
        <el-form-item label="最大可预约人数" :label-width="formLabelWidth" style="width:400px" prop="total">
          <el-input v-model="dataform.total" type="number" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" style="width:400px">
          <el-input v-model="dataform.backup" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inFormCancel">取 消</el-button>
        <el-button type="primary" @click="confirmIn">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量添加操作的窗口-->
    <el-dialog title="批量添加班次记录" :visible.sync="batchInShiftFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="batchInForm" :model="batchDataform" :rules="rules">
        <el-form-item label="选择科目" :label-width="formLabelWidth" prop="type">
          <el-select v-model="batchDataform.type" filterable default-first-option placeholder="请选择科目类别" @change="changeBatchInputType">
            <el-option v-for="(item,index) in typeListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择教练" :label-width="formLabelWidth" style="width:340px" prop="coachId">
          <el-select v-model="batchDataform.coachId" filterable default-first-option placeholder="输入教练名称来搜索">
            <el-option v-for="(item,index) in coachListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程开始时间" :label-width="formLabelWidth" style="width:400px" prop="timeStart">
          <!-- <el-date-picker v-model="batchDataform.shiftDateStart" class="filter-item" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" /> -->
          <el-time-select v-model="batchDataform.timeStart" placeholder="起始时间" :picker-options="{ start: '06:00', step: '00:15', end: '18:30' }" />
        </el-form-item>
        <el-form-item label="课程结束时间" :label-width="formLabelWidth" style="width:400px" prop="timeEnd">
          <!-- <el-date-picker v-model="batchDataform.shiftDateEnd" class="filter-item" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" /> -->
          <el-time-select v-model="batchDataform.timeEnd" placeholder="结束时间" :picker-options="{ start: '06:00', step: '00:15', end: '22:00', minTime: dataform.shiftDateStart }" />
        </el-form-item>
        <el-form-item label="日期段" :label-width="formLabelWidth" style="width:400px" prop="dateRange">
          <el-date-picker v-model="batchDataform.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="最大可预约人数" :label-width="formLabelWidth" style="width:400px" prop="total">
          <el-input v-model="batchDataform.total" type="number" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" style="width:400px">
          <el-input v-model="batchDataform.backup" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inBatchFormCancel">取 消</el-button>
        <el-button type="primary" @click="confirmBatchIn">确 定</el-button>
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
  filters: {
    typeFilter(type) {
      if (type == 1) {
        return '科目二'
      } else if (type == 2) {
        return '科目三'
      }
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      downloadLoading: false,
      listLoading: false,
      listQuery: {
        type: '',
        resource: null,
        coachId: '',
        page: 1,
        limit: 20
      },
      resourceOptionList: [],
      inShiftFormVisible: false, // 控制入库窗口的显示隐藏
      batchInShiftFormVisible: false, // 控制批量入库窗口的显示隐藏
      typeListOptions: [{ id: '1', name: '科目二' }, { id: '2', name: '科目三' }],
      coachListOptions: [],
      targetCoachListOptions: [],

      // 添加的表单
      dataform: {
        id: undefined,
        type: '1',
        coachId: undefined,
        shiftDateStart: '',
        shiftDateEnd: '',
        total: '',
        backup: ''
      },
      // 批量添加的表单
      batchDataform: {
        type: '1',
        coachId: undefined,
        timeStart: '',
        timeEnd: '',
        dateRange: undefined,
        total: '',
        backup: ''
      },
      formLabelWidth: '120px',
      rules: {
        type: [{ required: true, message: '请选择科目类别', trigger: 'blur' }],
        coachId: [{ required: true, message: '请选择教练', trigger: 'blur' }],
        shiftDateStart: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        shiftDateEnd: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        timeStart: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        timeEnd: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        total: [{ required: true, message: '请输入最大可预约人数', trigger: 'blur' }],
        dateRange: [{ required: true, message: '请选择日期段', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getResourceOptionList()
  },
  methods: {
    changeBatchInputType() {
      this.coachListOptions = []
      this.getRemoteCoachList(this.batchDataform.type)
    },
    changeInputType() {
      this.coachListOptions = []
      this.getRemoteCoachList(this.dataform.type)
    },
    getResourceOptionList() {
      coach.fetchResourceList().then(response => {
        this.resourceOptionList = response.data
        this.listQuery.resource = this.resourceOptionList[0].id
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      shift.fetchList1(this.listQuery).then(response => {
        this.list = response.data.lst
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getQueryRemoteCoachList() {
      var vm = this
      coach.fetchList1(this.listQuery).then(response => {
        vm.targetCoachListOptions = response.data
      })
    },
    getRemoteCoachList(type) {
      var vm = this
      coach.fetchList(type).then(response => {
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
        vm.changeInputType()
      })
      if (id) {
        shift.fetchDetail(id).then(response => {
          vm.dataform = response.data
          coach.fetchList(this.dataform.type).then(response => {
            vm.coachListOptions = response.data
          })
        })
      }
    },
    // 打开批量入库窗口
    openBatchInShiftWindow(id) {
      var vm = this
      this.resetDataForm()
      this.batchInShiftFormVisible = true
      this.$nextTick(() => {
        this.$refs['batchInForm'].clearValidate()
        vm.restOptions()
        vm.changeInputType()
      })
    },
    // 关闭批量入库窗口
    inBatchFormCancel() {
      this.resetDataForm()
      this.restOptions()
      this.batchInShiftFormVisible = false
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
              title: '成功',
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
    // 确定批量入库操作
    confirmBatchIn() {
      var vm = this
      this.$refs['batchInForm'].validate((valid) => {
        if (valid) {
          shift.batchUpsertShift(this.batchDataform).then(response => {
            this.$notify({
              title: '成功',
              message: '批量添加成功',
              type: 'success',
              duration: 2000
            })
            vm.inBatchFormCancel()
            vm.getList()
          })
        }
      })
    },
    handleDel(id) {
      var vm = this
      shift.delShift(id).then(response => {
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
        type: '1',
        coachId: undefined,
        shiftDateStart: '',
        shiftDateEnd: '',
        total: '',
        backup: ''
      }
      this.batchDataform = {
        type: '1',
        coachId: undefined,
        timeStart: '',
        timeEnd: '',
        dateRange: undefined,
        total: '',
        backup: ''
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
