<template>
  <div class="user-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <div class="search-form-container">
          <!-- 第一行 -->
          <div class="search-form-row">
            <el-form-item label="用户ID">
              <el-input v-model="searchForm.userId" placeholder="请输入用户ID" />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="searchForm.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="searchForm.phone" placeholder="请输入电话号码" />
            </el-form-item>
          </div>
          <!-- 第二行 -->
          <div class="search-form-row">
            <el-form-item label="性别" class="select-form-item">
              <div class="select-with-display">
                <el-select
                  v-model="searchForm.gender"
                  placeholder="请选择性别"
                  clearable
                  style="width: 180px"
                >
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
                <div v-if="searchForm.gender" class="selected-value">
                  已选：{{ searchForm.gender }}
                </div>
              </div>
            </el-form-item>
            <el-form-item label="年级" class="select-form-item">
              <div class="select-with-display">
                <el-select
                  v-model="searchForm.grade"
                  placeholder="请选择年级"
                  clearable
                  style="width: 180px"
                >
                  <el-option
                    v-for="item in gradeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div v-if="searchForm.grade" class="selected-value">
                  已选：{{ searchForm.grade }}
                </div>
              </div>
            </el-form-item>
            <div class="flex-spacer"></div>
            <el-form-item class="search-buttons">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch(searchFormRef)">重置</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      
      <!-- 添加已选条件展示 -->
      <div v-if="hasSelectedFilters" class="selected-filters">
        <span class="filter-label">已选条件：</span>
        <el-tag 
          v-if="searchForm.gender" 
          closable 
          @close="searchForm.gender = undefined"
          class="filter-tag"
        >
          性别：{{ searchForm.gender }}
        </el-tag>
        <el-tag 
          v-if="searchForm.grade" 
          closable 
          @close="searchForm.grade = undefined"
          class="filter-tag"
        >
          年级：{{ searchForm.grade }}
        </el-tag>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="grade" label="年级" width="100" />
        <el-table-column prop="phone" label="电话号码" width="120" />
        <el-table-column prop="registerTime" label="注册时间" width="180" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="page.pageNum"
          v-model:page-size="page.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

// 年级选项
const gradeOptions = [
  { label: '一年级', value: '一年级' },
  { label: '二年级', value: '二年级' },
  { label: '三年级', value: '三年级' },
  { label: '四年级', value: '四年级' },
  { label: '五年级', value: '五年级' },
  { label: '六年级', value: '六年级' }
]

// 搜索表单
const searchForm = reactive({
  userId: '',
  nickname: '',
  gender: undefined as string | undefined,
  grade: undefined as string | undefined,
  phone: ''
})

// 分页参数
const page = reactive({
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    userId: 1,
    nickname: '小明',
    gender: '男',
    grade: '三年级',
    phone: '13800138000',
    registerTime: '2024-01-01 10:00:00'
  },
  {
    userId: 2,
    nickname: '小红',
    gender: '女',
    grade: '四年级',
    phone: '13800138001',
    registerTime: '2024-01-02 11:00:00'
  },
  {
    userId: 3,
    nickname: '小华',
    gender: '男',
    grade: '五年级',
    phone: '13800138002',
    registerTime: '2024-01-03 12:00:00'
  },
  {
    userId: 4,
    nickname: '小李',
    gender: '男',
    grade: '一年级',
    phone: '13800138003',
    registerTime: '2024-01-04 14:00:00'
  },
  {
    userId: 5,
    nickname: '小张',
    gender: '女',
    grade: '一年级',
    phone: '13800138004',
    registerTime: '2024-01-05 15:00:00'
  }
])

// 添加计算属性
const hasSelectedFilters = computed(() => {
  return searchForm.gender !== undefined || searchForm.grade !== undefined
})

// 搜索
const handleSearch = () => {
  page.pageNum = 1
  const originalData = [
    ...tableData.value
  ]
  
  const filteredData = originalData.filter(item => {
    const matchUserId = !searchForm.userId || item.userId.toString().includes(searchForm.userId)
    const matchNickname = !searchForm.nickname || item.nickname.includes(searchForm.nickname)
    const matchGender = !searchForm.gender || item.gender === searchForm.gender
    const matchGrade = !searchForm.grade || item.grade === searchForm.grade
    const matchPhone = !searchForm.phone || item.phone.includes(searchForm.phone)
    
    console.log('筛选条件：', {
      年级: searchForm.grade,
      当前数据年级: item.grade,
      是否匹配: !searchForm.grade || item.grade === searchForm.grade
    })
    
    return matchUserId && matchNickname && matchGender && matchGrade && matchPhone
  })
  
  tableData.value = filteredData
  total.value = filteredData.length
}

// 重置搜索
const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  handleSearch()
}

// 分页处理
const handleSizeChange = (val: number) => {
  page.pageSize = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  page.pageNum = val
  handleSearch()
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-form-row {
  display: flex;
  gap: 15px;
  flex-wrap: nowrap;
  align-items: flex-start;
}

.el-form-item {
  margin-bottom: 0;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.select-form-item {
  min-width: 180px;
  max-width: 180px;
  flex: 0 0 auto;
}

.flex-spacer {
  flex: 1;
}

.search-buttons.el-form-item {
  min-width: auto;
  max-width: none;
  flex: 0 0 auto;
}

.select-with-display {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.selected-value {
  font-size: 12px;
  color: #409EFF;
  padding: 2px 5px;
  background-color: #ecf5ff;
  border-radius: 4px;
  white-space: nowrap;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.selected-filters {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

.filter-label {
  color: #606266;
  margin-right: 10px;
}

.filter-tag {
  margin-right: 8px;
}
</style> 