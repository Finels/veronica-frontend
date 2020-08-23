<template>
  <div class="app-container" style="max-height: 600px;">
    <div class="filter-container">
      <el-select v-model="listQuery.type" class="filter-item" clearable filterable default-first-option placeholder="选择科目来搜索">
        <el-option v-for="(item,index) in typeListOptions" :key="index" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-folder-add" @click="handleCreate()">
        添加
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="success" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row max-height="800" style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <router-link :to="'/coach/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-popconfirm icon="el-icon-info" icon-color="red" title="确定删除教练吗，将删除其所有班次以及预约" @onConfirm="handleDel(scope.row.id)">
            <el-button slot="reference" type="danger" size="small" icon="el-icon-delete">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column width="320px" align="center" label="教练名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <el-avatar shape="square" :size="150" fit="contain" :src="scope.row.img!=null?scope.row.img:'@/assets/404_images/404_cloud.png'" />
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="联系方式">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column width="220px" align="center" label="所属科目">
        <template slot-scope="scope">
          <span>{{ scope.row.type |typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.backup }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
import { fetchList, delCoach } from '@/api/coach'
// import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import router from '@/router'
import { parseTime } from '@/utils'
export default {
  name: 'ArticleList',
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
        type: 1,
        page: 1,
        limit: 20
      },
      typeListOptions: [{ id: 1, name: '科目二' }, { id: 2, name: '科目三' }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery.type).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleCreate() {
      console.log('11111')
      router.push('/coach/create/')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDel(id) {
      var me = this
      delCoach(id).then(response => {
        this.$notify({
          title: '提示',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        me.getList()
      })
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['藏品名称', '藏品编号', '总登记号', '藏品类别', '藏品级别', '藏品来源', '藏品年代',
    //       '入藏时间', '入藏年度', '长度(cm)', '高度(cm)', '宽度(cm)', '质量(g)', '尺寸描述',
    //       '藏品质地', '完残程度', '完残状况', '保存状况', '备注', '录入时间', '图片']

    //     for (var i in this.list) {
    //       for (var j in this.list[i].imgUrls) {
    //         this.list[i].eximgs += this.list[i].imgUrls[j].url + ';'
    //       }
    //     }
    //     const filterVal = ['name', 'code', 'zcode', 'category', 'level', 'origin', 'years', 'inTimeRange', 'inYear',
    //       'length', 'height', 'width', 'mass', 'sizeText', 'texture', 'completeness', 'completeStatus', 'restore', 'detail', 'createTime',
    //       'eximgs']
    //     const data = this.formatJson(filterVal, this.list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: '藏品信息导出' + parseTime(new Date())
    //     })
    //     this.downloadLoading = false
    //   })
    // },
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
