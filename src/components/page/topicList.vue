<template>
  <div class="studentList">
    <!--    查询 以及 新增的表单-->
    <el-form :inline="true" :model="formInLine" class="demo-form-inline" size="small">
      <el-form-item>
        <el-input v-model="formInLine.id" placeholder="请输入题号"></el-input>
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
    <el-dialog :title="isAdd ? '新增题目信息' : '修改题目信息' " :visible.sync="dialogFormVisible">
      <el-form :model="topic">
        <!--        题号-->
        <el-form-item label="题号" :label-width="formLabelWidth">
          <el-input v-model="topic.id" autocomplete="off"></el-input>
        </el-form-item>
        <!--        名称-->
        <el-form-item label="题目名称" :label-width="formLabelWidth">
          <el-input v-model="topic.topicName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目描述" :label-width="formLabelWidth">
          <el-input v-model="topic.topicDesc" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="topic.type" placeholder="请选择类型">
            <el-option value="1">web</el-option>
            <el-option value="2">操作系统</el-option>
            <el-option value="3">深度学习</el-option>
            <el-option value="4">算法</el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!--    选题对话框-->
    <el-dialog :title="'选题'" :visible.sync="dialogForm1Visible">
      <el-form :model="selectTopic">
        <!--        题号-->
        <el-form-item label="题号" :label-width="formLabelWidth">
          <el-input v-model="selectTopic.id" autocomplete="off"></el-input>
        </el-form-item>
        <!--        名称-->
        <el-form-item label="题目名称" :label-width="formLabelWidth">
          <el-input v-model="selectTopic.topicName" autocomplete="off"></el-input>
        </el-form-item>
        <!--        学号-->
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="selectTopicReq.stuNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="指导教师" :label-width="formLabelWidth">
          <el-select v-model="selectTopicReq.teacherId" placeholder="请选择">
            <el-option
                v-for="item in teacherData"
                :key="item.id"
                :label="item.teacherName"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </div>
    </el-dialog>

    <!--    主体表格部分-->
    <el-table :data="tableData.slice((currentPage -1) * pageSize, currentPage*pageSize)" style="width: 100%">
      <el-table-column prop="id" label="题号" width="200"></el-table-column>
      <el-table-column prop="topicName" label="题目名称" width="200"></el-table-column>
      <el-table-column prop="typeDesc" label="所属类型" width="200"></el-table-column>
      <el-table-column prop="stock" label="余量" width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" width="350">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-share" size="mini" @click="open(scope.row)">详情</el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="select(scope.row)">选题</el-button>
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
  name: "topicList",
  data () {
    return {
      isAdd: true,
      role: '',
      stuNo: '',
      //表格数据
      tableData: [],
      teacherData: [],
      //查询数据
      formInLine: {
        id: ''
      },
      //新增数据
      topic: {
        id: '',
        topicName: '',
        topicDesc: '',
        type: '',
        stock: '',
        typeDesc: ''
      },
      selectTopic: {
        id: '',
        topicName: '',
        topicDesc: '',
        type: '',
        stock: '',
        typeDesc: '',
        stuNo: '',
        teacherId: '',
        teacherNo: ''
      },
      selectTopicReq: {
        topicId: '',
        stuNo: '',
        teacherId: ''
      },
      dialogFormVisible: false,
      dialogForm1Visible: false,
      formLabelWidth: '100px',
      //  分页数据
      currentPage: 1,//当前页面数
      total: 0,//总数据数
      pageSizes: [5, 10, 15],
      pageSize: 5 //每页条数
    }
  },

  created() {
    this.role = localStorage.getItem('role');
    this.getData();
  },

  methods: {
    //刷新
    flush(){
      this.formInLine = {}
      this.getData()
      console.log("11111111111111111111111")
      this.selectTopic.stuNo = ''
      console.log(this.selectTopic)
      this.selectTopicReq = ''
      console.log(this.selectTopicReq)
      this.teacherData = ''
      console.log(this.teacherData)
    },
    //获取所有数据
    getData(){
      console.log("请求所有题目信息")
      this.service.get('/topicInfo/getAll',this.student)
          .then(res=>{
            console.log(res)
            if(res.data.code === 200){
              this.$message({
                message: '信息加载成功',
                type: 'success'
              })
              console.log("请求所有信息成功");
              this.tableData = [...res.data.data]
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
      if(this.role <= 1){
        this.$message({
          message: '您没有权限',
          type: 'error',
          duration: 1000
        });
        return
      }
      this.topic = row
      this.isAdd=false
      console.log(this.isAdd)
      this.dialogFormVisible=true;



    },
    //删除学生信息
    del(row){
      if(this.role <= 1){
        this.$message({
          message: '您没有权限',
          type: 'error',
          duration: 1000
        });
        return
      }
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
      if(this.role <= 1){
        this.$message({
          message: '您没有权限',
          type: 'error',
          duration: 1000
        });
        return
      }
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
    open(row) {
      this.$alert(row.topicDesc, '题目详情', {
        confirmButtonText: '确定'
      });
    },
    select(row) {
      this.dialogForm1Visible = true
      this.selectTopic = row
      this.selectTopicReq.topicId = row.id
      var getTeacherListReq = {type:row.type}
      this.service.post("/topicInfo/getTeacherCanSelect",getTeacherListReq)
          .then(
              res=>{
                console.log(res)
                if(res.data.code === 200){
                  this.$message({
                    message: '信息加载成功',
                    type: 'success'
                  })
                  console.log("请求所有信息成功");
                  this.teacherData = [...res.data.data]
                }else{
                  this.$message({
                    message: '请求失败',
                    type: 'error'
                  })
                }
              }
          )
          .catch(err=>{
            console.error(err)
          })
    },
    confirmSelect(){
      this.dialogForm1Visible = false
      // 确认选题
      this.service.post("/selectedTopic/add",this.selectTopicReq)
        .then(res=>{
          console.log(res)
          if(res.data.code === 200){
            this.$message({
              message: '信息加载成功',
              type: 'success'
            })
            console.log("添加选题信息成功");
          }else{
            this.$message({
              message: '请求失败',
              type: 'error'
            })
          }
        })
        .catch(err=>{
          console.error(err)
        })
      this.flush()


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
