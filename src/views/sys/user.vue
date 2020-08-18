<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="输入用户名来搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-finished" @click="openUserWindow">
        添加用户
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">
            {{ scope.row.enable | typeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.backup }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-help" @click="openMoveStoreWindow(scope.row)">
            修改密码
          </el-button>
          <el-popconfirm icon="el-icon-info" icon-color="red" title="确定禁用该用户吗？" @onConfirm="handleDel(scope.row)">
            <el-button
              slot="reference"
              type="danger"
              size="small"
              icon="el-icon-remove"
            >
              禁用
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--添加操作的窗口-->
    <el-dialog title="添加用户" :visible.sync="inUserFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="inForm" :model="dataform" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" style="width:340px" prop="username">
          <el-input v-model="dataform.username" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" style="width:340px" prop="password">
          <el-input v-model="dataform.password" type="password" />
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth" style="width:400px">
          <el-select v-model="dataform.role" clearable style="width: 130px" class="filter-item" disabled>
            <el-option v-for="item in selectRolesOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth" style="width:400px" prop="realName">
          <el-input v-model="dataform.realName" />
        </el-form-item>
        <!-- <el-form-item label="电话" :label-width="formLabelWidth" style="width:400px" prop="result">
          <el-input v-model="dataform.result" />
        </el-form-item> -->
        <el-form-item label="备注" :label-width="formLabelWidth" style="width:550px">
          <el-input v-model="dataform.backup" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inFormCancel">取 消</el-button>
        <el-button type="primary" @click="confirmIn">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改密码操作的窗口-->
    <el-dialog title="修改密码" :visible.sync="moveStoreFormVisible" lock-scroll :close-on-click-modal="false">
      <el-form ref="moveForm" :model="dataform" :rules="rules" style="margin-left:50px;">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="cid">
          <el-input v-model="dataform.username" disabled />
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="dataform.password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveFormVisible">取 消</el-button>
        <el-button type="primary" @click="confirmMove">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as user from '@/api/user'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      if (type === 0) {
        return '已禁用'
      } else {
        return '已启用'
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
        page: 1,
        limit: 20
      },
      inUserFormVisible: false, // 控制入库窗口的显示隐藏
      moveStoreFormVisible: false,
      selectRolesOptions: [{ id: 'NORMAL', name: '普通用户' }, { id: 'ADMIN', name: '管理员' }],

      // 添加的表单
      dataform: {
        username: '',
        password: '',
        realName: '',
        role: 'NORMAL',
        tel: '',
        backup: ''
      },
      formLabelWidth: '120px',
      rules: {
        username: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
        password: [{ required: true, message: '密码为必填项', trigger: 'blur' }],
        realName: [{ required: true, message: '真实姓名为必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      user.fetchList(this.listQuery).then(response => {
        this.list = response.data.lst
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 打开入库窗口
    openUserWindow() {
      var vm = this
      this.resetDataForm()
      this.inUserFormVisible = true
      this.$nextTick(() => {
        this.$refs['inForm'].clearValidate()
        vm.restOptions()
      })
    },
    // 关闭入库窗口
    inFormCancel() {
      this.resetDataForm()
      this.inUserFormVisible = false
    },
    // 确定入库操作
    confirmIn() {
      var vm = this
      this.$refs['inForm'].validate((valid) => {
        if (valid) {
          if (!/^[a-z]+$/.test(this.dataform.username)) {
            this.$message({
              // message: rule.field + '为必传项',
              message: '用户名只能为小写字母，不能包含数字和特殊符号',
              type: 'error'
            })
            return
          }
          user.register(this.dataform).then(response => {
            this.$notify({
              title: 'Success',
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
    // 打开移库操作窗口
    openMoveStoreWindow(row) {
      var vm = this
      this.moveStoreFormVisible = true
      this.$nextTick(() => {
        this.$refs['moveForm'].clearValidate()
        console.log(row)
        vm.dataform = row
        vm.dataform.password = ''
      })
    },
    // 关闭移库窗口
    dialogMoveFormVisible() {
      this.moveStoreFormVisible = false
    },
    // 确认移库操作
    confirmMove() {
      var vm = this
      this.$refs['moveForm'].validate((valid) => {
        if (valid) {
          if (this.dataform.password.length < 6) {
            this.$message({
              // message: rule.field + '为必传项',
              message: '密码长度必须大于6',
              type: 'error'
            })
            return
          }
          user.register(this.dataform).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功,该用户下次登录时生效',
              type: 'success',
              duration: 2000
            })
            vm.dialogMoveFormVisible()
            vm.getList()
          })
        }
      })
    },
    // 删除用户
    handleDel(row) {
      var vm = this
      user.del(row.id).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功，该用户下次登录时生效',
          type: 'success',
          duration: 2000
        })
        vm.getList()
      })
    },
    resetDataForm() {
      this.dataform = {
        username: '',
        password: '',
        realName: '',
        role: 'NORMAL',
        tel: '',
        backup: ''
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
