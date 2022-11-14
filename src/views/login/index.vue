<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-form">
        <ul class="list-none p0 m0 mb60px">
          <li class="tab mr20 tab-active">密码登录</li>
        </ul>
        <el-form
          ref="ruleFormRef"
          :model="loginForm"
          :rules="loginRules"
          autocomplete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip
            :visible="capsTooltip"
            content="大写锁定打开"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin(ruleFormRef)"
              >
                <template #suffix>
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon
                      :icon-class="
                        passwordType === 'password' ? 'eye' : 'eye-open'
                      "
                    />
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </el-tooltip>

          <el-form-item v-if="codeForm.captchaEnabled" prop="code">
            <el-input
              class="flex-1"
              v-model="loginForm.code"
              placeholder="验证码"
            >
            </el-input>
            <img
              class="h35px ml10px"
              :src="codeForm.img"
              @click="getCaptchaImageHandle"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              color="#155bd4"
              style="width: 100%; height: 48px"
              @click.native.prevent="handleLogin(ruleFormRef)"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="w320px h500px bg-white bg flex items-center">
        <img src="@/assets/images/login_banner.jpg" class="w100%" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { validUsername } from '~/utils/validate';
import type { FormRules, FormInstance } from 'element-plus';
import type { InternalRuleItem } from 'async-validator/dist-types/interface';
import { LoginTypeEnum } from '~/enums/userEnum';
import { LocationQuery, LocationQueryValue } from 'vue-router';
import { useUserStore } from '~/store';
import { getCaptchaImage } from '~/api/user/index';
import type * as API from '@/api/user/types';
import { useDebounceFn } from '@vueuse/shared';
import { ElMessage } from 'element-plus';

const validateUsername = (
  rule: InternalRuleItem,
  value: string,
  callback: Function
) => {
  if (!validUsername(value)) {
    callback(new Error('请输入用户名'));
  } else {
    callback();
  }
};
const validatePassword = (
  rule: InternalRuleItem,
  value: string,
  callback: Function
) => {
  if (value.length < 6) {
    callback(new Error('密码至少6个字符'));
  } else {
    callback();
  }
};
const usreStore = useUserStore();

const route = useRoute();
const router = useRouter();

const loginForm = reactive<API.UserRequestParams>({
  username: 'admin',
  password: '123456',
  code: '',
  uuid: ''
});

const codeForm = reactive({
  captchaEnabled: true,
  img: '',
  uuid: ''
});

const loginRules = reactive<FormRules>({
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
  code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
});

const ruleFormRef = ref<FormInstance>();

const loading = ref(false);
const capsTooltip = ref(false);
const showDialog = ref(false);
const passwordType = ref(LoginTypeEnum.PASSWORD);

let redirect: LocationQueryValue | LocationQueryValue[] | undefined = undefined;
// query other than redirect.
let otherQuery: LocationQuery = {};

watch(
  () => route.query,
  (query) => {
    redirect = query.redirect;
    otherQuery = getOtherQuery(query);
  },
  { immediate: true }
);

onMounted(() => {
  getCaptchaImageHandle();
});

/**
 * 获取验证码
 */
const getCaptchaImageHandle = useDebounceFn(() => {
  getCaptchaImage().then((res) => {
    const { captchaEnabled, uuid, img } = res.data;
    codeForm.captchaEnabled = captchaEnabled;
    codeForm.uuid = uuid;
    loginForm.uuid = uuid;
    codeForm.img = `data:image/gif;base64,${img}`;
  });
}, 300);

function checkCapslock(e: any): void {
  const { key } = e;
  capsTooltip.value = key && key.length === 1 && key >= 'A' && key <= 'Z';
}

function showPwd(): void {
  if (passwordType.value === LoginTypeEnum.PASSWORD) {
    passwordType.value = LoginTypeEnum.EMPTY;
  } else {
    passwordType.value = LoginTypeEnum.PASSWORD;
  }
}

function handleLogin(formEl: FormInstance | undefined): boolean {
  if (!formEl) return false;
  if (!codeForm.uuid) return false;
  formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const res = await usreStore.login(loginForm);
      const { data } = res;

      if (data && data.token) {
        ElMessage({
          type: 'success',
          message: '登录成功'
        });
        router.push({ path: (redirect as string) || '/', query: otherQuery });
      }

      loginForm.code = '';
      getCaptchaImageHandle();

      loading.value = false;
    } else {
      console.log('error submit!!');
      return false;
    }
  });
  return true;
}

function getOtherQuery(query: LocationQuery): LocationQuery {
  return Object.keys(query).reduce((acc: LocationQuery, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #333;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 100%;

    .el-input__wrapper {
      width: 100%;
      background: #fff;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 40px;
      caret-color: $cursor;
      box-shadow: none;
      font-size: 18px;
      border-bottom: 1px solid #dcdee0;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #f2f3f5;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  user-select: none;

  .login-box {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    box-sizing: border-box;
  }
  .banner {
    width: 320px;
    height: 500px;
    background: #fff;
  }

  .login-form {
    margin-right: 20px;
    padding: 50px 56px 60px 56px;
    width: 550px;
    height: 500px;
    background: #fff;

    .el-form-item {
      margin-bottom: 40px;
      border: none;
    }

    .tab {
      cursor: default;
    }

    .tab-active {
      font-size: 24px;
      color: #323233;
      font-weight: 500;
    }
  }
}
</style>
