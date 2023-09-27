<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ParamsPlane from './components/ParamsPlane.vue'
import ParamsPlaneLeft from './components/ParamsPlaneLeft.vue'
import { loadingState, loadingText,ParamsPlaneIsShow,paramButtonIsShow  } from '@/assets/GlobalStatus.js'
</script>

<template>
  <div style=" height: 100vh; position: relative;" v-loading.fullscreen.lock="loadingState" :element-loading-text="loadingText">
    <header class="header" style="width: 100%; z-index: 2000; position: fixed; left: 0; right: 0; top: 0;">
      <div style="width: 90%; height: 100%; margin: auto;">
        <div style=" width: 100%; height: 100%;">
          <el-row justify="space-between" style="padding-top: 80px; padding-bottom: 20px;">
            <el-col :span="6">
              <h3 style="color: black; font-weight: bold;display: block; line-height: 40px;">AI Creative Engine</h3>
            </el-col>

            <el-col :span="6" v-show="paramButtonIsShow">
              <div style="display: flex; width: 100%;">
                <div class="pointer"
                  style="margin: auto; padding: 10px 30px; background-color: var(--color-gray-ui-bg); border-radius: 40px;"
                  @click="OnClickParamChange">
                  参数调整
                </div>
              </div>
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

    <main style="width: 100%; height: 100%; padding: 150px 0px 0px 0px;  position: relative;">

      <RouterView />
      <!-- plane -->
      <Suspense>
        <ParamsPlane></ParamsPlane>
      </Suspense>

      <ParamsPlaneLeft></ParamsPlaneLeft>
    </main>
  </div>
</template>

<script>

function OnClickParamChange() {
  ParamsPlaneIsShow.value = !ParamsPlaneIsShow.value
  event.stopPropagation()
  return false
}

</script>

<style scoped>
div>>>.el-loading-mask {
  z-index: 3000 !important;
}

.header {
  background-image: radial-gradient(transparent 1px, #fff 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
}
</style>
