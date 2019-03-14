import React from 'react'
import { Form, Input, Button, Card, Icon ,Row,Col} from 'antd'
import auth from '../../services/auth'
import {getCaptcha} from '../../utils/request'
import { history } from '../../utils/config'
import Styles from './Index.less'
import loginTitle from '../../assets/loginTitle.png'

const FormItem = Form.Item

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      msgText: '短信验证码',
      countFlag: true,
      count: 60
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  handleSubmit (e) {
    e.preventDefault()
    const {account, verifyCode} = this.props.form.getFieldsValue()

    auth.login(account,verifyCode, (loggedIn) => {
      if (loggedIn) {
        history.push('/homePage')
      }
    })
  }

  getCaptcha(e){
    e.preventDefault();
    const {account,} = this.props.form.getFieldsValue();
    if(!this.state.countFlag){
      return false;
    }
    getCaptcha(`/admin/${account}/sendVerifyCode`).then(res => {
      //   debugger;
      if(res && res.code == 0){
        console.log(res, 'res')
        this.state.countFlag = false;
        this.timer = setInterval(() => {
          if (this.state.count <= 0) {
            clearInterval(this.timer);
            this.state.countFlag = true;
            this.state.count = 60;
            this.setState({
              // time: 60,
              msgText: '获取验证码',
              countFlag: true
              // countFlag: true
            })
          } else {
            this.state.count--;
            this.setState({
              msgText: `${this.state.count} s`
            })
          }
        }, 1000)
      }

    })
  }

  render () {
    const {getFieldDecorator} = this.props.form

    return (
      <div className={Styles.baseColor}>
        <div className={Styles.backgroundWrapper}>
          <div className={Styles.titleWrapper}>
            {/*<img src={loginTitle} style={{marginBottom: 100}}/>*/}
            <div className={Styles.loginWrapper}>
              <Card noHovering={true} style={{borderRadius: 6}}>
                <Form
                  style={{width: 300, margin: 'auto'}}
                  onSubmit={e => this.handleSubmit(e)}
                  className='login-form'
                >
                  <FormItem style={{marginTop: 30}}>
                    <div
                      style={{
                        fontSize: 16,
                        textAlign: 'center',
                        color: '#606060'
                      }}
                    >管理员登录</div>
                  </FormItem>
                  <FormItem >
                    {getFieldDecorator('account', {
                      rules: [
                        {required: true, message: '请输入账号'}
                      ]
                    })(
                      <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='请输入账户名' />
                    )}
                  </FormItem>
                  <FormItem
                  >
                    <Row gutter={8}>
                      <Col span={12}>
                        {getFieldDecorator('verifyCode', {
                          rules: [{required: true, message: '请输入短信验证码'}],
                        })(
                          <Input size="large" placeholder="请输入短信验证码"/>
                        )}
                      </Col>
                      <Col span={12}>
                        <Button size="large" onClick={(e) => this.getCaptcha(e)}>{this.state.msgText}</Button>
                      </Col>
                    </Row>
                  </FormItem>
                  {/*<FormItem >*/}
                    {/*{getFieldDecorator('password', {*/}
                      {/*rules: [*/}
                        {/*{required: true, message: '请输入密码'}*/}
                      {/*]*/}
                    {/*})(*/}
                      {/*<Input prefix={<Icon type='lock' style={{ fontSize: 13 }} />} type='password' placeholder='请输入密码' />*/}
                    {/*)}*/}
                  {/*</FormItem >*/}
                  <Button style={{width:'100%', height:46, marginBottom: 80, fontSize: 16}} type='primary' htmlType='submit'>登录</Button>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Login = Form.create()(Login)

export default Login
