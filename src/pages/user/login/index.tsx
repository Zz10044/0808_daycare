import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox, message } from 'antd';
import React, { useState } from 'react';
import { Link, SelectLang, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/child.png';
import { LoginParamsType, fakeAccountLogin } from '@/services/login';
import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Tab, Username, Password, Mobile, Captcha, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await fakeAccountLogin({ ...values, type });
      if (msg.status === 'ok') {
        message.success('login successful！');
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('login failed, please try again');
    }
    setSubmitting(false);
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>DayCare System</span>
            </Link>
          </div>
          <div className={styles.desc}>A Team project of CSYE6200 in NEU </div>
        </div>

        <div className={styles.main}>
          <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
            <Tab key="account" tab="account password">
              {status === 'error' && loginType === 'account' && !submitting && (
                <LoginMessage content="Incorrect account or password（admin/ant.design）" />
              )}

              <Username
                name="username"
                placeholder="account: admin or useAr"
                rules={[
                  {
                    required: true,
                    message: 'please enter username!',
                  },
                ]}
              />
              <Password
                name="password"
                placeholder="password: ant.design"
                rules={[
                  {
                    required: true,
                    message: 'please enter password！',
                  },
                ]}
              />
            </Tab>
            <Tab key="mobile" tab="phone number">
              {status === 'error' && loginType === 'mobile' && !submitting && (
                <LoginMessage content="Verification code error" />
              )}
              <Mobile
                name="mobile"
                placeholder="number"
                rules={[
                  {
                    required: true,
                    message: 'Please enter phone number！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: 'Malformed phone number！',
                  },
                ]}
              />
              <Captcha
                name="captcha"
                placeholder="verification code"
                countDown={120}
                getCaptchaButtonText=""
                getCaptchaSecondText="seconds"
                rules={[
                  {
                    required: true,
                    message: 'please input verification code ',
                  },
                ]}
              />
            </Tab>
            <div>
              <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                auto login
              </Checkbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                forget password
              </a>
            </div>
            <Submit loading={submitting}>Login</Submit>
            <div className={styles.other}>
            Other login methods
              <AlipayCircleOutlined className={styles.icon} />
              <TaobaoCircleOutlined className={styles.icon} />
              <WeiboCircleOutlined className={styles.icon} />
              <Link className={styles.register} to="/user/register">
                sign up
              </Link>
            </div>
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
