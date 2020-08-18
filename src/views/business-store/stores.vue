<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="输入仓库编号来查询" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.floor" placeholder="输入橱柜编号来查询" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.location" placeholder="输入层位编号来查询" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-folder-add" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.$index }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" sortable prop="number" label="仓库编号">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.code" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220" align="center" sortable prop="number" label="橱柜编号">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.floor" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.floor }}</span>
        </template>
      </el-table-column>
      <el-table-column width="220" align="center" sortable prop="number" label="层位编号">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.location" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.location }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180" align="center" label="管理员">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.administrator" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.administrator }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" width="260">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.backup" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.backup }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            class="cancel-btn"
            size="small"
            icon="el-icon-refresh"
            type="warning"
            @click="cancelEdit(row)"
          >
            取消
          </el-button>
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit(row)"
          >
            保存
          </el-button>
          <el-button
            v-if="!row.edit"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
          <el-popconfirm v-if="!row.edit" icon="el-icon-info" icon-color="red" title="确定删除该仓库吗？" @onConfirm="handleDel(row)">
            <el-button
              slot="reference"
              type="danger"
              size="small"
              icon="el-icon-remove"
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, persist, del } from '@/api/businessStore'
import Pagination from '@/components/Pagination'
export default {
  name: 'Stores',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        code: '',
        floor: '',
        location: '',
        page: 1,
        limit: 20
      },
      firstLoad: false,
      rules: {
        code: [{ required: true, message: '请选输入仓库编号', trigger: 'blur' }],
        floor: [{ required: true, message: '请输入橱柜编号', trigger: 'blur' }],
        location: [{ required: true, message: '请输入层位编号', trigger: 'blur' }],
        administrator: [{ required: true, message: '请输入管理员', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchList(this.listQuery)
      const items = data.lst
      this.total = data.total
      var index = 0
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        this.$set(v, 'persist', true)
        this.$set(v, 'rowIndex', index)
        index += 1
        // v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    handleFilter() {
      this.getList()
    },
    handleDel(row) {
      var vm = this
      del(row.id).then(response => {
        row.persist = false
        vm.cancelEdit(row)
      })
    },
    handleCreate() {
      if (this.list != null && this.list.length > 0) {
        this.list.push({ code: '', floor: '', location: '', administrator: '', backup: '', edit: true, persist: false, rowIndex: this.list.length })
      } else {
        this.firstLoad = true
        this.list = []
        this.list.push({ code: '', floor: '', location: '', administrator: '', backup: '', edit: true, persist: false, rowIndex: this.list.length })
      }
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      if (!row.persist && row.rowIndex != null) {
        this.list.splice(row.rowIndex, 1)
      }
      // this.$message({
      //   message: 'The title has been restored to the original value',
      //   type: 'warning'
      // })
    },
    confirmEdit(row) {
      // 校验字段
      if (row.code == null || row.code === '') {
        this.$message({
          message: '仓库编号不能为空',
          type: 'error'
        })
        return
      } else if (row.floor == null || row.floor === '') {
        this.$message({
          message: '橱柜编号不能为空',
          type: 'error'
        })
        return
      } else if (row.location == null || row.location === '') {
        this.$message({
          message: '层位编号不能为空',
          type: 'error'
        })
        return
      }
      persist(row).then(response => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        row.edit = false
        row.persist = true
      }).catch(() => {
        row.edit = true
      })
      // row.originalTitle = row.title
      // this.$message({
      //   message: 'The title has been edited',
      //   type: 'success'
      // })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 0;
}
</style>
