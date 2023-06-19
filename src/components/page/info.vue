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

        <div v-if="role == 1">
          <el-card>
            <el-descriptions title="学生信息">
              <el-descriptions-item label="姓名">{{stuInfo.stuName}}</el-descriptions-item>
              <el-descriptions-item label="学号">{{stuInfo.stuNo}}</el-descriptions-item>
              <el-descriptions-item label="专业">{{stuInfo.majorName}}</el-descriptions-item>
              <el-descriptions-item label="选题编号">{{stuInfo.selectedTopicId}}</el-descriptions-item>
              <el-descriptions-item label="选题名称">{{stuInfo.topicName}}</el-descriptions-item>
              <el-descriptions-item label="选题类型">{{stuInfo.topicTypeDesc}}</el-descriptions-item>
              <el-descriptions-item label="选题进度">{{stuInfo.progressDesc}}</el-descriptions-item>
              <el-descriptions-item label="指导老师名称">{{stuInfo.teacherName}}</el-descriptions-item>
            </el-descriptions>
          </el-card>

        </div>
        <div v-if="role == 2">
<!--          老师信息-->
          <el-card>
            <el-descriptions title="老师信息">
              <el-descriptions-item label="姓名">{{teacherInfo.teacherName}}</el-descriptions-item>
              <el-descriptions-item label="工号">{{teacherInfo.teacherNo}}</el-descriptions-item>
              <el-descriptions-item label="指导课题类型">{{teacherInfo.typeDesc}}</el-descriptions-item>
              <el-descriptions-item label="剩余可以指导学生数">{{teacherInfo.stock}}</el-descriptions-item>
            </el-descriptions>
          </el-card>
<!--          已经指导的学生的数量-->
          <el-card>
            <el-table :data="tableData.slice((currentPage -1) * pageSize, currentPage*pageSize)" style="width: 100%">
              <el-table-column prop="id" label="选题编号" width="200"></el-table-column>
              <el-table-column prop="stuNo" label="学号" width="200"></el-table-column>
              <el-table-column prop="stuName" label="学生姓名" width="200"></el-table-column>
              <el-table-column prop="topicName" label="选题名称" width="200"></el-table-column>
              <el-table-column prop="progressDesc" label="进度" width="200"></el-table-column>
            </el-table>
          </el-card>
<!--          可以选择的学生的数量-->
          <el-card>
            <el-table :data="tableData1.slice((currentPage1 -1) * pageSize1, currentPage1*pageSize1)" style="width: 100%">
              <el-table-column prop="id" label="选题编号" width="200"></el-table-column>
              <el-table-column prop="stuNo" label="学号" width="200"></el-table-column>
              <el-table-column prop="stuName" label="学生姓名" width="200"></el-table-column>
              <el-table-column prop="topicName" label="选题名称" width="200"></el-table-column>
              <el-table-column prop="progressDesc" label="进度" width="200"></el-table-column>
              <el-table-column fixed="right" label="操作" width="350">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="agree(scope.row)">同意</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="refuse(scope.row)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
        <div v-if="role == 3">
          这里是管理员信息
        </div>


      </el-main>
    </el-container>
  </div>
</template>

<script>
import Menu from "@/components/common/Menu";
import Header from "@/components/common/Header";
export default {
  name: "info",
  components: {
    Header,
    Menu
  },
  data() {
    return {
      // 角色信息以及全局存储的相关数据
      role: '',
      stuNo: '',
      teacherNo: '',
      admin: '',

      stuInfo: {
        stuNo: '-',
        stuName: '-',
        majorName: '-',
        selectedTopicId: '-',
        topicName: '-',
        topicTypeDesc: '-',
        teacherName: '-',
        progressDesc: '-'
      },
      teacherInfo: {
        teacherNo: '-',
        teacherName: '-',
        typeDesc: '-',
        stock: '-'
      },
      formLabelWidth: '100px',
      tableData: [],
      tableData1: [],

      //  分页数据
      currentPage: 1,//当前页面数
      total: 0,//总数据数
      pageSizes: [5, 10, 15],
      pageSize: 5, //每页条数
      currentPage1: 1,//当前页面数
      total1: 0,//总数据数
      pageSizes1: [5, 10, 15],
      pageSize1: 5, //每页条数
      //文件上传
      fileList: []
    }
  },
  created() {
    this.role = localStorage.getItem("role")
    console.log(this.role)
    if(this.role == 1){
      this.stuNo = localStorage.getItem("stuNo")
      this.getStuOrTeacherInfo()
    }else if(this.role == 2){
      console.log("现在是角色2")
      this.teacherNo = localStorage.getItem("teacherNo")
      this.getStuOrTeacherInfo()
      this.getData()
      this.getData1()
    }else{
      this.admin = localStorage.getItem("admin")
    }
  },
  methods: {
    flush(){
      this.tableData = {}
      this.formResult = {}
      if(this.role === 1){
        this.getStuOrTeacherInfo()
      }else if(this.role === 2){
        this.getData()
        this.getData1()
      }else{

      }


    },
    getStuOrTeacherInfo() {
      // 根据角色判断查询老师信息还是学生信息
      if(this.role == 1){
        this.service.get('/studentInfo/getInfo/' + this.stuNo)
        .then(res=>{
          console.log(res)
          if(res.data.code == 200){
            this.stuInfo = res.data.data
            this.$message({
              message: '信息加载成功',
              type: 'success'
            })
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
      }else if(this.role == 2){
        this.service.get('/teacherInfo/getInfo/' + this.teacherNo)
        .then(res=>{
          console.log(res)
          if(res.data.code == 200){
            this.teacherInfo = res.data.data
            this.$message({
              message: '信息加载成功',
              type: 'success'
            })
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
      }
    },
    getData(){
      this.service.get('/selectedTopic/getSelectedStuListByTeacherNo/' + this.teacherNo)
          .then(res=>{
            console.log(res)
            if(res.data.code == 200){
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
    getData1(){
      this.service.get('/selectedTopic/getSelectingStuListByTeacherNo/' + this.teacherNo)
          .then(res=>{
            console.log(res)
            if(res.data.code == 200){
              this.$message({
                message: '信息加载成功1',
                type: 'success'
              })
              console.log("请求所有学生信息成功");
              this.tableData1 = [...res.data.data]
              this.total1 = this.tableData1.length
              console.log(this.tableData1.length)
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
    agree(row){
      var req = {id : row.id}
      this.service.post("/selectedTopic/agree",req)
      .then(res=>{
        if(res.data.code === 200){
          this.$message({
            message: '同意成功',
            type: 'success'
          })
          this.flush()
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
    refuse(row){
      var req = {id : row.id}
      this.service.post("/selectedTopic/refuse",req)
      .then(res=>{
        if(res.data.code === 200){
          this.$message({
            message: '拒绝成功',
            type: 'success'
          })
          this.flush()
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
