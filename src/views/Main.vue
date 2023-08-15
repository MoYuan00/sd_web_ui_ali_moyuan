<script setup>
// import PromotInput from '../components/PromotInput.vue'
import PromotInputMain from '../components/PromotInputMain.vue'
import ControlNet from '../components/ControlNet.vue'
import ImageView from '../components/ImageView.vue'
import '../assets/Main.vue.css'
</script>

<template>
    <div style="height: 100vh;">
        <div style="width: 75%; margin: auto;">

            <el-row justify="space-between" style="padding: 30px 0px;">
                <el-col :span="12">
                    <h3 style="color: black; font-weight: bold;display: block;">AI Creative Engine</h3>
                </el-col>
                <el-col :span="6">
                    <div class="icon-button">
                        <el-icon :size="20">
                            <House />
                        </el-icon>
                    </div>
                    <div class="icon-button">
                        <el-icon :size="20">
                            <Stopwatch />
                        </el-icon>
                    </div>
                </el-col>
            </el-row>


            <el-row style="text-align: center;">
                <el-col>
                    <h1 style="color: black; font-weight: bold;display: block;">AI Creative Engine</h1>
                </el-col>
            </el-row>


            <el-row>
                <el-col>
                    <div style="margin: 20px;">
                        <div class="four-corners-border" style="width: 600px; margin: auto;">
                            <ControlNet></ControlNet>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <el-row>
                <PromotInputMain></PromotInputMain>
            </el-row>

            <div style="margin-bottom: 100px;"></div>

            <el-row>
                <el-col>
                    <div style="text-align: center; margin-bottom: 3rem;">
                        <h1 style="font-weight: bold; color: gray;">
                            Explore More
                        </h1>
                    </div>

                    <div style="width: 100%;">
                        <!-- 瀑布流 -->
                        <div class="box-wrapper-0">
                            <div class="box-wrapper">
                                <div class="box-col">
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/1022/576">
                                        </div>
                                    </div>
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/512/512">
                                        </div>
                                    </div>
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/1024/768">
                                        </div>
                                    </div>
                                </div>

                                <div class="box-col">
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/512/522">
                                        </div>
                                    </div>
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/1034/576">
                                        </div>
                                    </div>
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/1024/763">
                                        </div>
                                    </div>
                                </div>
                                <div class="box-col">
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/1024/761">
                                        </div>
                                    </div>
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/512/511">
                                        </div>
                                    </div>
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/1024/576">
                                        </div>
                                    </div>
                                </div>

                                <div class="box-col">
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/768/512">
                                        </div>
                                    </div>
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/768/960">
                                        </div>
                                    </div>
                                    <div class="box-item">
                                        <div>
                                            <img src="https://picsum.photos/1024/428">
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
</template>


<style scoped></style>

<script>



</script>
