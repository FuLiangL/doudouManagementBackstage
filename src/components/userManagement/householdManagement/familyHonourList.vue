<template>
    <!-- 家族荣耀榜单 -->
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom:0px;">
            <el-form :inline="true" style="overflow:hidden;">
                <el-form-item>
                    <div class="block">
                        <span class="registerTime">日期</span>
                        <el-date-picker 
                        v-model="formOne.startDate" 
                        type="daterange" 
                        range-separator=" 至 " 
                        start-placeholder="开始日期" 
                        end-placeholder="结束日期"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <span>家族ID</span>
                    <el-input 
                    style="width:130px;" 
                    clearable 
                    placeholder="请输入家族id" 
                    v-model="family_id"></el-input>
                </el-form-item>
                <el-form-item>
                    <span>家族名称</span>
                    <el-input 
                    style="width:130px;" 
                    clearable 
                    placeholder="请输入家族名称" 
                    v-model="family_name"></el-input>
                </el-form-item>
                <el-form-item>
                    <span>族长UID</span>
                    <el-input 
                    style="width:130px;" 
                    clearable 
                    placeholder="请输入族长UID" 
                    v-model="owner_uid"></el-input>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button 
                    type="primary" 
                    @click="getData(0)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <template>
            <el-table 
            :data="listData" 
            v-loading="listLoading" 
            element-loading-text="拼命加载中" 
            element-loading-spinner="el-icon-loading" 
            element-loading-background="rgba(0, 0, 0, 0.8)" 
            border fit highlight-current-row 
            style="width:100%;" 
            :height="tableHeight">
                <el-table-column type="index" :index="indexMethod" label="排名"></el-table-column>
                <el-table-column prop="family_id" label="家族ID"></el-table-column>
                <el-table-column prop="family_name" label="家族名称"></el-table-column>
                <el-table-column prop="owner_uid" label="族长UID"></el-table-column>
                <el-table-column prop="nickname" label="族长昵称"></el-table-column>
                <el-table-column prop="level" label="家族等级"></el-table-column>
                <el-table-column prop="total_honour" label="荣耀值"></el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar">
                <el-pagination 
                layout="total,prev,pager,next,jumper" 
                :page-size="20" 
                @current-change="handleCurrentChange" 
                :total="totalpage" 
                style="float:right;"></el-pagination>
            </el-col>
        </template>
    </section>
</template>

<script>
import { allget } from "../../../api/api";
import axios from 'axios';
export default {
    data() {
        return {
            tableHeight: null,
            formOne: {
                startDate: [new Date()-3*24*60*60*1000, new Date()]
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            page: 0,
            totalpage: 1000,
            uid: "",
            family_id: "",
            family_name: "",
            owner_uid: ""
        };
    },
    methods: {
        handleCurrentChange(val) {
            this.page = val - 1;
            this.getData();
        },
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
            if (type == 0) {
                _this.page = 0;
            }
            let url = "/NewFamily/getFamilyHonourList";
            let params = {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                family_name: this.family_name,
                family_id: this.family_id,
                owner_uid: this.owner_uid,
                page: this.page
            };
            axios.get(allget+url, {params: params})
                .then((res) => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                        _this.listData = res.data.data;
                    } else {
                        baseConfig.successTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        indexMethod(index) {
            return index + this.page * 20 + 1;
        }
    },
    mounted() {
        var _this = this;
        _this.tableHeight = baseConfig.lineNumber(searchPageHeight);
        _this.getData();
    }
};
</script>

<style lang="css" scoped>

</style>
