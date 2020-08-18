<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" class="sub-navbar">
        <el-button v-loading="loading" style="margin-left: 15px;" type="success" @click="submitForm">
          保存
        </el-button>
        <el-button v-loading="loading" type="warning" @click="cancelBtn">
          取消
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="name">
              <MDinput v-model="postForm.name" :maxlength="100" required>
                藏品名称
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-card class="box-card" style="margin-bottom:20px">
                  <div slot="header" class="clearfix">
                    <span>基础信息</span>
                  </div>
                  <div class="component-item">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="总登记号:" class="postInfo-container-item" prop="code">
                          <el-input v-model="postForm.code" placeholder="请输入总登记号" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="文物编号:" class="postInfo-container-item">
                          <el-input v-model="postForm.zcode" type="number" placeholder="请输入文物编号" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="藏品编号:" class="postInfo-container-item">
                          <el-input v-model="postForm.wcode" placeholder="请输入藏品编号" />
                        </el-form-item>
                      </el-col>

                      <el-col :span="6">
                        <el-form-item label-width="90px" label="原始凭证号:" class="postInfo-container-item">
                          <el-input v-model="postForm.ycode" type="number" placeholder="原始凭证号" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="原名称:" class="postInfo-container-item">
                          <el-input v-model="postForm.oldName" placeholder="请输入原名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="文物级别:" class="postInfo-container-item">
                          <!-- <el-input v-model="postForm.level" placeholder="请输入藏品级别" /> -->
                          <el-select v-model="postForm.level" placeholder="请选择文物级别" clearable class="filter-item">
                            <el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="文物来源:" class="postInfo-container-item">
                          <el-select v-model="postForm.origin" placeholder="请选择来源" clearable class="filter-item">
                            <el-option v-for="item in originOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="文物类别:" class="postInfo-container-item">
                          <el-select v-model="postForm.category" placeholder="请选择文物类别" clearable class="filter-item">
                            <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="年代:" class="postInfo-container-item">
                          <!-- <el-input v-model="postForm.years" placeholder="请输入年代" /> -->
                          <el-cascader
                            v-model="postForm.years"
                            :options="yearsOptions"
                            :show-all-levels="false"
                            :props="yearsProps"
                            emit-path
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="具体年代:" class="postInfo-container-item">
                          <el-input v-model="postForm.yearsDate" placeholder="请输入具体年代" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="入藏时间:" class="postInfo-container-item">
                          <el-select v-model="postForm.inTimeRange" placeholder="请选择入藏时间" clearable class="filter-item">
                            <el-option v-for="item in inTimeRangeOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="入藏年度:" class="postInfo-container-item">
                          <el-input v-model="postForm.inYear" placeholder="请输入入藏年度" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="数量类型:" class="postInfo-container-item">
                          <el-select v-model="postForm.counterType" placeholder="请选择数量类型" clearable class="filter-item">
                            <el-option v-for="item in counterTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="实际数量:" class="postInfo-container-item">
                          <el-input v-model="postForm.counter" type="number" placeholder="请输入数量" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
                <!-- <el-col :span="10">
                  <el-form-item label-width="120px" label="入馆时间" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                  </el-form-item>
                </el-col> -->
              </el-row>

              <el-row>
                <el-card class="box-card" style="margin-bottom:20px">
                  <div slot="header" class="clearfix">
                    <span>质量尺寸</span>
                  </div>
                  <div class="component-item">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="通长:" class="postInfo-container-item">
                          <el-input v-model="postForm.length" type="number" placeholder="单位：cm(厘米)" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="通高:" class="postInfo-container-item">
                          <el-input v-model="postForm.height" type="number" placeholder="单位：cm(厘米)" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="通宽:" class="postInfo-container-item">
                          <el-input v-model="postForm.width" type="number" placeholder="单位：cm(厘米)" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label-width="90px" label="尺寸描述:" class="postInfo-container-item">
                          <el-input v-model="postForm.sizeText" style="width:484px" type="textarea" placeholder="请输入具体的尺寸描述" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="质量范围:" class="postInfo-container-item">
                          <el-select v-model="postForm.massRange" placeholder="请选择质量范围" clearable class="filter-item">
                            <el-option v-for="item in massRangeOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="具体质量:" class="postInfo-container-item">
                          <el-input v-model="postForm.mass" type="number" placeholder="单位：kg(千克)" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
                <!-- <el-col :span="10">
                  <el-form-item label-width="120px" label="入馆时间" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                  </el-form-item>
                </el-col> -->
              </el-row>

              <el-row>
                <el-card class="box-card" style="margin-bottom:20px">
                  <div slot="header" class="clearfix">
                    <span>藏品状态</span>
                  </div>
                  <div class="component-item">
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label-width="90px" label="质地类别1:" class="postInfo-container-item">
                          <el-select v-model="postForm.texture" placeholder="请选择质地" clearable class="filter-item">
                            <el-option v-for="item in textureOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label-width="90px" label="质地类别2:" class="postInfo-container-item">
                          <el-select v-model="postForm.texture1" placeholder="请选择质地" clearable class="filter-item">
                            <el-option v-for="item in textureOptions1" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label-width="90px" label="质地类别3:" class="postInfo-container-item">
                          <el-input v-model="postForm.texture2" placeholder="请输入其他质地" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label-width="90px" label="完残程度:" class="postInfo-container-item">
                          <el-select v-model="postForm.completeness" placeholder="请选择完残程度" clearable class="filter-item">
                            <el-option v-for="item in completenessOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label-width="90px" label="完残状况:" class="postInfo-container-item">
                          <el-input v-model="postForm.completeStatus" placeholder="请输入完残状况" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label-width="90px" label="保存状况:" class="postInfo-container-item">
                          <el-select v-model="postForm.restore" placeholder="请选择保存状况" clearable class="filter-item">
                            <el-option v-for="item in restoreOptions" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-row>
              <el-row>
                <el-card class="box-card" style="margin-bottom:20px">
                  <div slot="header" class="clearfix">
                    <span>其他</span>
                  </div>
                  <div class="component-item">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="著者:" class="postInfo-container-item">
                          <el-input v-model="postForm.author" placeholder="请输入著者" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="版本:" class="postInfo-container-item">
                          <el-input v-model="postForm.version" placeholder="请输入版本" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="存卷:" class="postInfo-container-item">
                          <el-input v-model="postForm.saved" placeholder="请输入存卷" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="时间:" class="postInfo-container-item">
                          <el-input v-model="postForm.times" placeholder="请输入时间" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="照相号:" class="postInfo-container-item">
                          <el-input v-model="postForm.pno" placeholder="请输入照相号" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="拓片号:" class="postInfo-container-item">
                          <el-input v-model="postForm.tno" placeholder="请输入拓片号" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="鉴定情况:" class="postInfo-container-item">
                          <el-input v-model="postForm.jstatus" placeholder="请输入鉴定情况" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="标识:" class="postInfo-container-item">
                          <el-input v-model="postForm.sign" placeholder="请输入标识" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-row>
              <el-row>
                <el-card class="box-card" style="margin-bottom:20px">
                  <div slot="header" class="clearfix">
                    <span>考古发掘信息</span>
                  </div>
                  <div class="component-item">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="地点:" class="postInfo-container-item">
                          <el-input v-model="postForm.address" placeholder="请输入地点" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="收集者:" class="postInfo-container-item">
                          <el-input v-model="postForm.research" placeholder="请输入收集者" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-row>
              <el-row>
                <el-card class="box-card" style="margin-bottom:20px">
                  <div slot="header" class="clearfix">
                    <span>库存信息</span>
                  </div>
                  <div class="component-item">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="仓库编号:" class="postInfo-container-item">
                          <el-input v-model="postForm.warehouseCode" placeholder="请输入仓库编号" :disabled="postForm.isBusiness==1" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="橱柜编号:" class="postInfo-container-item">
                          <el-input v-model="postForm.warehouseFloor" placeholder="请输入橱柜编号" :disabled="postForm.isBusiness==1" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="层位编号:" class="postInfo-container-item">
                          <el-input v-model="postForm.warehouseLocation" placeholder="请输入层位编号" :disabled="postForm.isBusiness==1" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label-width="90px" label="库存件数:" class="postInfo-container-item">
                          <el-input v-model="postForm.businessTotal" type="number" placeholder="请输入件数" :disabled="postForm.isBusiness==1" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="藏品描述:">
          <el-input v-model="postForm.detail" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入其他备注" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <!-- <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item> -->

        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <dropzone
            id="myVueDropzone"
            url="http://116.63.132.6:8080/collection/upload"
            accepted-files="image/*,application/pdf,.psd"
            :default-img="postForm.imgUrls"
            :show-remove-link="showRemoveLink"
            @dropzone-removedFile="dropzoneR"
            @dropzone-success="dropzoneS"
            @dropzone-successmultiple="dropzoneM"
            @dropzone-fileAdded="dropzoneBefore"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchDetail, upsertCollection } from '@/api/collection'
import { fetchList } from '@/api/businessStore'
import Dropzone from '@/components/Dropzone'
import router from '../../../router'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  id: undefined,
  name: '', // 藏品名称
  oldName: '', // 藏品名称
  code: '', // 藏品编号
  zcode: '', // 总登记号
  ycode: '', // 总登记号
  detail: '', // 备注
  years: '', // 年份
  yearsDate: '', // 年份
  author: '',
  category: '', // 类型
  texture: '', // 质地
  texture1: '', // 质地
  texture2: '', // 质地
  length: 0, // 长
  width: 0, // 宽
  height: 0, // 高
  mass: 0, // 质量
  massRange: '',
  sizeText: '', // 尺寸描述
  level: '', // 文物级别
  origin: '', // 来源
  completeness: '', // 完残程度
  completeStatus: '', // 完残状况
  restore: '', // 保存状况
  inTimeRange: '', // 入藏时间范围
  inYear: '', // 入藏年度信息
  counter: 0,
  counterType: '',
  version: '',
  saved: '',
  times: '',
  address: '',
  research: '',
  pno: '',
  tno: '',
  jstatus: '',
  sign: '',
  isBusiness: 0,
  imgUrls: [],
  warehouseCode: '',
  warehouseFloor: '',
  warehouseLocation: '',
  businessTotal: '',
  // imgArray: [], // dropzone的初始图片
  comment_disabled: false
}

export default {
  name: 'Detail',
  components: { MDinput, Dropzone, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // const validateRequire = (rule, value, callback) => {
    //   if (value === '') {
    //     this.$message({
    //       // message: rule.field + '为必传项',
    //       message: rule.field + '为必传项',
    //       type: 'error'
    //     })
    //     callback(new Error('此项为必传项'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      showRemoveLink: true,
      storeListOptions: [],
      rules: {
        name: [{ required: true, message: '名称为必填项', trigger: 'change' }],
        code: [{ required: true, message: '编号为必填项', trigger: 'change' }],
        zcode: [{ required: true, message: '总登记号为必填项', trigger: 'change' }]
      },
      tempRoute: {},
      tempPicture: [],
      textureOptions: [{ id: '单一质地', name: '单一质地' }, { id: '复合质地', name: '复合质地' }],
      textureOptions1: [{ id: '有机质', name: '有机质' }, { id: '无机质', name: '无机质' }],
      originOptions: [{ id: '征集购买', name: '征集购买' }, { id: '接受捐赠', name: '接受捐赠' }, { id: '依法交换', name: '依法交换' },
        { id: '拨交', name: '拨交' }, { id: '移交', name: '移交' }, { id: '旧藏', name: '旧藏' }, { id: '发掘', name: '发掘' },
        { id: '采集', name: '采集' }, { id: '拣选', name: '拣选' }, { id: '其他', name: '其他' }],
      categoryOptions: [{ id: '金银器', name: '金银器' }, { id: '陶器', name: '陶器' }, { id: '玉石器、宝石', name: '玉石器、宝石' },
        { id: '瓷器', name: '瓷器' }, { id: '铜器', name: '铜器' }, { id: '铁器、其他金属器', name: '铁器、其他金属器' },
        { id: '漆器', name: '漆器' }, { id: '雕塑、造像', name: '雕塑、造像' }, { id: '石器、石刻、砖瓦', name: '石器、石刻、砖瓦' },
        { id: '书法、绘画', name: '书法、绘画' }, { id: '文具', name: '文具' }, { id: '甲骨', name: '甲骨' }, { id: '玺印符牌', name: '玺印符牌' },
        { id: '钱币', name: '钱币' }, { id: '牙骨角器', name: '牙骨角器' }, { id: '竹木雕', name: '竹木雕' }, { id: '家具', name: '家具' },
        { id: '珐琅器', name: '珐琅器' }, { id: '织绣', name: '织绣' }, { id: '古籍图书', name: '古籍图书' }, { id: '碑帖拓本', name: '碑帖拓本' },
        { id: '武器', name: '武器' }, { id: '邮品', name: '邮品' }, { id: '文件、宣传品', name: '文件、宣传品' }, { id: '档案文书', name: '档案文书' },
        { id: '名人遗物', name: '名人遗物' }, { id: '玻璃器', name: '玻璃器' }, { id: '乐器、法器', name: '乐器、法器' },
        { id: '皮革', name: '皮革' }, { id: '音像制品', name: '音像制品' }, { id: '票据', name: '票据' }, { id: '交通、运输工具', name: '交通、运输工具' },
        { id: '度量衡器', name: '度量衡器' }, { id: '标本、化石', name: '标本、化石' }, { id: '其他', name: '其他' }],
      levelOptions: [{ id: '一级', name: '一级' }, { id: '二级', name: '二级' }, { id: '三级', name: '三级' }, { id: '一般', name: '一般' },
        { id: '未定级', name: '未定级' }],
      completenessOptions: [{ id: '完整', name: '完整' }, { id: '基本完整', name: '基本完整' }, { id: '残缺', name: '残缺' },
        { id: '严重残缺(含缺失部件)', name: '严重残缺(含缺失部件)' }],
      restoreOptions: [{ id: '状态稳定，不需修复', name: '状态稳定，不需修复' }, { id: '部分损腐，需要修复', name: '部分损腐，需要修复' },
        { id: '腐蚀损毁严重，急需修复', name: '腐蚀损毁严重，急需修复' }, { id: '已修复', name: '已修复' }],
      massRangeOptions: [{ id: '<0.01 kg', name: '<0.01 kg' }, { id: '0.01-1 kg', name: '0.01-1 kg' },
        { id: '1-50 kg', name: '1-50 kg' }, { id: '50-100 kg', name: '50-100 kg' }, { id: '100-1000 kg', name: '100-1000 kg' },
        { id: '>1000 kg', name: '>1000 kg' }],
      inTimeRangeOptions: [{ id: '1949.10.1前', name: '1949.10.1前' }, { id: '1949.10.1-1965', name: '1949.10.1-1965' },
        { id: '1966-1976', name: '1966-1976' },
        { id: '1977-2000', name: '1977-2000' }, { id: '2001至今', name: '2001至今' }],
      counterTypeOptions: [{ id: '单件', name: '单件' }, { id: '一套多件', name: '一套多件' }],
      yearsOptions: [{
        label: '地质年代',
        value: '地质年代',
        children: [{
          label: '显生宙',
          value: '显生宙',
          children: [{
            label: '新生代',
            value: '新生代',
            children: [{
              label: '第四纪',
              value: '第四纪'
            }, {
              label: '新近纪',
              value: '新近纪'
            }, {
              label: '古近纪',
              value: '古近纪'
            }]
          }, {
            label: '中生代',
            value: '中生代',
            children: [{
              label: '白垩纪',
              value: '白垩纪'
            }, {
              label: '侏罗纪',
              value: '侏罗纪'
            }, {
              label: '三叠纪',
              value: '三叠纪'
            }]
          }, {
            label: '古生代',
            value: '古生代',
            children: [{
              label: '二叠纪',
              value: '二叠纪'
            }, {
              label: '石炭纪',
              value: '石炭纪'
            }, {
              label: '泥盆纪',
              value: '泥盆纪'
            }, {
              label: '志留纪',
              value: '志留纪'
            }, {
              label: '奥陶纪',
              value: '奥陶纪'
            }, {
              label: '寒武纪',
              value: '寒武纪'
            }]
          }]
        }, {
          label: '元古宙',
          value: '元古宙',
          children: [{
            label: '新元古代',
            value: '新元古代',
            children: [{
              label: '埃迪卡拉纪',
              value: '埃迪卡拉纪'
            }, {
              label: '成冰纪',
              value: '成冰纪'
            }, {
              label: '拉伸纪',
              value: '拉伸纪'
            }]
          }, {
            label: '中元古代',
            value: '中元古代',
            children: [{
              label: '狭带纪',
              value: '狭带纪'
            }, {
              label: '延展纪',
              value: '延展纪'
            }, {
              label: '盖层纪',
              value: '盖层纪'
            }]
          }, {
            label: '古元古代',
            value: '古元古代',
            children: [{
              label: '固结纪',
              value: '固结纪'
            }, {
              label: '造山纪',
              value: '造山纪'
            }, {
              label: '层侵纪',
              value: '层侵纪'
            }, {
              label: '成铁纪',
              value: '成铁纪'
            }]
          }]
        }, {
          label: '太古宙',
          value: '太古宙',
          children: [{
            label: '新太古代',
            value: '新太古代'
          }, {
            label: '中太古代',
            value: '中太古代'
          }, {
            label: '古太古代',
            value: '古太古代'
          }, {
            label: '始太古代',
            value: '始太古代'
          }]
        }, {
          label: '冥古宙',
          value: '冥古宙',
          children: [{
            label: '雨海代',
            value: '雨海代'
          }, {
            label: '酒神代',
            value: '酒神代'
          }, {
            label: '原生代',
            value: '原生代'
          }, {
            label: '隐生代',
            value: '隐生代'
          }]
        }]
      }, {
        label: '考古学年代',
        value: '考古学年代',
        children: [{
          label: '旧石器时代',
          value: '旧石器时代'
        }, {
          label: '新石器时代',
          value: '新石器时代'
        }]
      }, {
        label: '中国历史学年代',
        value: '中国历史学年代',
        children: [{
          label: '夏(约前2070~前1600)',
          value: '夏(约前2070~前1600)'
        }, {
          label: '商(前1600~前1046)',
          value: '商(前1600~前1046)'
        }, {
          label: '周',
          value: '周',
          children: [{
            label: '西周(前1046~前771)',
            value: '西周(前1046~前771)'
          }, {
            label: '东周(前770~前256)',
            value: '东周(前770~前256)'
          }, {
            label: '春秋时代(前770~前476)',
            value: '春秋时代(前770~前476)'
          }, {
            label: '战国时代(前475~前221)',
            value: '战国时代(前475~前221)'
          }]
        }, {
          label: '秦(前221~前206)',
          value: '秦(前221~前206)'
        }, {
          label: '汉',
          value: '汉',
          children: [{
            label: '西汉(前206~公元25)',
            value: '西汉(前206~公元25)'
          }, {
            label: '东汉(25~220)',
            value: '东汉(25~220)'
          }]
        }, {
          label: '三国',
          value: '三国',
          children: [{
            label: '三国·魏(220~265)',
            value: '三国·魏(220~265)'
          }, {
            label: '三国·蜀(221~263)',
            value: '三国·蜀(221~263)'
          }, {
            label: '三国·吴(222~280)',
            value: '三国·吴(222~280)'
          }]
        }, {
          label: '西晋(265~317)',
          value: '西晋(265~317)'
        }, {
          label: '东晋十六国',
          value: '东晋十六国',
          children: [{
            label: '东晋(317~420)',
            value: '东晋(317~420)'
          }, {
            label: '十六国(304~439)',
            value: '十六国(304~439)'
          }]
        }, {
          label: '南北朝',
          value: '南北朝',
          children: [{
            label: '南朝',
            value: '南朝'
          }, {
            label: '北朝',
            value: '北朝'
          }]
        }, {
          label: '隋(581~618)',
          value: '隋(581~618)'
        }, {
          label: '唐(618~907)',
          value: '唐(618~907)'
        }, {
          label: '五代十国',
          value: '五代十国',
          children: [{
            label: '五代·后梁(907~923)',
            value: '五代·后梁(907~923)'
          }, {
            label: '五代·后唐(923~936)',
            value: '五代·后唐(923~936)'
          }, {
            label: '五代·后晋(936~947)',
            value: '五代·后晋(936~947)'
          }, {
            label: '五代·后汉(947~950)',
            value: '五代·后汉(947~950)'
          }, {
            label: '五代•后周(951~960)',
            value: '五代•后周(951~960)'
          }, {
            label: '十国(902~979)',
            value: '十国(902~979)'
          }]
        }, {
          label: '宋',
          value: '宋',
          children: [{
            label: '北宋(960~1127)',
            value: '北宋(960~1127)'
          }, {
            label: '南宋(1127~1279)',
            value: '南宋(1127~1279)'
          }]
        }, {
          label: '辽(907~1125)',
          value: '辽(907~1125)'
        }, {
          label: '西夏(1038~1227)',
          value: '西夏(1038~1227)'
        }, {
          label: '金(1115~1234)',
          value: '金(1115~1234)'
        }, {
          label: '元(1206~1368)',
          value: '元(1206~1368)'
        }, {
          label: '明(1368~1644)',
          value: '明(1368~1644)'
        }, {
          label: '清(1616~1911)',
          value: '清(1616~1911)'
        }, {
          label: '中华民国(1912~1949)',
          value: '中华民国(1912~1949)'
        }, {
          label: '中华人民共和国(1949年10月1日成立)',
          value: '中华人民共和国(1949年10月1日成立)'
        }]
      }, {
        label: '公历纪年',
        value: '公历纪年',
        children: [{
          label: '200万年以前',
          value: '200万年以前'
        }, {
          label: '200万年前至公元前21世纪',
          value: '200万年前至公元前21世纪'
        }, {
          label: '公元前20世纪',
          value: '公元前20世纪'
        }, {
          label: '公元前19世纪',
          value: '公元前19世纪'
        }, {
          label: '公元前18世纪',
          value: '公元前18世纪'
        }, {
          label: '公元前17世纪',
          value: '公元前17世纪'
        }, {
          label: '公元前16世纪',
          value: '公元前16世纪'
        }, {
          label: '公元前15世纪',
          value: '公元前15世纪'
        }, {
          label: '公元前14世纪',
          value: '公元前14世纪'
        }, {
          label: '公元前13世纪',
          value: '公元前13世纪'
        }, {
          label: '公元前12世纪',
          value: '公元前12世纪'
        }, {
          label: '公元前11世纪',
          value: '公元前11世纪'
        }, {
          label: '公元前10世纪',
          value: '公元前10世纪'
        }, {
          label: '公元前9世纪',
          value: '公元前9世纪'
        }, {
          label: '公元前8世纪',
          value: '公元前8世纪'
        }, {
          label: '公元前7世纪',
          value: '公元前7世纪'
        }, {
          label: '公元前6世纪',
          value: '公元前6世纪'
        }, {
          label: '公元前5世纪',
          value: '公元前5世纪'
        }, {
          label: '公元前4世纪',
          value: '公元前4世纪'
        }, {
          label: '公元前3世纪',
          value: '公元前3世纪'
        }, {
          label: '公元前2世纪',
          value: '公元前2世纪'
        }, {
          label: '公元前1世纪',
          value: '公元前1世纪'
        }, {
          label: '公元1世纪',
          value: '公元1世纪'
        }, {
          label: '公元2世纪',
          value: '公元2世纪'
        }, {
          label: '公元3世纪',
          value: '公元3世纪'
        }, {
          label: '公元4世纪',
          value: '公元4世纪'
        }, {
          label: '公元5世纪',
          value: '公元5世纪'
        }, {
          label: '公元6世纪',
          value: '公元6世纪'
        }, {
          label: '公元7世纪',
          value: '公元7世纪'
        }, {
          label: '公元8世纪',
          value: '公元8世纪'
        }, {
          label: '公元9世纪',
          value: '公元9世纪'
        }, {
          label: '公元10世纪',
          value: '公元10世纪'
        }, {
          label: '公元11世纪',
          value: '公元11世纪'
        }, {
          label: '公元12世纪',
          value: '公元12世纪'
        }, {
          label: '公元13世纪',
          value: '公元13世纪'
        }, {
          label: '公元14世纪',
          value: '公元14世纪'
        }, {
          label: '公元15世纪',
          value: '公元15世纪'
        }, {
          label: '公元16世纪',
          value: '公元16世纪'
        }, {
          label: '公元17世纪',
          value: '公元17世纪'
        }, {
          label: '公元18世纪',
          value: '公元18世纪'
        }, {
          label: '公元19世纪',
          value: '公元19世纪'
        }, {
          label: '公元20世纪',
          value: '公元20世纪'
        }, {
          label: '公元21世纪',
          value: '公元21世纪'
        }]
      }, {
        label: '其他',
        value: '其他'
      }, {
        label: '年代不详',
        value: '年代不详'
      }],
      yearsProps: {
        emitPath: false
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.detail.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.in_time))
      },
      set(val) {
        this.postForm.in_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      if (id != null) {
        fetchDetail(id).then(response => {
          this.postForm = response.data
          // this.postForm.imgArray = response.data.imgUrls
          // this.postForm.imgUrls = null
        }).catch(err => {
          console.log(err)
        })
      }
    },
    dropzoneBefore(file) {
      this.loading = true
      console.log(file)
    },
    dropzoneR(file) {
      // console.log(this.postForm.imgUrls)
      // this.$message({ message: '删除成功', type: 'success' })
      // if (this.postForm.imgUrls != null && this.postForm.imgUrls[0].key != null) {
      for (var i in this.postForm.imgUrls) {
        if (this.postForm.imgUrls[i].id.indexOf(file.upload.uuid) !== -1) {
          this.postForm.imgUrls.splice(i, 1)
          break
        }
      }
      // }
      console.log(this.postForm.imgUrls)
    },
    dropzoneS(file) {
      // console.log(file)
      // this.$message({ message: '保存成功', type: 'success' })
    },
    dropzoneM(file, response, xhr) {
      console.log(file)
      this.loading = false
      if (response.code === 200) {
        this.postForm.imgUrls.push.apply(this.postForm.imgUrls, response.data)
      }
      // console.log(this.postForm.imgUrls)
      this.$message({ message: '图片上传完成', type: 'success' })
    },
    submitForm() {
      console.log(this.postForm)
      if (this.loading) {
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.postForm.length <= 0 || this.postForm.width <= 0 || this.postForm.height <= 0 || this.postForm.mass <= 0) {
            this.$message({
              // message: rule.field + '为必传项',
              message: '尺寸或质量数据必须大于0',
              type: 'error'
            })
            return
          }
          this.loading = true
          // if (this.postForm.imgUrls != null && this.postForm.imgUrls.length > 0 && this.postForm.imgUrls[0].url != null) {
          //   for (var i in this.postForm.imgUrls) {
          //     this.postForm.imgUrls[i] = this.postForm.imgUrls[i].url
          //   }
          // }
          console.log(this.postForm)
          upsertCollection(this.postForm).then(response => {
            this.$notify({
              title: '成功',
              message: '成功保存藏品',
              type: 'success',
              duration: 2000
            })
            router.back()
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelBtn() {
      if (this.loading) {
        return
      }
      router.back()
    },
    getRemoteStoreList() {
      var vm = this
      fetchList({ page: 1, limit: 99 }).then(response => {
        vm.storeListOptions = response.data.lst
      })
    }
    // getRemoteUserList(query) {
    //   searchUser(query).then(response => {
    //     if (!response.data.items) return
    //     this.userListOptions = response.data.items.map(v => v.name)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.component-item{
  min-height: 100px;
}
</style>
