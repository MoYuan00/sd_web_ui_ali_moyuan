<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import ParamsPlane from './components/ParamsPlane.vue'
</script>

<template>
  <div style="height: 100vh;">
    <div style="width: 75%; margin: auto; z-index: 10000;">
      <div>
        <el-row justify="space-between" style="padding: 40px 0px;">
          <el-col :span="12">
            <h3 style="color: black; font-weight: bold;display: block; line-height: 40px;">AI Creative Engine</h3>
          </el-col>
          <el-col :span="6" style="text-align: right;">

            <el-tooltip class="box-item" effect="dark" content="主页" placement="top">
              <router-link to="/" style="display: inline-block; color: black;">
                <div class="icon-button" style="display: inline-block;">
                  <el-icon :size="20">
                    <House />
                  </el-icon>
                </div>
              </router-link>
            </el-tooltip>

            <el-tooltip class="box-item" effect="dark" content="历史生成" placement="top">
              <router-link to="/history" style="display: inline-block; color: black;">
                <div class="icon-button" style="display: inline-block;">
                  <el-icon :size="20">
                    <Stopwatch />
                  </el-icon>
                </div>
              </router-link>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>

      <RouterView />


      <!-- plane -->
      <div style="position: absolute; top: 150px; right: 0px; width: 400px; background-color: #111a; color: #333f;
            border-radius: 40px 0px 0px; padding: 30px 30px;">
        <ParamsPlane></ParamsPlane>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
