<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.name" placeholder="类型" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in selectCategoryOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      &nbsp;&nbsp;
      <el-date-picker v-model="listQuery.startTime" class="filter-item" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间段" />
      至
      <el-date-picker v-model="listQuery.endTime" class="filter-item" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间段" />
      &nbsp;&nbsp;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
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
      <el-table-column align="center" label="操作类型">
        <template slot-scope="scope">
          <span>{{ scope.row.recordType | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="藏品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.collectionName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="仓库名">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouse }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作前库存数">
        <template slot-scope="scope">
          <span>{{ scope.row.beforeCounter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作数量">
        <template slot-scope="scope">
          <span>{{ scope.row.counter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作后库存数">
        <template slot-scope="scope">
          <span>{{ scope.row.afterCounter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="操作人">
        <template slot-scope="scope">
          <span>{{ scope.row.optUser }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.optTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.backup }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { fetchList } from '@/api/record'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
export default {
  name: 'InoutRecord',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      if (type == 0) {
        return '入库'
      } else {
        return '出库'
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
        name: '',
        startTime: '',
        endTime: '',
        page: 1,
        limit: 20
      },
      selectCategoryOptions: [
        { id: 0, name: '入库' },
        { id: 1, name: '出库' }
      ]
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
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['操作类型', '藏品名称', '仓库名', '操作前库存数', '操作数', '操作后库存数', '操作人',
          '操作时间', '备注']
        for (var i in this.list) {
          if (this.list[i].recordType == 0) {
            this.list[i].recordTypeDsc = '入库'
          } else {
            this.list[i].recordTypeDsc = '出库'
          }
        }
        const filterVal = ['recordTypeDsc', 'collectionName', 'warehouse', 'beforeCounter', 'counter', 'afterCounter', 'optUser', 'optTime', 'backup']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '出入库记录导出' + parseTime(new Date())
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
