
<template>
    <div class="flex-contain">

        <div class="flex shrink">
            <div style="height: 200px;">
                12321
            </div>
            box 1
        </div>

        <div class="flex shrink">
            box 1
        </div>

        <div class="flex shrink">
            box 1
        </div>

        <div class="flex shrink">
            box 1
        </div>

        <div class="flex glow shrink">
            box 1
        </div>
    </div>

    <hr>

    <div class="flex-contain">

        <div class="flex shrink">
            box 1
        </div>

        <div class="flex shrink">
            box 1
        </div>


        <div class="flex glow shrink">
            box 1
        </div>
        <div class="flex glow shrink">
            box 1
        </div>
        <div class="flex glow shrink">
            box 1
        </div>
    </div>


    <hr>

    <div class="flex-contain-img">

        <div class="flex-img shrink glow">
            <div>
                <img src="../assets/png/1.png">
            </div>
        </div>
        <div class="flex-img shrink ">
            123
        </div>
    </div>

    <hr>

    <div class="flex-contain-img">

        <div class="flex-img shrink glow">
            <div>
                <img src="../assets/png/769x960.png">
            </div>
        </div>
        <div class="flex-img shrink ">
            123
        </div>
    </div>
</template>


<style>
.flex-contain {
    display: flex;
    flex-direction: row;
    height: 150px;
    width: 350px;
    background-color: gray;
    flex-wrap: nowrap;
    /* flex-flow: row; */
}

.flex {
    display: flex;
    background-color: #ccc;
    margin: 10px;
    padding: 10px;

    flex-basis: 80px;
}

.shrink {
    flex-shrink: 1;
}

.shrink-0 {
    flex-shrink: 1;
}

.glow {
    flex-grow: 1;
}


.flex-contain-img {
    display: flex;
    flex-direction: column;
    height: 250px;
    width: 450px;
    background-color: gray;
    flex-wrap: nowrap;
    /* flex-flow: row; */
}

.flex-img {
    display: flex;
    background-color: #ccc;
    margin: 10px;
    padding: 10px;

    height: 50px;
    flex-basis: 30px;
    align-content: center;
}

.flex-img img {
    /* display: flex; */
    /* background-color: #ccc; */

    /* height: 100px; */
    /* flex-basis: 100px; */
    max-width: 100%;
    max-height: 100%;
}
</style>