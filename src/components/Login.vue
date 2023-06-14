<template>
  <div class="login">
    <el-card class="box-card">
      <div slot="header" class="el-card__header">
        <span>毕业设计管理系统</span>
      </div>
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="用户名" prop="username"
        :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
              min: 4,
              max: 10,
              message: '长度在4-10位字符之间',
              trigger: 'blur'

            }

        ]">
          <el-input type="text" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password"
        :rules="[
            {required: true, message: '请输入密码', trigger: 'blur'},
            {
              min: 6,
              max: 10,
              message: '长度在6-10位字符之间',
              trigger: 'blur'

            }
        ]">
          <el-input type="password" v-model="form.password" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    login() {
      console.log(this.form.username);
      console.log(this.form.password);
      this.service.post('/admin/login',this.form)
      .then(res => {
        console.log(res)
        if(res.data.code === 200){
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 1000
          });
          this.$router.push('/home');
        }else{
          this.$message({
            message: '用户名或者密码错误',
            type: 'error',
            duration: 1000
          });
        }
      })
      .catch(err => {
        console.error(err)
        this.$message({
          message: '网络错误',
          type: 'error',
          duration: 1000
        });
      })
    }
  }

}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #409EFF;
  .box-card {
    width: 450px;
    margin: 200px auto;
    .el-card__header {
      font-size: 34px;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
