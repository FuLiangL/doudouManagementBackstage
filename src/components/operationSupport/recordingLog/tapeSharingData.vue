<template>
    <!-- 分享页推荐录音列表 -->
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
                <el-form-item class="search-span">
                    <el-button 
					type="primary" 
					@click="openRecordingRecommend">新增录音推荐</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
					<el-button 
					type="primary" 
					@click="getData()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<template>
			<el-table 
			:data="listData" 
			border fit highlight-current-row 
			v-loading="listLoading" 
			element-loading-text="拼命加载中" 
			element-loading-spinner="el-icon-loading" 
			element-loading-background="rgba(0, 0, 0, 0.8)" 
			style="width:100%;" 
			:height="tableHeight">
				<el-table-column prop="time" label="添加时间"></el-table-column>
				<el-table-column prop="share_sort"  label="序号"></el-table-column>
				<el-table-column prop="id" label="录音编码" ></el-table-column>
                <el-table-column label="录音内容" width="300">
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<audio 
							controls="controls" 
							:src="scope.row.voice_url"></audio>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="uid" label="发布者ID"></el-table-column>
				<el-table-column prop="content"  label="录音描述"></el-table-column>
				<el-table-column prop="share_listen" label="累积播放次数"></el-table-column>
				<el-table-column label="操作" min-width="120">
					<template slot-scope="scope">
                        <el-col :span="12">
							<el-button 
							size="small" 
							type="danger" 
							@click="cancleRecommend(scope.$index, scope.row)">取消推荐</el-button>
						</el-col>
					</template>
				</el-table-column>
			</el-table>
            <el-dialog title="" class="recordPopup" :visible.sync="dialogFormVisible" center style="text-align:center;">
				<el-form :model="formInfo">
					<el-form-item label="录音序号：" :label-width="formLabelWidth">
						<el-input 
						auto-complete="off" 
						id="withdraw_money" 
						v-model="withdrawMoneyValue" 
						style="width:240px;" 
						placeholder="越大越靠前"></el-input>
					</el-form-item>
					<el-form-item label="录音编码：" :label-width="formLabelWidth">
						<el-input 
						auto-complete="off" 
						id="withdraw_day" 
						v-model="withdrawDayValue" 
						style="width:240px;" 
						placeholder="保证准确"></el-input>
					</el-form-item>
                    <el-form-item label="基础人数：" :label-width="formLabelWidth">
						<el-input 
						auto-complete="off" 
						id="numpeople" 
						v-model="numpeopleValue" 
						style="width:240px;" 
						placeholder="假的收听人数"></el-input>
					</el-form-item>
				</el-form>
                <span slot="footer" id="dialog-footer">
                    <el-button 
					@click="dialogFormVisible=false">取 消</el-button>
                    <el-button 
					type="primary" 
					@click="addShareHotVoice()">确 定</el-button>
                </span>
			</el-dialog>
		</template>
    </section>
</template>

<script>
	import { allget } from '../../../api/api';
	import axios from 'axios';
    export default {
        data() {
            return {
				tableHeight: null, 
                formOne: {
                    startDate: [new Date()-14*24*60*60*1000, new Date()],
				},
				page: 0,
				listData: [],
				totalpage:null,
				formLabelWidth: '100px',
                listLoading: false,
                formInfo: {

                },
                dialogFormVisible: false,
				withdrawMoneyValue: "",
				withdrawDayValue: "",
				numpeopleValue: "",
				listLoading: false,
            }
        },
		methods: {
			handleCurrentChange(val) {
				this.page = val-1;
				this.getData();
			},
			// 获取数据
			getData() {
				let _this = this;
				_this.listLoading = true;
				let url = '/Voice/getShareHotVoiceData';
				let params ={
					date_s: baseConfig.changeDateTime(this.formOne.startDate[0], 0),
					date_e: baseConfig.changeDateTime(this.formOne.startDate[1], 0),
				}
				axios.get(allget+url, {params: params})
					.then((res) => {
						_this.listLoading = false;
						if(res.data.ret){
							this.listData = res.data.data;
						}else{
							baseConfig.warningTipMsg(res.data.msg);
						}
					})
					.catch((err) => {
						console.log(err);
					});
            },
			// 添加推荐
			addShareHotVoice() {
				let _this = this;
				let url = '/Voice/addShareHotVoice';
				let params ={
					id: _this.withdrawMoneyValue,
					share_sort: withdrawDayValue,
					cheat_listen: numpeopleValue
				}
				_this.listLoading = true;
				axios.get(allget+url, {params: params})
					.then((res) => {
						_this.listLoading = false;
						if(res.data.ret) {
							baseConfig.successTipMsg(_this, '已推荐成功');						
							_this.getData();
						} else {
							baseConfig.warningTipMsg(_this, res.data.msg);
						}
					})
					.catch((err) => {
						console.log(err);
						baseConfig.warningTipMsg(_this, 'error');
					});
			},
            // 取消推荐
            cancleRecommend() {
                let _this = this;
				const id = row.id;
				const url = '/Voice/cancelShareHotVoiceData';
				const params = {
					id: id,
				};
				_this.listLoading = true;				
				axios.get(allget+url, {params: params})
					.then((res) => {
						_this.listLoading = false;
						if(res.data.ret) {
							baseConfig.successTipMsg(_this, '已取消');						
							_this.getData();
						} else {
							baseConfig.warningTipMsg(_this, res.data.msg);
						}
					})
					.catch((err) => { 
						console.log(err);
						baseConfig.warningTipMsg(_this, 'error');
					});
            },
            // 取消弹窗
            cancleDialogFormVisible() {
                this.dialogFormVisible=false;
            },
            // 打开录音推荐
            openRecordingRecommend() {
                this.dialogFormVisible=true;
            }
		},
		mounted() {
			var _this = this;
			_this.tableHeight = baseConfig.lineNumber(searchHeight);
			_this.getData();
		}
    }

</script>

<style lang="css" scoped>
.recordPopup{
		text-align:center;
		width: 1000px;
		margin: 0 auto;
}
#dialog-footer{
	text-align:center;
	margin: 0 auto;
}
.el-dialog__footer{
	text-align:center;
}
</style>
