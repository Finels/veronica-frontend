<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="输入藏品信息来搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.texture" placeholder="输入藏品质地来搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.years" placeholder="输入年份信息来搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.category" placeholder="输入藏品类型来搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.level" placeholder="输入藏品级别来搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.origin" placeholder="输入藏品来源" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.storeId" class="filter-item" :remote-method="getRemoteStoreList" clearable filterable default-first-option remote placeholder="选择仓库信息来搜索">
        <el-option v-for="(item,index) in targetStoreListOptions" :key="index" :label="item.name" :value="item.id" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-finished" @click="openInStoreWindow">
        入库
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="success" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="藏品编号">
        <template slot-scope="scope">
          <span>{{ scope.row.ccode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="藏品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="库存数量">
        <template slot-scope="scope">
          <span>{{ scope.row.counter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="存放位置">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="管理员">
        <template slot-scope="scope">
          <span>{{ scope.row.administrator }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="310">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-help" @click="openMoveStoreWindow(scope.row)">
            移库
          </el-button>
          <el-button slot="reference" type="warning" size="small" icon="el-icon-remove" @click="openOutStoreWindow(scope.row)">
            出库
          </el-button>
          <el-button slot="reference" type="danger" size="small" icon="el-icon-remove" @click="openDestroyStoreWindow(scope.row)">
            注销
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--入库操作的窗口-->
    <el-dialog title="入库操作" :visible.sync="inStoreFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="inForm" :model="dataform" :rules="rules">
        <el-form-item label="藏品编号/名称" :label-width="formLabelWidth" prop="cid">
          <el-select v-model="dataform.cid" :remote-method="getRemoteCollectionList" filterable default-first-option remote placeholder="输入部分编号来搜索">
            <el-option v-for="(item,index) in collectionListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择仓库" :label-width="formLabelWidth" prop="storeId">
          <el-select v-model="dataform.storeId" :remote-method="getRemoteStoreList" filterable default-first-option remote placeholder="输入关键字来搜索仓库">
            <el-option v-for="(item,index) in targetStoreListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量" :label-width="formLabelWidth" style="width:330px" prop="counter">
          <el-input v-model="dataform.counter" type="number" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" style="width:550px">
          <el-input v-model="dataform.backup" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inFormCancel">取 消</el-button>
        <el-button type="primary" @click="confirmIn">确 定</el-button>
      </div>
    </el-dialog>

    <!--出库操作的窗口-->
    <el-dialog title="出库操作" :visible.sync="outStoreFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="outForm" :model="dataform" :rules="rules">
        <el-form-item label="藏品名称" :label-width="formLabelWidth" prop="cid">
          <!-- <el-select v-model="dataform.cid" :remote-method="getRemoteCollectionList" filterable default-first-option remote placeholder="输入部分编号来搜索">
            <el-option v-for="(item,index) in collectionListOptions" :key="index" :label="item.cname" :value="item.cid" />
          </el-select> -->
          <el-select v-model="dataform.cid" disabled>
            <el-option v-for="(item,index) in collectionListOptions" :key="index" :label="item.cname" :value="item.cid" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择仓库" :label-width="formLabelWidth" prop="storeId">
          <el-select v-model="dataform.storeId" disabled>
            <el-option v-for="(item,index) in originStoreListOptions" :key="index" :label="item.storeName" :value="item.storeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="出库数量" :label-width="formLabelWidth" style="width:330px" prop="counter">
          <el-input v-model="dataform.counter" type="number" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" style="width:550px" prop="backup">
          <el-input v-model="dataform.backup" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOutFormVisible">取 消</el-button>
        <el-button type="primary" @click="confirmOut">确 定</el-button>
      </div>
    </el-dialog>

    <!--移库操作的窗口-->
    <el-dialog title="移库操作" :visible.sync="moveStoreFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="moveForm" :model="temp" :rules="rules" style="margin-left:50px;">
        <el-form-item label="藏品名称" :label-width="formLabelWidth" prop="cid">
          <el-select v-model="temp.cid" disabled>
            <el-option v-for="(item,index) in collectionListOptions" :key="index" :label="item.cname" :value="item.cid" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择源仓库" :label-width="formLabelWidth" prop="originStoreId">
          <el-select v-model="temp.originStoreId" disabled>
            <el-option v-for="(item,index) in originStoreListOptions" :key="index" :label="item.storeName" :value="item.storeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择目标仓库" :label-width="formLabelWidth" prop="targetStoreId">
          <el-select v-model="temp.targetStoreId" :remote-method="getRemoteStoreList" filterable default-first-option remote placeholder="输入关键字来搜索仓库">
            <el-option v-for="(item,index) in targetStoreListOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="移库数量" :label-width="formLabelWidth" style="width:330px" prop="counter">
          <el-input v-model="temp.counter" type="number" size="mini" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveFormVisible">取 消</el-button>
        <el-button type="primary" @click="confirmMove">确 定</el-button>
      </div>
    </el-dialog>

    <!--注销操作的窗口-->
    <el-dialog title="注销操作" :visible.sync="destroyStoreFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="destroyForm" :model="dataform" :rules="rules" style="margin-left:50px;">
        <el-form-item label="藏品名称" :label-width="formLabelWidth" prop="cid">
          <el-select v-model="dataform.cid" disabled>
            <el-option v-for="(item,index) in collectionListOptions" :key="index" :label="item.cname" :value="item.cid" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择源仓库" :label-width="formLabelWidth" prop="storeId">
          <el-select v-model="dataform.storeId" disabled>
            <el-option v-for="(item,index) in originStoreListOptions" :key="index" :label="item.storeName" :value="item.storeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="注销数量" :label-width="formLabelWidth" style="width:330px" prop="counter">
          <el-input v-model="dataform.counter" type="number" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" style="width:550px">
          <el-input v-model="dataform.backup" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destroyFormCancel">取 消</el-button>
        <el-button type="primary" @click="confirmDestroy">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, moveBusiness, inStoreBusiness, outStoreBusiness, listExport } from '@/api/business'
import * as destroy from '@/api/destroy'
import * as stores from '@/api/businessStore'
import * as collection from '@/api/collection'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
export default {
  name: 'BusinessList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'warning',
        2: 'danger',
        null: 'success'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      if (type === 1) {
        return '部分注销'
      } else if (type === 2) {
        return '已注销 '
      } else {
        return '正常 '
      }
    }
  },
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      exportList: null,
      list: null,
      total: 0,
      downloadLoading: false,
      listLoading: false,
      listQuery: {
        name: '',
        texture: '',
        years: '',
        category: '',
        level: '',
        origin: '',
        storeId: '',
        page: 1,
        limit: 20
      },
      inStoreFormVisible: false, // 控制入库窗口的显示隐藏
      outStoreFormVisible: false, // 控制出库窗口的显示隐藏
      moveStoreFormVisible: false, // 控制移库窗口的显示隐藏
      destroyStoreFormVisible: false, // 控制注销窗口的显示隐藏
      originStoreListOptions: [],
      targetStoreListOptions: [],
      collectionListOptions: [],

      // 入库和出库的表单
      dataform: {
        cid: undefined,
        storeId: '',
        counter: 0,
        backup: ''
      },
      // 移库操作的表单
      temp: {
        cid: undefined,
        originStoreId: '',
        targetStoreId: '',
        counter: 0
      },
      formLabelWidth: '120px',
      rules: {
        cid: [{ required: true, message: '请选择一个藏品', trigger: 'change' }],
        storeId: [{ required: true, message: '请选择一个仓库', trigger: 'change' }],
        counter: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        backup: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        originStoreId: [{ required: true, message: '请选择一个仓库', trigger: 'change' }],
        targetStoreId: [{ required: true, message: '请选择一个仓库', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.lst
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getRemoteCollectionList(name) {
      var vm = this
      collection.fetchList({ name: name, page: 1, limit: 99 }).then(response => {
        vm.collectionListOptions = response.data.lst
      })
    },
    getRemoteCurrentStoreList(name) {
      var vm = this
      stores.fetchBusinessStore(this.dataform.cid, name).then(response => {
        vm.originStoreListOptions = response.data
      })
    },
    getRemoteCurrentStoreListTemp(name) {
      var vm = this
      stores.fetchBusinessStore(this.temp.cid, name).then(response => {
        vm.originStoreListOptions = response.data
      })
    },
    getRemoteStoreList(name) {
      var vm = this
      stores.fetchList({ name: name, page: 1, limit: 99 }).then(response => {
        vm.targetStoreListOptions = response.data.lst
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
          if (this.dataform.counter < 1) {
            this.$message({
              // message: rule.field + '为必传项',
              message: '数量必须大于0',
              type: 'error'
            })
            return
          }
          inStoreBusiness(this.dataform).then(response => {
            this.$notify({
              title: 'Success',
              message: '入库成功',
              type: 'success',
              duration: 2000
            })
            vm.inFormCancel()
            vm.getList()
          })
        }
      })
    },
    // 打开出库操作窗口
    openOutStoreWindow(row) {
      var vm = this
      this.resetTemp()
      this.outStoreFormVisible = true
      this.$nextTick(() => {
        this.$refs['outForm'].clearValidate()
        vm.restOptions()
        console.log(row)
        vm.collectionListOptions.push(row)
        vm.originStoreListOptions.push(row)
        vm.dataform.cid = row.cid
        vm.dataform.storeId = row.storeId
      })
    },
    // 关闭出库窗口
    dialogOutFormVisible() {
      this.resetTemp()
      this.restOptions()
      this.outStoreFormVisible = false
    },
    // 确认出库操作
    confirmOut() {
      var vm = this
      this.$refs['outForm'].validate((valid) => {
        if (valid) {
          if (this.dataform.counter < 1) {
            this.$message({
              // message: rule.field + '为必传项',
              message: '数量必须大于0',
              type: 'error'
            })
            return
          }
          outStoreBusiness(this.dataform).then(response => {
            this.$notify({
              title: '成功',
              message: '出库成功',
              type: 'success',
              duration: 2000
            })
            vm.dialogOutFormVisible()
            vm.getList()
          })
        }
      })
    },
    // 打开移库操作窗口
    openMoveStoreWindow(row) {
      var vm = this
      this.resetTemp()
      this.moveStoreFormVisible = true
      this.$nextTick(() => {
        this.$refs['moveForm'].clearValidate()
        vm.restOptions()
        console.log(row)
        vm.collectionListOptions.push(row)
        vm.originStoreListOptions.push(row)
        vm.temp.cid = row.cid
        vm.temp.originStoreId = row.storeId
      })
    },
    // 关闭移库窗口
    dialogMoveFormVisible() {
      this.resetTemp()
      this.restOptions()
      this.moveStoreFormVisible = false
    },
    // 确认移库操作
    confirmMove() {
      var vm = this
      this.$refs['moveForm'].validate((valid) => {
        if (valid) {
          if (this.temp.counter < 1) {
            this.$message({
              // message: rule.field + '为必传项',
              message: '数量必须大于0',
              type: 'error'
            })
            return
          }
          if (this.temp.originStoreId === this.temp.targetStoreId) {
            this.$message({
              // message: rule.field + '为必传项',
              message: '源仓库和目标仓库不能相同',
              type: 'error'
            })
            return
          }
          moveBusiness(this.temp).then(response => {
            this.$notify({
              title: '成功',
              message: '移库成功',
              type: 'success',
              duration: 2000
            })
            vm.dialogMoveFormVisible()
            vm.getList()
          })
        }
      })
    },
    // 打开注销窗口
    openDestroyStoreWindow(row) {
      var vm = this
      this.resetTemp()
      this.destroyStoreFormVisible = true
      this.$nextTick(() => {
        this.$refs['destroyForm'].clearValidate()
        vm.restOptions()
        console.log(row)
        vm.collectionListOptions.push(row)
        vm.originStoreListOptions.push(row)
        vm.dataform.cid = row.cid
        vm.dataform.storeId = row.storeId
      })
    },
    // 关闭注销窗口
    destroyFormCancel() {
      this.resetDataForm()
      this.restOptions()
      this.destroyStoreFormVisible = false
    },
    // 确定注销操作
    confirmDestroy() {
      var vm = this
      this.$refs['destroyForm'].validate((valid) => {
        if (valid) {
          if (this.dataform.counter < 1) {
            this.$message({
              // message: rule.field + '为必传项',
              message: '数量必须大于0',
              type: 'error'
            })
            return
          }
          destroy.persist(this.dataform).then(response => {
            this.$notify({
              title: '提示',
              message: '注销成功',
              type: 'success',
              duration: 2000
            })
            vm.destroyFormCancel()
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
    resetTemp() {
      this.temp = {
        cid: undefined,
        originStoreId: '',
        targetStoreId: '',
        counter: 0
      }
    },
    restOptions() {
      this.originStoreListOptions = []
      this.targetStoreListOptions = []
      this.collectionListOptions = []
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      if (this.downloadLoading) {
        return
      }
      this.listLoading = true
      this.downloadLoading = true
      var vm = this
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['藏品名称', '总登记号', '文物编号', '藏品编号', '原始凭证号', '原名称',
          '藏品类别', '藏品质地1', '藏品质地2', '藏品质地3', '藏品级别', '藏品来源', '藏品年代',
          '入藏时间', '入藏年度', '长度(cm)', '高度(cm)', '宽度(cm)', '质量范围', '质量(kg)', '尺寸描述',
          '藏品质地', '完残程度', '完残状况', '保存状况', '版本', '存卷', '时间', '地点', '收集者', '照相号',
          '拓片号', '鉴定情况', '标识', '备注', '录入时间', '库房位置', '数量']

        const filterVal = ['name', 'code', 'zcode', 'wcode', 'ycode', 'oldName', 'category',
          'texture', 'texture1', 'texture', 'level', 'origin', 'years', 'inTimeRange', 'inYear',
          'length', 'height', 'width', 'massRange', 'mass', 'sizeText', 'texture', 'completeness', 'completeStatus',
          'restore', 'version', 'saved', 'times', 'address', 'research', 'pno', 'tno', 'jstatus', 'sign', 'detail', 'createTime',
          'location', 'total']
        listExport(this.listQuery).then(response => {
          vm.exportList = response.data
          const data = this.formatJson(filterVal, vm.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '藏品信息导出' + parseTime(new Date())
          })
          vm.listLoading = false
          vm.downloadLoading = false
        }).catch(() => {
          vm.listLoading = false
          vm.downloadLoading = false
        })
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
