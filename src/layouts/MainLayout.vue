<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu
        :default-active="activeMenu"
        class="side-menu"
        background-color="#304156"
        text-color="#fff"
        router
      >
        <el-menu-item index="/books" @click="handleMenuClick('/books')">
          <el-icon><Document /></el-icon>
          <span>书籍管理</span>
        </el-menu-item>
        <el-menu-item index="/users" @click="handleMenuClick('/users')">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主要内容区 -->
    <el-container>
      <el-header height="60px">
        <div class="header-content">
          <h2>阅读APP管理后台</h2>
          <el-dropdown>
            <span class="admin-info">
              管理员 <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Document, User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 当前激活的菜单项
const activeMenu = ref(route.path)

// 处理菜单点击
const handleMenuClick = (path: string) => {
  router.push(path)
  activeMenu.value = path
}

// 初始化时设置当前路由对应的菜单项
onMounted(() => {
  activeMenu.value = route.path
})
</script>