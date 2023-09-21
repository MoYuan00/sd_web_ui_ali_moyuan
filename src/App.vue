<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import ParamsPlane from './components/ParamsPlane.vue'
import ParamsPlaneLeft from './components/ParamsPlaneLeft.vue'
import { loadingState, loadingText } from '@/assets/GlobalStatus.js'
</script>

<template>
  <div style=" height: 100vh; position: relative;"  v-loading="loadingState" :element-loading-text="loadingText">
    <header class="bg-img"
      style="background-color: #fffd; width: 100%;   z-index: 2000; position: fixed; left: 0; right: 0; top: 0;">
      <div style="width: 90%; height: 100%; margin: auto;">
        <div style=" width: 100%; height: 100%;">
          <el-row justify="space-between" style="padding-top: 80px; padding-bottom: 20px;">
            <el-col :span="12">
              <h3 style="color: black; font-weight: bold;display: block; line-height: 40px;">AI Creative Engine</h3>
            </el-col>
            <el-col :span="6" style="text-align: right;">

              <el-tooltip class="box-item" effect="dark" content="主页" placement="top">
                <router-link to="/" style="display: inline-block; color: black;">
                  <img src="./assets/icon/icon2.png" style="width: 40px; margin-right: 10px;">
                </router-link>
              </el-tooltip>

              <el-tooltip class="box-item" effect="dark" content="历史生成" placement="top">
                <router-link to="/history" style="display: inline-block; color: black;">
                  <img src="./assets/icon/icon3.png" style="width: 40px;">
                </router-link>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </div>
    </header>

    <main style="width: 100%; height: 100%; padding: 150px 0px 0px 0px; margin: auto; clear: both; position: relative;">

      <RouterView />
      <!-- plane -->
      <ParamsPlane></ParamsPlane>
      <ParamsPlaneLeft></ParamsPlaneLeft>
    </main>
  </div>
</template>

<style scoped>
div >>> .el-loading-mask{
  z-index: 3000 !important;
}
</style>
