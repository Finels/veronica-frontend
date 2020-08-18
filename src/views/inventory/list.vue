<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="输入藏品编号/名称来搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-finished" @click="openInStoreWindow">
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
      <el-table-column align="center" label="藏品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="藏品编号">
        <template slot-scope="scope">
          <span>{{ scope.row.ccode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="盘点数量">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="盘点原因">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.backup }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--添加操作的窗口-->
    <el-dialog title="添加盘点记录" :visible.sync="inStoreFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="inForm" :model="dataform" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="藏品编号/名称" :label-width="formLabelWidth" prop="cid">
              <el-select v-model="dataform.cid" :remote-method="getRemoteCollectionList" filterable default-first-option remote placeholder="输入部分编号来搜索">
                <el-option v-for="(item,index) in collectionListOptions" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="盘点数量" :label-width="formLabelWidth" prop="count">
              <el-input v-model="dataform.count" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="盘点原因" :label-width="formLabelWidth">
              <el-input v-model="dataform.reason" type="textarea" placeholder="请输入盘点原因" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" :label-width="formLabelWidth">
              <el-input v-model="dataform.backup" type="textarea" placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inFormCancel">取 消</el-button>
        <el-button type="primary" @click="confirmIn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as accident from '@/api/inventory'
import * as collection from '@/api/collection'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
export default {
  name: 'InventoryList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      downloadLoading: false,
      listLoading: false,
      listQuery: {
        name: '',
        page: 1,
        limit: 20
      },
      inStoreFormVisible: false, // 控制入库窗口的显示隐藏
      collectionListOptions: [],

      // 添加的表单
      dataform: {
        cid: undefined,
        count: '',
        reason: '',
        backup: ''
      },
      formLabelWidth: '120px',
      rules: {
        cid: [{ required: true, message: '请选择一个藏品', trigger: 'blur' }],
        count: [{ required: true, message: '盘点数量为必填', trigger: 'blur' }]
        // reason: [{ required: true, message: '事故原因为必填项', trigger: 'blur' }],
        // result: [{ required: true, message: '处理结果为必填项', trigger: 'blur' }],
        // responsibility: [{ required: true, message: '责任人为必填项', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      accident.fetchList(this.listQuery).then(response => {
        this.list = response.data.lst
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getRemoteCollectionList(name) {
      var vm = this
      collection.fetchList({ name: name, page: 1, limit: 99 }).then(response => {
        vm.collectionListOptions = response.data.lst
      })
    },
    // 打开入库窗口
    openInStoreWindow() {
      var vm = this
      this.resetDataForm()
      this.inStoreFormVisible = true
      this.$nextTick(() => {
        this.$refs['inForm'].clearValidate()
        vm.restOptions()
      })
    },
    // 关闭入库窗口
    inFormCancel() {
      this.resetDataForm()
      this.restOptions()
      this.inStoreFormVisible = false
    },
    // 确定入库操作
    confirmIn() {
      var vm = this
      this.$refs['inForm'].validate((valid) => {
        if (valid) {
          accident.persist(this.dataform).then(response => {
            this.$notify({
              title: '提示',
              message: '添加盘点记录成功',
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
          filename: '修复记录导出' + parseTime(new Date())
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
