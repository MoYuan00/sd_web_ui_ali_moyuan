<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
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
            <router-link to="/" style="display: inline-block; color: black;">
            <div class="icon-button" style="display: inline-block;">
              <el-icon :size="20">
                <House />
              </el-icon>
            </div>
            </router-link>

            <div class="icon-button" style="display: inline-block;">
              <el-icon :size="20">
                <Stopwatch />
              </el-icon>
            </div>
          </el-col>
        </el-row>
      </div>

      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
