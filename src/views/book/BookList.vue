<template>
  <div class="book-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <div class="search-form-container">
          <!-- 第一行 -->
          <div class="search-form-row">
            <el-form-item label="书籍名称">
              <el-input v-model="searchForm.title" placeholder="请输入书籍名称" />
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="searchForm.author" placeholder="请输入作者" />
            </el-form-item>
            <el-form-item label="标签">
              <el-input v-model="searchForm.tags" placeholder="请输入其他标签" />
            </el-form-item>
          </div>
          <!-- 第二行 -->
          <div class="search-form-row">
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
            <el-form-item label="状态" class="select-form-item">
              <div class="select-with-display">
                <el-select
                  v-model="searchForm.status"
                  placeholder="请选择状态"
                  clearable
                  style="width: 180px"
                >
                  <el-option label="上架中" :value="1" />
                  <el-option label="下架中" :value="0" />
                </el-select>
                <div v-if="searchForm.status !== undefined" class="selected-value">
                  已选：{{ searchForm.status === 1 ? '上架中' : '下架中' }}
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
    </el-card>

    <!-- 操作按钮区域 -->
    <div class="operation-container">
      <el-button type="primary" @click="handleAdd">新增书籍</el-button>
    </div>

    <!-- 表格区域 -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="书籍名称" min-width="120" />
        <el-table-column prop="author" label="作者" min-width="100" />
        <el-table-column prop="description" label="简介" min-width="200" show-overflow-tooltip />
        <el-table-column prop="tags" label="标签" min-width="120" />
        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image 
              :src="row.coverUrl" 
              :preview-src-list="[row.coverUrl]"
              fit="cover"
              style="width: 50px; height: 70px">
              <template #error>
                <div class="image-slot">xxx</div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="knowledgeFileUrl" label="知识库文件" min-width="100">
          <template #default="{ row }">
            <el-link type="primary" :href="row.knowledgeFileUrl" v-if="row.knowledgeFileUrl !== 'xxx'">
              查看文件
            </el-link>
            <span v-else>xxx</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架中' : '下架中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button 
              :type="row.status === 1 ? 'danger' : 'success'" 
              link 
              @click="handleStatusChange(row)">
              {{ row.status === 1 ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增书籍' : '编辑书籍'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="书籍名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入书籍名称" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            rows="3"
            placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="formData.tags" placeholder="请输入标签，多个标签用逗号分隔" />
        </el-form-item>
        <el-form-item label="封面URL" prop="coverUrl">
          <el-input v-model="formData.coverUrl" placeholder="请输入封面图片URL" />
        </el-form-item>
        <el-form-item label="知识库文件" prop="knowledgeFileUrl">
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 添加年级选项常量
const gradeOptions = [
  { label: '一年级', value: '一年级' },
  { label: '二年级', value: '二年级' },
  { label: '三年级', value: '三年级' },
  { label: '四年级', value: '四年级' },
  { label: '五年级', value: '五年级' },
  { label: '六年级', value: '六年级' }
]

// 修改搜索表单
const searchForm = reactive({
  title: '',
  author: '',
  grade: '', // 添加年级字段
  tags: '',
  status: undefined as number | undefined
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
    id: 1,
    title: '夏洛的网',
    author: 'E.B.怀特',
    description: '这是一个关于友情的故事。一只名叫威尔伯的小猪与一只名叫夏洛的蜘蛛成为了朋友。夏洛用她的智慧和网织技巧帮助威尔伯逃脱被宰杀的命运。',
    tags: '三年级,儿童文学,友情,成长',
    coverUrl: 'xxx',
    knowledgeFileUrl: 'xxx',
    status: 1,
    updatedAt: '2024-02-05 13:30:00'
  },
  {
    id: 2,
    title: '夏洛特烦恼',
    author: '夏洛',
    description: '一个屌丝男士在追求女神的过程中发生的一系列令人捧腹又感动的故事。主人公夏洛在追求梦中女神袁华的过程中，经历了一系列啼笑皆非的事情。',
    tags: '六年级,青春,喜剧,爱情',
    coverUrl: 'xxx',
    knowledgeFileUrl: 'xxx',
    status: 0,
    updatedAt: '2024-02-05 13:35:00'
  },
  {
    id: 3,
    title: '夏洛克·福尔摩斯探案全集',
    author: '阿瑟·柯南·道尔',
    description: '这是一部经典的侦探小说集，讲述了大侦探福尔摩斯和他的助手华生医生一起破获各种离奇案件的故事。',
    tags: '五年级,侦探,推理,经典文学',
    coverUrl: 'xxx',
    knowledgeFileUrl: 'xxx',
    status: 1,
    updatedAt: '2024-02-05 13:40:00'
  }
])

// 弹窗相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formData = reactive({
  id: undefined,
  title: '',
  author: '',
  description: '',
  tags: '',
  coverUrl: '',
  knowledgeFileUrl: '',
  status: 1
})

// 表单校验规则
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入书籍名称', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

// 获取表格数据
const getTableData = async () => {
  loading.value = true
  try {
    // 暂时注释掉API调用，使用模拟数据
    // const res = await fetch('/api/books', {
    //   method: 'GET',
    //   body: JSON.stringify({ ...searchForm, ...page })
    // })
    // const data = await res.json()
    // tableData.value = data.list
    total.value = tableData.value.length
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.pageNum = 1
  // 这里模拟搜索逻辑
  const filteredData = tableData.value.filter(item => {
    const matchTitle = !searchForm.title || item.title.includes(searchForm.title)
    const matchAuthor = !searchForm.author || item.author.includes(searchForm.author)
    const matchGrade = !searchForm.grade || item.tags.includes(searchForm.grade)
    const matchTags = !searchForm.tags || item.tags.includes(searchForm.tags)
    const matchStatus = searchForm.status === undefined || item.status === searchForm.status
    return matchTitle && matchAuthor && matchGrade && matchTags && matchStatus
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

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(formData, {
    id: undefined,
    title: '',
    author: '',
    description: '',
    tags: '',
    coverUrl: '',
    knowledgeFileUrl: '',
    status: 1
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 这里替换为实际的API调用
        const url = dialogType.value === 'add' ? '/api/books' : `/api/books/${formData.id}`
        const method = dialogType.value === 'add' ? 'POST' : 'PUT'
        await fetch(url, {
          method,
          body: JSON.stringify(formData)
        })
        ElMessage.success(`${dialogType.value === 'add' ? '新增' : '编辑'}成功`)
        dialogVisible.value = false
        getTableData()
      } catch (error) {
        console.error(error)
        ElMessage.error(`${dialogType.value === 'add' ? '新增' : '编辑'}失败`)
      }
    }
  })
}

// 状态变更
const handleStatusChange = async (row: any) => {
  try {
    // 这里替换为实际的API调用
    await fetch(`/api/books/${row.id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: row.status === 1 ? 0 : 1 })
    })
    ElMessage.success('状态更新成功')
    getTableData()
  } catch (error) {
    console.error(error)
    ElMessage.error('状态更新失败')
  }
}

// 分页变化
const handleSizeChange = (val: number) => {
  page.pageSize = val
  getTableData()
}

const handleCurrentChange = (val: number) => {
  page.pageNum = val
  getTableData()
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped>
.book-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.operation-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
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
</style> 