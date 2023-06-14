<template>
  <div class="home">
    <!--    头部信息-->
    <Header></Header>
    <el-container class="content">
      <!--      导航栏-->
      <Menu></Menu>
      <el-main>
        <!--          主体部分上部小导航栏-->
        <el-card>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index">{{ item.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>

        <div class="cont">
          <div class="options">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="findResult">查询</el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="addResult">添加</el-button>
            <el-button type="primary" size="mini" @click="upload">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            <el-button type="primary" icon="el-icon-thumb" size="mini" @click="flush">刷新</el-button>
          </div>
          <!--          文件上传对话框-->
          <el-dialog :visible.sync="isUpload">
            <el-upload
                class="upload-demo"
                ref="upload"
                action="http://localhost:8081/score/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="(res)=>uploadSuccess(res)"
                :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">可上传txt文件</div>
            </el-upload>
          </el-dialog>
          <!--    嵌套表单的对话框-->
          <el-dialog :title="isAdd ? '新增成绩信息' : isFind ? '查询成绩信息' : '编辑成绩信息' " :visible.sync="dialogFormVisible">
            <span class = "span" v-if="!(isAdd || isFind)">该操作只需要修改成绩</span>
            <el-form :model="formResult">
              <!--        学号-->
              <el-form-item label="学号" :label-width="formLabelWidth">
                <el-input v-model="formResult.sid" autocomplete="off"></el-input>
              </el-form-item>
              <!--        姓名-->
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input v-model="formResult.name" autocomplete="off"></el-input>
              </el-form-item>
              <!--        课程名-->
              <el-form-item label="课程名" :label-width="formLabelWidth">
                <el-input v-model="formResult.courseName" autocomplete="off"></el-input>
              </el-form-item>
              <!--        得分-->
              <el-form-item label="成绩" :label-width="formLabelWidth" v-if="!isFind">
                <el-input v-model="formResult.score" autocomplete="off"></el-input>
              </el-form-item>
              <!--        专业班级-->
              <el-form-item label="专业" :label-width="formLabelWidth" v-if="isFind">
                <el-select v-model="formResult.major" placeholder="请选择专业">
                  <el-option value="计算机"></el-option>
                  <el-option value="物联网"></el-option>
                  <el-option value="电信科"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年级" :label-width="formLabelWidth" v-if="isFind">
                <el-select v-model="formResult.grade" placeholder="请选择年级">
                  <el-option value="19"></el-option>
                  <el-option value="20"></el-option>
                  <el-option value="21"></el-option>
                  <el-option value="22"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级" :label-width="formLabelWidth" v-if="isFind">
                <el-select v-model="formResult.classNum" placeholder="请选择班级">
                  <el-option value="1"></el-option>
                  <el-option value="2"></el-option>
                  <el-option value="3"></el-option>
                  <el-option value="4"></el-option>
                  <el-option value="5"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
          </el-dialog>
          <div>
            <!--    主体表格部分-->
            <el-table :data="tableData.slice((currentPage -1) * pageSize, currentPage*pageSize)" style="width: 100%">
              <el-table-column prop="id" label="成绩编号" width="0" v-if="showResultId"></el-table-column>
              <el-table-column prop="sid" label="学号" width="100"></el-table-column>
              <el-table-column prop="name" label="姓名" width="100"></el-table-column>
              <el-table-column prop="score" label="成绩" width="100"></el-table-column>
              <el-table-column prop="courseName" label="课程" width="100"></el-table-column>
              <el-table-column prop="major" label="专业" width="100"></el-table-column>
              <el-table-column prop="grade" label="年级" width="100"></el-table-column>
              <el-table-column prop="classNum" label="班级" width="100"></el-table-column>
              <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editResult(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="delResult(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--    分页部分-->
          <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
          </div>
        </div>


      </el-main>
    </el-container>
  </div>
</template>

<script>
import Menu from "@/components/common/Menu";
import Header from "@/components/common/Header";
export default {
  name: "score",
  components: {
    Header,
    Menu
  },
  data() {
    return {
      isUpload: false,
      showResultId: false,
      isAdd: true,
      isFind: true,
      formLabelWidth: '100px',
      tableData: [
        //     {
        //   id: '1',
        //   cid: '1',
        //   sid: '2020218000',
        //   name: '吴子文',
        //   score: '99',
        //   course: '组合数学',
        //   major: '计算机',
        //   grade: '20',
        //   classNum: '3'
        // }
      ],
      formResult: {
        id: '',
        cid: '',
        sid: '',
        name: '',
        score: '',
        courseName: '',
        major: '',
        grade: '',
        classNum: ''
      },
      dialogFormVisible: false,
      //  分页数据
      currentPage: 1,//当前页面数
      total: 0,//总数据数
      pageSizes: [5, 10, 15],
      pageSize: 5, //每页条数

      //文件上传
      fileList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    upload(){
      this.isUpload = true
    },
    flush(){
      this.tableData = {}
      this.formResult = {}
      this.getData()
    },
    getData(){
      this.service.get('/score')
          .then(res=>{
            console.log(res)
            if(res.data.code === 200){
              this.$message({
                message: '信息加载成功',
                type: 'success'
              })
              console.log("请求所有学生信息成功");
              this.tableData = [...res.data.data]
              this.total = this.tableData.length
              console.log(this.tableData.length)
            }else{
              console.log(res.data.msg)
              this.$message({
                message: '查无数据',
                type: 'error'
              })
            }
          })
          .catch(err=>{
            console.log(err)
          })
    },
    //新增成绩信息
    addResult(){
      this.formResult = {}
      this.dialogFormVisible = true
      this.isAdd = true
      this.isFind = false

    },
    //查询成绩信息
    findResult(){
      this.formResult = {}
      this.dialogFormVisible = true
      this.isAdd = false
      this.isFind = true

    },
    //对话框的确认按钮
    confirm(){
      console.log(this.formResult)
      this.dialogFormVisible = false
      if(this.isAdd){
        //新增
        this.service.post('/score',this.formResult)
            .then(res=>{
              console.log(res)
              if(res.data.code == 200){
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.getData()
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
            .catch(err=>{
              console.log(err)
            })
      }else if(this.isFind){
        this.formResult.id = '-1'
        this.formResult.score = '-1'
        //查询
        this.service.post('/score/getScore',this.formResult)
            .then(res=>{
              console.log(res)
              if(res.data.code == 200){
                this.$message({
                  message: '查询成功',
                  type: 'success'
                })
                this.tableData = [...res.data.data]
                this.total = this.tableData.length
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch(err=>{
              console.log("这里出错")
              console.log(err)
            })
      }else{
        //编辑
        this.service.put('/score',this.formResult)
            .then(res=>{
              console.log(res)
              if(res.data.code == 200){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              }else{

              }
            })
            .catch(err=>{
              console.log(err)
            })
      }
    },
    //编辑信息
    editResult(row){
      this.dialogFormVisible = true
      this.isAdd = false
      this.isFind = false
      this.formResult = row
    },
    //删除成绩信息
    delResult(row){
      this.$confirm('此操作将删除该条成绩信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("执行删除方法")
        console.log(row)
        this.service.delete("/score/" + row.id)
            .then(res=>{
              if(res.data.code == 200){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }else{

              }
              this.getData()
            })
            .catch(err=>{
              console.log(err)
            })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //分页
    handleSizeChange(val) {
      //更改每页条数的时候返回第一页
      this.currentPage = 1
      this.pageSize = val
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`);
    },
    //文件上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadSuccess(res){

      console.log(res)
      if(res.code === 200){
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      }else{
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }

    }
  }
}
</script>

<style lang="scss">
.home {
  .content {
    height: 600px;
  }

  .cont {
    margin: 20px;

    .options {
      margin-bottom: 20px;
    }
    .span{
      color: red;
    }
    //弹出的对话框底部按钮居中
    .dialog-footer{
      text-align: center;
    }
  }
}
</style>
