<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import ParamsPlane from './components/ParamsPlane.vue'
import ParamsPlaneLeft from './components/ParamsPlaneLeft.vue'
</script>

<template>
  <div style=" height: 100vh; position: relative;">
    <header style="background-color: #fffd; width: 100%; height: 120px;  z-index: 2000; position: fixed; left: 0; right: 0; top: 0;">
      <div style="width: 75%; height: 100%; margin: auto;">
        <div style="position: fixed; width: 75%;">
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
      </div>
    </header>

    <main style="width: 75%; padding: 200px 0px 0px 0px; margin: auto;">
      
      <RouterView />
      <!-- plane -->
      <div style="position: absolute; top: 200px; right: 0px; width: 400px; z-index: 2001;">
        <ParamsPlane></ParamsPlane>
      </div>
      <div style="position: absolute; top: 200px; left: 0px; width: 400px; z-index: 2001;">
        <ParamsPlaneLeft></ParamsPlaneLeft>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
