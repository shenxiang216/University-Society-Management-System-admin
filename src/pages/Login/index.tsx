import { Form, Input, Button, message } from 'antd'
import { useHistory } from 'react-router-dom'
import style from './style.module.css'
import * as api from '../../services/api'

interface Values {
  username: string
  password: string
}

export default function Login() {
  const [form] = Form.useForm<Values>()
  const history = useHistory()
  const submit = async () => {
    try {
      let values = await form.validateFields()
      /**
       * 修改这里登陆验证
       */
      let result = await api.login(values.username, values.password)
      if (result.stat === 'OK') {
        message.success('登录成功')
        history.push('/home')
      } else {
        message.error(result.message)
      }
    } catch (error) {}
  }

  return (
    <div className={style.wrap}>
      <Form className={style.form} form={form}>
        <div className={style.title}>登录/注册</div>
        <Form.Item
          name='username'
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder='用户名' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input type='password' placeholder='密码' />
        </Form.Item>
        <Form.Item>
          <Button block type='primary' onClick={submit}>
          登录 / 注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
