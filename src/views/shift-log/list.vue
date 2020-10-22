<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.resource" placeholder="请选择资源类别" clearable class="filter-item">
        <el-option v-for="item in resourceOptionList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="选择科目" clearable style="width: 130px" class="filter-item" @change="getQueryRemoteCoachList">
        <el-option v-for="item in typeListOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.coachId" class="filter-item" clearable filterable placeholder="选择教练来搜索">
        <el-option v-for="(item,index) in targetCoachListOptions" :key="index" :label="item.name" :value="item.id" />
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
      <el-table-column width="160px" align="center" label="科目类别">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="教练名称">
        <template slot-scope="scope">
          <span>{{ scope.row.coachName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="学员名称">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="学员电话">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
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
      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.enable | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="使用情况">
        <template slot-scope="scope">
          <span>{{ scope.row.used | usedFilter }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { fetchList1 } from '@/api/shift-log'
import * as coach from '@/api/coach'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
export default {
  name: 'InoutRecord',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      if (type == 1) {
        return '科目二'
      } else if (type == 2) {
        return '科目三'
      }
    },
    statusFilter(status) {
      if (status) {
        return '正常'
      } else {
        return '已取消'
      }
    },
    usedFilter(used) {
      if (used) {
        return '已使用'
      } else {
        return '未使用'
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
        coachId: '',
        startTime: '',
        endTime: '',
        page: 1,
        limit: 20,
        resource: null
      },
      resourceOptionList: [],
      typeListOptions: [{ id: 1, name: '科目二' }, { id: 2, name: '科目三' }],
      targetCoachListOptions: []

    }
  },
  created() {
    this.getResourceOptionList()
  },
  methods: {
    getResourceOptionList() {
      coach.fetchResourceList().then(response => {
        this.resourceOptionList = response.data
        this.listQuery.resource = this.resourceOptionList[0].id
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      fetchList1(this.listQuery).then(response => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['科目类别', '教练名称', '学员名称', '学员电话', '开始时间', '结束时间', '状态', '使用情况']
        for (var i in this.list) {
          if (this.list[i].type === 1) {
            this.list[i].typeDsc = '科目二'
          } else if (this.list[i].type === 2) {
            this.list[i].typeDsc = '科目三'
          }

          if (this.list[i].enable) {
            this.list[i].enableDsc = '正常'
          } else {
            this.list[i].enableDsc = '已取消'
          }

          if (this.list[i].used) {
            this.list[i].usedDsc = '已完成'
          } else {
            this.list[i].usedDsc = '未完成'
          }
        }
        const filterVal = ['typeDsc', 'coachName', 'username', 'tel', 'shiftDateStart', 'shiftDateEnd', 'enableDsc', 'usedDsc']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '预约记录导出' + parseTime(new Date())
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
