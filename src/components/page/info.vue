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

        <div v-if="role == 1">这里是学生信息</div>
        <div v-if="role == 2">这里是老师信息</div>
        <div v-if="role == 3">这里是管理员信息</div>


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
      role: '',
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
    this.role = localStorage.getItem("role")
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
