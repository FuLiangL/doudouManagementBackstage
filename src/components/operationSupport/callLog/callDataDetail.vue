<template>
	<!-- 通话记录明细 -->
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
                <el-form-item style="margin-left: 50px;">
					<span>通话类型</span>
					<el-select style="width: 120px;" v-model="callType">
						<el-option label="全部" value=""></el-option>
						<el-option label="AA通话" value="1"></el-option>
						<el-option label="AB通话" value="5"></el-option>
						<el-option label="网红通话" value="3"></el-option>
						<el-option label="好友通话" value="2"></el-option>
					</el-select>
				</el-form-item>
                <el-form-item>
					<span>UID/账号/昵称：</span>
					<el-input 
                    style="width:100px;" 
                    placeholder="请输入内容" 
                    v-model="uid" 
                    clearable></el-input>
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
            border fit highlight-current-row 
            v-loading="listLoading" 
            style="width:100%;" 
            :height="tableHeight">
				<el-table-column prop="chat_id" label="通话ID"></el-table-column>
				<el-table-column prop="chat_type" label="通话类型">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.chat_type==1||scope.row.chat_type==5||scope.row.chat_type==8">随机</p>
                            <p v-else-if="scope.row.chat_type==2">好友</p>
                            <p v-else-if="scope.row.chat_type==3">网红</p>									
                            <p v-else-if="scope.row.chat_type==6">抢聊</p>									
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="start_time" label="通话开始时间"></el-table-column>
				<el-table-column prop="end_time" label="通话结束时间"></el-table-column>
				<el-table-column prop="use_time" label="通话时长"></el-table-column>
				<el-table-column prop="uid_req" label="发起者UID"></el-table-column>
				<el-table-column prop="uid_res" label="接受者UID"></el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination 
                layout="total,prev,pager,next,jumper" 
                @current-change="handleCurrentChange" 
                :page-size="20" 
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
				startDate: [new Date()-2*24*60*60*1000, new Date()],
            },
            listData: [],
            formLabelWidth: "120px",
            listLoading: false,
            callType: null,
            uid: null,
            totalpage: 1000,
            page: 0,
        };
    },
    methods: {
        handleCurrentChange(val) {
			var _this = this;
			_this.page = val-1;
			_this.getData();
		},
        // 获取数据
        getData(type) {
            var _this = this;
            _this.listLoading = true;
			let params = _this.condition();
            let url = "/Record/getCall";
            // this.uid==null||this.uid==""?delete params.uid:params.uid=this.uid;
            this.callType==null||this.callType==""?delete params.callType:params.chat_type=this.callType;
            if(type==0){
                _this.page = 0;
            }
            axios.get(allget+url, {params: params})
                .then((res) => {
                    _this.listLoading = false;
                    if (res.data.ret) {
                            for(var i = 0;i<res.data.data.length;i++){
                                res.data.data[i].avg = baseConfig.changeTime(res.data.data[i].listen_long/res.data.data[i].listen_success_times);
                            }
                        this.listData = res.data.data;
                    } else {
                        baseConfig.warningTipMsg(this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
		},
		condition() {
            return {
                date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
                date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
                chat_type: this.callType,
                find: this.uid,
                page: this.page,
            };
        },
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
