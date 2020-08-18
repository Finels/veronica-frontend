<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="藏品名称" min-width="200" align="center">
      <template slot-scope="scope">
        {{ scope.row.collectionName }}
      </template>
    </el-table-column>
    <el-table-column label="操作类型" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.recordType | statusFilter">
          {{ row.recordType | typeFilter }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作数量" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.counter }}
      </template>
    </el-table-column>
    <el-table-column label="操作时间" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.optTime }}
      </template>
    </el-table-column>
    <el-table-column label="操作人" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.optUser }}
      </template>
    </el-table-column>
    <el-table-column label="备注" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.backup }}
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
import * as dashboard from '@/api/dashboard'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    },
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
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      dashboard.fetchList().then(response => {
        this.list = response.data.lst
      })
    }
  }
}
</script>
