<template>
  <div class="studentList">
<!--    查询 以及 新增的表单-->
    <el-form :inline="true" :model="formInLine" class="demo-form-inline" size="small">
      <el-form-item>
        <el-input v-model="formInLine.sid" placeholder="请输入学号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="findStu">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addStu">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="flush">刷新</el-button>
      </el-form-item>
    </el-form>
<!--    嵌套表单的对话框-->
    <el-dialog :title="isAdd ? '新增学生信息' : '修改学生信息' " :visible.sync="dialogFormVisible">
      <el-form :model="student">
<!--        学号-->
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="student.sid" autocomplete="off"></el-input>
        </el-form-item>
<!--        姓名-->
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="student.name" autocomplete="off"></el-input>
        </el-form-item>
<!--        专业班级-->
        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-select v-model="student.major" placeholder="请选择专业">
            <el-option value="计算机"></el-option>
            <el-option value="物联网"></el-option>
            <el-option value="电信科"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" :label-width="formLabelWidth">
          <el-select v-model="student.grade" placeholder="请选择班级">
            <el-option value="19"></el-option>
            <el-option value="20"></el-option>
            <el-option value="21"></el-option>
            <el-option value="22"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-select v-model="student.classNum" placeholder="请选择班级">
            <el-option value="1"></el-option>
            <el-option value="2"></el-option>
            <el-option value="3"></el-option>
            <el-option value="4"></el-option>
            <el-option value="5"></el-option>
          </el-select>
        </el-form-item>
<!--        性别-->
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio v-model="student.sex" label='1'>男</el-radio>
          <el-radio v-model="student.sex" label='0'>女</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
<!--    主体表格部分-->
    <el-table :data="tableData.slice((currentPage -1) * pageSize, currentPage*pageSize)" style="width: 100%">
      <el-table-column prop="sid" label="学号" width="120"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" width="120"></el-table-column>
      <el-table-column prop="major" label="专业" width="120"></el-table-column>
      <el-table-column prop="grade" label="年级" width="120"></el-table-column>
      <el-table-column prop="classNum" label="班级" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--      分页部分-->
      <el-pagination class="block"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

  </div>

</template>

<script>
export default {
  name: "studentList",
  data () {
    return {
      isAdd: true,
      //表格数据
      tableData: [],
      //查询数据
      formInLine: {
        sid: ''
      },
      //新增数据
      //有三个默认数据
      student: {
        sid: '',
        name: '',
        sex: '1',
        major: '计算机',
        grade: '20',
        classNum: '1'
      },
      dialogFormVisible: false,
      formLabelWidth: '100px',
      //  分页数据
      currentPage: 1,//当前页面数
      total: 0,//总数据数
      pageSizes: [5, 10, 15],
      pageSize: 5 //每页条数
    }
  },

  created() {
    this.getData();
  },

  methods: {
    //刷新
    flush(){
      this.formInLine = {}
      this.getData()
    },
    //获取所有数据
    getData(){
      console.log("请求所有student信息")
      this.service.get('/student',this.student)
      .then(res=>{
        console.log(res)
        if(res.data.code === 200){
          this.$message({
            message: '信息加载成功',
            type: 'success'
          })
          console.log("请求所有学生信息成功");
          this.tableData = [...res.data.data]
          this.tableData.forEach(item=>{
            item.sex === 1 ? item.sex = "男" : item.sex = "女"
          })
          this.total = this.tableData.length
        }else{
          this.$message({
            message: '请求失败',
            type: 'error'
          })
        }
      })
      .catch(err=>{
        this.$message({
          message: '请求错误',
          type: 'error',
          duration: 1000
        });
      })
    },

    //编辑学生信息
    edit(row){
      //编辑数据的回显
      // this.student.sid = row.sid;
      // this.student.name = row.name;
      // this.student.sex = row.sex;
      // this.student.major = row.major;
      // this.student.agent = row.agent;
      // this.student.class = row.class;
      //原来还有这种写法，我竟然还一个一个复制
      this.student = row
      console.log(row.sex === '男')
      row.sex === '男' ? this.student.sex = '1' : this.student.sex = '0';
      this.isAdd=false
      console.log(this.isAdd)
      this.dialogFormVisible=true;

    },
    //删除学生信息
    del(row){
      this.$confirm('此操作将删除学生信息以及对应的成绩信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("执行删除方法")
        console.log(row)
        this.service.delete("/student/" + row.sid)
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
        .then(err=>{
          console.log(err)
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //查找学生信息
    findStu(){
      console.log(this.formInLine)
      this.service.get("/student/" + this.formInLine.sid)
      .then(res=>{
        console.log("执行findStu")
        console.log(res)
        if(res.data.code === 200){
          console.log("请求成功")
          this.tableData = [...res.data.data]
          this.tableData.forEach(item=>{
            item.sex === 1 ? item.sex = "男" : item.sex = "女"
          })
          this.total = this.tableData.length
        }
      })
      .catch(err=>{
        console.error(err)
      })

    },
    //增加学生信息
    addStu(){
      this.student = {}
      this.isAdd=true
      this.dialogFormVisible=true;
    },
    //确定添加（修改）
    submitAdd(){
      this.dialogFormVisible=false;
      if(this.isAdd){
        console.log("执行添加方法")
        console.log(this.student)
        this.service.post("/student",this.student)
        .then(res=>{
          console.log(res)
          if(res.data.code === 200){
            this.$message({
              message: '新增数据成功',
              type: 'success'
            })

          }else{
            this.$message({
              message: res.data.data,
              type: 'error'
            })
          }
        this.getData()
        })
        .catch(err=>{
          console.error(err)
        })
      }else{
        console.log("执行修改方法")
        this.service.put("/student",this.student)
        .then(res=>{
          console.log(res)
          if(res.data.code === 200){
            this.$message({
              message: '修改数据成功',
              type: 'success'
            })
            this.getData()
          }
        })
        .catch(err=>{
          console.error(err)
        })
      }


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
.studentList {
  .el-form-item {
    text-align: left;
  }
  .dialog-footer{
    text-align: center;
  }
  .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
  .block {
    margin-top: 30px;
    text-align: center;
  }
}
</style>