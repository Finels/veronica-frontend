<template>
  <el-table :data="tops" style="width: 100%;padding-top: 15px;">
    <el-table-column label="仓库名" min-width="150" align="center">
      <template slot-scope="scope">
        {{ scope.row.storeName }}
      </template>
    </el-table-column>
    <el-table-column label="库存数" width="120" align="center">
      <template slot-scope="scope">
        {{ scope.row.counter }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import * as dashboard from '@/api/dashboard'

export default {
  data() {
    return {
      tops: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      dashboard.fetchTops().then(response => {
        this.tops = response.data.tops
      })
    }
  }
}
</script>
