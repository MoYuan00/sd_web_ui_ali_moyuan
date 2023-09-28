<script setup>
import { ref, watch, computed, onMounted, defineEmits, onUnmounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import ParamsPlane from './components/ParamsPlane.vue'
import ParamsPlaneLeft from './components/ParamsPlaneLeft.vue'
import { genPercentage, genState, loadingState, loadingText, ParamsPlaneIsShow, paramButtonIsShow } from '@/assets/GlobalStatus.js'
</script>

<template>
  <div id="body" style=" height: 100vh; position: relative;" 
    :element-loading-text="loadingText">
    <header class="header" style="width: 100%; z-index: 2000; position: fixed; left: 0; right: 0; top: 0;">
      <div style="width: 90%; height: 100%; margin: auto;">
        <div style=" width: 100%; height: 100%;">
          <el-row justify="space-between" style="padding-top: 80px; padding-bottom: 20px;">
            <el-col :span="6">
              <h3 style="color: black; font-weight: bold;display: block; line-height: 40px;">AI Creative Engine</h3>
            </el-col>

            <!-- <el-col :span="6" v-show="paramButtonIsShow">
              <div style="display: flex; width: 100%;">
                <div ref="param_button" class="button_white"
                  style="margin: auto; padding: 10px 30px; background-color: var(--color-gray-ui-bg); border-radius: 40px;"
                  @click="OnClickParamChange">
                  参数调整
                </div>
              </div>
            </el-col> -->

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

    </main>


  </div>

  <div id="loading_mask" v-if="genState || loadingState"
    style="position: fixed; display: flex; justify-content: center; 
    align-items: center;  top: 0; bottom: 0; left: 0; right: 0;  overflow: hidden; background-color: #fffc; z-index: 3000;">

    <div style="display: flex; align-content: center; vertical-align: middle;">
      <div style="display: flex;">
        <el-progress color="var(--color-sp-03)" :percentage="genPercentage" :show-text="true"
          :stroke-linecap="'round'" :stroke-width="15" type="circle">
          <template #default="{ percentage }">
            <div style="font-size: 1.5rem; margin-bottom: 5px;">{{ percentage }}%</div>
            <span style="font-size: 0.5rem;">{{loadingText}}</span>
          </template>
        </el-progress>
      </div>
    </div>
  </div>
</template>

<script>

function OnClickParamChange() {
  ParamsPlaneIsShow.value = !ParamsPlaneIsShow.value
  event.stopPropagation()
  return false
}

onMounted(() => {
  let loading_mask = document.getElementById('loading_mask')
  loading_mask.addEventListener('click', () => {
    event.stopPropagation()
    return false
  }, true)
  loading_mask.addEventListener('click', () => {
    event.stopPropagation()
    return false
  }, false)
})

let param_button = ref(null)

onUnmounted(() => {
  console.log('App 组件销毁');
  param_button.value.removeEventListener('click', OnClickParamChange);
})


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
