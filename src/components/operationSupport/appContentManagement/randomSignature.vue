<template>
	<!-- 随机签名 -->
	<section>
		<!-- 提交Excel的弹框 -->
		<div class="excelBox" v-show="excelBoxActivity">
			<p>请上传Excel文件，只限上传为Excel文件</p>
			<div class="excelInput">
				<p>请选择Excel文件:</p>
				<input 
				@change="uploading($event)" 
				type="file" 
				accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
			</div>
			<div class="btns">
				<!-- 按钮操作部分 -->
	            <button  
				@click="excelBoxActivity=false;">取消</button>
		        <button  
				@click="submit()">提交</button>
			</div>
		</div>
		<el-col :span="24" class="toolbar" style="padding-bottom:0px;">
			<el-form :inline="true" style="overflow:hidden;">
                <el-form-item>
					<el-button 
					type="primary" 
					@click="excelBoxActivity=true;">上传</el-button>
					<el-button 
					type="primary" 
					@click="refreshPage($event)">刷新</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<template>
			<el-table 
			ref="tableHeight" 
			:data="onePageTabData" 
			border fit highlight-current-row 
			v-loading="listLoading" 
			style="width:100%;" 
			:height="tableHeight">
				<el-table-column prop="id" label="ID" width="100" sortable ></el-table-column>
				<el-table-column prop="signature" label="随机签名" width="700"></el-table-column>
				<el-table-column label="操作" min-width="200">
					<template slot-scope="scope">
						<el-button 
						type="primary" 
						@click.native.prevent="changeOneUserData(scope.$index, scope.row)" 
						size="small">编辑</el-button>
						<el-button 
						type="primary" 
						@click.native.prevent="deleteOneUserData(scope.$index, scope.row)" 
						size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination 
				layout="total,prev,pager,next,jumper" 
				@current-change="handleCurrentChange" 
				:page-size="20" 
				:total="totalpage" 
				style="float:right;"></el-pagination>
			</el-col>
			<!-- 新增--对应的dialog -->
			<el-dialog title="编辑修改随机签名" :visible.sync="dialogFormVisible">
				<el-form :model="formTwo">
					<el-form-item label="请输入签名" :label-width="formLabelWidth">
						<el-input 
						v-model="formTwo.name" 
						auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button 
					@click="editorSure(0)">取 消</el-button>
					<el-button 
					type="primary" 
					@click="editorSure(1)">确 定</el-button>
				</div>
			</el-dialog>
		</template>
	</section>
</template>

<script>
import Event from './../../../public_js/event.js';
import { allget } from '../../../api/api';
import store from '../../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null,
			formTwo: {
				id: '', 
				name: '',
				rows: null, 
				index: null,
			},
			formThree: {
				file: '', // 提交Excel的表格的文件
			},
			excelBoxActivity: false, // 控制提交Excel的提交框的显示隐藏
			listLoading: false, 
			tabData: [], 
			totalpage: null, 
			page: 1, 
			star: '0', 
			end: '20',
			dialogFormVisible: false,
			formLabelWidth: '120px', 
		};
	},
	computed:{
		onePageTabData() {
			var _this = this;
			return _this.tabData.slice(_this.star, _this.end);
		},
	},
	methods: {
		handleCurrentChange(val) {
			var _this = this;
			_this.page = val-1;
			_this.star = (_this.page)*20;
			_this.end = _this.star+20;
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/GlobalSet/getRandomSignature';
			var params = {};
			axios.get(allget+url, {params: params})
				.then((res) => {
					_this.listLoading = false;
					if(res.data.ret) {
						_this.totalpage = res.data.data.length;
						_this.tabData = res.data.data;
					} else {
						baseConfig.warningTipMsg(_this, res.data.msg);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		// 编辑修改某一条随机签名
		changeOneUserData(index, rows){
			var _this = this;
			var id = rows.id; 	
			_this.formTwo.id = id;
			_this.formTwo.name = rows.signature;
			_this.dialogFormVisible=true; 
		},
		// 确定编辑修改随机签名(val对应的值：0->取消，1->确认)
		editorSure(val) {
			var _this = this;
			if(val==0) {
				_this.dialogFormVisible=false; 
			} else if(val==1) {
				_this.listLoading = true;
				// 进行添加的操作
				var url = '/GlobalSet/editRandomSignature';
				var params = {
					signature: _this.formTwo.name,
					id: _this.formTwo.id,
				};
				if(params.signature!=''){
					_this.dialogFormVisible=false; 
					axios.get(allget+url, {params: params})
						.then((res) => {
							if(res.data.ret) {
								_this.listLoading = false;
								baseConfig.successTipMsg(_this, '编辑修改成功！');
								_this.getTableData();
							} else {
								baseConfig.warningTipMsg(_this, res.data.msg);
							}
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					_this.listLoading = false; 
					baseConfig.warningTipMsg(_this, '修改的随机签名内容不能为空');
				}
			} 
		},
		// 删除某一条随机签名
		deleteOneUserData(index, rows) {
			var _this = this;
			var id = rows.id;	
			_this.listLoading = true;
			var url = '/GlobalSet/delRandomSignature';
			var params = {
				id: id,
			};
			axios.get(allget+url, {params: params})
				.then((res) => {
					_this.listLoading = false;
					if(res.data.ret) {
						baseConfig.successTipMsg(_this, '删除成功'); 
						_this.getTableData();
					} else {
						baseConfig.warningTipMsg(_this, res.data.msg);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		// 获取文件保存的操作
		uploading(event) {
			var _this = this;
      	    var windowURL = window.URL || window.webkitURL;
            _this.formThree.file = event.target.files[0];
      	},
		// 提交整个Excel表的操作 
      	submit() {
            var _this = this;
		  	let formData = new FormData();
          	formData.append('file', _this.formThree.file);
          	let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post(allget+'/GlobalSet/addRandomSignature', formData, config)
				.then((res) => {
					if(res.data.ret) {
						baseConfig.successTipMsg(_this, '增加成功');
						_this.getTableData();
						_this.excelBoxActivity = false; 
					} else {
						baseConfig.warningTipMsg(_this, res.data.msg);
					}
			    })
				.catch((err) => {
					console.log(err);
			    });
	  	},
		// 进行页面刷新功能
		refreshPage() {
			var _this = this;
			var strPath = location.href;
            if(strPath.indexOf('http://')==0) {
                strPath = strPath.substring(strPath.indexOf('http://')+7, strPath.length);
            }
			var index = strPath.indexOf('/');
			strPath = strPath.substring(index+2,strPath.length);
            _this.$router.replace({
                path: '/empty', 
                query: {from: strPath},
            });
		},
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight); 
			_this.getTableData(); 
		})
	}
};
</script>

<style lang="css" scoped>
/* 页面样式css内容 */
.excelBox{
	width: 500px; height: 190px; margin-left: -150px; background: #f1f7ff;
	position: absolute; left: 50%; top: 15%; z-index: 1000;
}
p{ margin: 0; }
.excelBox>p{
	width:100%; height: 50px; line-height: 50px; font-weight:bold;
	background: #e3efff; text-align:center;
}
.excelBox .excelInput{
	width:100%; height: 60px;
}
.excelBox .select{
	width:100%; height: 80px;
}
.excelBox .excelInput p,
.excelBox .select p{
	width:100%; height: 36px; text-indent: 20px; line-height: 36px;
}
.excelBox .excelInput input{
    width:300px; display:block; margin: 0 auto;
}
.excelBox .select>div{
	width:300px; display:block; margin: 0 auto;
}
.btns{
    width:100%; height: 50px;
}
.btns button{
    width: 80px; height: 40px; text-align:center; line-height: 40px;
    border: none; border-radius: 5px;
    background-color: #78B2FF; margin-top:20px; color: #fff;
}
.btns button:nth-of-type(1){
    margin-left: 150px; cursor: pointer;
}
.btns button:nth-of-type(2){
    margin-left: 50px; cursor: pointer;
}
</style>
