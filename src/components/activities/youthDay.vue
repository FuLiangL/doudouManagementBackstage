<template>
    <!-- 五四活动后台 -->
    <section>
        <template>
            <el-table 
            :data="listData" 
            border fit highlight-current-row 
            style="width:100%;" 
            :height="tableHeight">
                <el-table-column prop="uid" label="用户id"></el-table-column>
                <el-table-column prop="nickname" label="用户昵称"></el-table-column>
                <el-table-column prop="one" label="点赞礼物数" sortable></el-table-column>
                <el-table-column prop="five" label="正能量礼物数" sortable></el-table-column>
                <el-table-column prop="four" label="蛮拼的礼物数" sortable></el-table-column>
                <el-table-column prop="two" label="佛系青年礼物数" sortable></el-table-column>
                <el-table-column prop="three" label="上天礼物数" sortable></el-table-column>
                <el-table-column prop="five" label="五四勋章礼物数" sortable></el-table-column>
            </el-table>
        </template>
    </section>
</template>

<script>
import { allget } from "../../api/api.js";
import axios from "axios";
export default {
    data() {
        return {
            tableHeight: null, 
            formOne: {
                startDate: [new Date()-100*24*60*60*1000, new Date()] 
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
        };
    },
    methods: {
        getData() {
            var _this = this;
            let url = "/Activity/getFiveFourDataInfo";
            let params = {};
            axios.get(allget+url, { params: params })
                .then(res => {
                    if(res.data.ret){
                        for(var i=0; i<res.data.data.length; i++) {
                            res.data.data[i].one = Number(res.data.data[i].one);
                            res.data.data[i].two = Number(res.data.data[i].two);
                            res.data.data[i].three = Number(res.data.data[i].three);
                            res.data.data[i].four = Number(res.data.data[i].four);
                            res.data.data[i].five = Number(res.data.data[i].five);
                            res.data.data[i].six = Number(res.data.data[i].six);
                        }
                        this.listData = res.data.data;
                    }else{
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
    },
    mounted() {
        this.tableHeight = leftNavHeight;
        this.getData();
    }
};
</script>

<style lang="css" scoped>

</style>
