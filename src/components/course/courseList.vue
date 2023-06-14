<template>
  <div class="courseList">
    <!--    查询 以及 新增的表单-->
    <el-form :inline="true" :model="formInLine" class="demo-form-inline" size="small">
      <el-form-item>
        <el-input v-model="formInLine.name" placeholder="请输入课程名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="findCourse">查询</el-button>
      </el-form-item>
<!--      新增课程的操作  是否需要待定-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="addCourse">新增</el-button>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="flush">刷新</el-button>
      </el-form-item>
    </el-form>

    <!--    主体表格部分-->
    <el-table :data="tableData.slice((currentPage -1) * pageSize, currentPage*pageSize)" style="width: 100%">
      <el-table-column prop="id" label="课程编号" width="200"></el-table-column>
      <el-table-column prop="name" label="课程名" width="200"></el-table-column>
      <el-table-column prop="majors" label="专业" width="400">
          <template slot-scope="scope">
<!--       这里有一个大坑，就是表格数据tableData被slice之后，tableData就变了，这里的tableData也要响应的进行slice操作，因为获取当前行的下标已经变了-->
            <template v-for="(item) in tableData.slice((currentPage -1) * pageSize, currentPage*pageSize)[scope.$index].majors">
              {{item}}
            </template>
<!--            <span v-text="scope.$index+1"></span>-->
          </template>
      </el-table-column>
      <el-table-column prop="grade" label="年级" width="200"></el-table-column>
<!--      <el-table-column fixed="right" label="操作" width="200">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>-->
<!--          <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

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

</template>

<script>
export default {
  name: "course",
  data(){
    return{
      //展示在表格的数据
      tableData: [
        // {
        //   id: '1',
        //   name: '嵌入式系统原理',
        //   majors: ['计算机','物联网','电信科'],
        //   grade: '4'
        // }
      ],
      //查询表单的数据
      formInLine: {
        name: ''
      },
      //好像没啥用，但是我又不敢删
      course: {
        id: '',
        name: '',
        majors: [],
        grade: ''
      },
      //  分页数据
      currentPage: 1,//当前页面数
      total: 0,//总数据数
      pageSizes: [5, 10, 15],
      pageSize: 5 //每页条数

    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(){
      console.log("获取所有课程信息")
      this.service.get("/course")
      .then(res=>{
        console.log(res)
        if(res.data.code == 200){
          this.$message({
            message: '信息获取成功',
            type: 'success'
          })
          this.tableData = [...res.data.data]
          this.total = this.tableData.length  //数据总数
          console.log(this.tableData.length)
        }else{
          this.$message({
            message: '信息获取失败',
            type: 'error'
          })
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    findCourse(){
      console.log(this.formInLine)
      this.service.post("/course/getCourse",this.formInLine)
      .then(res=>{
        console.log(res)
        if(res.data.code === 200){

          this.$message({
            message: '信息获取成功',
            type: 'success'
          })
          this.tableData = [...res.data.data]
          this.total = this.tableData.length  //数据总数

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
    },
    flush() {
      console.log("执行刷新方法")
      this.getData()
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
.courseList{
  .block{
    margin-top: 30px;
  }
}
</style>