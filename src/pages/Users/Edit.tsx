import { Modal, Form, Input, Button, Select, message } from 'antd'
import { useState } from 'react'
import { IUser, Status } from '../../types'
import * as api from '../../services/api'
import store from '../../store'
const { Option } = Select
interface Props {
  id: string
  record?: IUser
  afterClose: () => void
  onSuccess: () => void
}

export default function Edit(props: Props) {
  const [form] = Form.useForm<IUser>()
  const [disabled, setDisabled] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(true)

  function close() {
    setVisible(false)
  }

  async function submit() {
    try {
      let values = await form.validateFields()
      setDisabled(true)
      if (store.user.role === 2) {
        await api.manageuser(props.record?._id)
      } else {
        let result = await api.addcompanyuser(
          values.username,
          values.position,
          props.id
        )
        if (result.stat === 'OK') {
          message.success('用户添加成功')
          close()
          props.onSuccess()
        } else {
          message.error(result.message)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setDisabled(false)
      console.log('finally')
    }
  }

  return (
    <Modal
      visible={visible}
      title={props.record?._id ? '编辑信息' : '添加公司职员'}
      onCancel={close}
      maskClosable={false}
      afterClose={props.afterClose}
      destroyOnClose
      width={1000}
      footer={[
        <Button type='text' key='cancel' onClick={close}>
          取消
        </Button>,
        <Button type='primary' key='ok' onClick={submit} disabled={disabled}>
          确认
        </Button>,
      ]}
    >
      {props.record?._id ? (
        <Form form={form} initialValues={props.record} labelCol={{ span: 3 }}>
          <Form.Item
            name='state'
            label='状态'
            rules={[
              {
                required: true,
                message: '请选择状态',
              },
            ]}
          >
            <Select defaultValue={Status.Offline} style={{ width: 120 }}>
              <Option value={Status.Normal}>可用</Option>
              <Option value={Status.Offline}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      ) : (
        <Form form={form} initialValues={props.record} labelCol={{ span: 3 }}>
          <Form.Item
            name='username'
            label='账号'
            rules={[
              {
                required: true,
                message: '请填写账号',
              },
            ]}
          >
            <Input placeholder='请填写账号' />
          </Form.Item>
          <Form.Item
            name='position'
            label='个人职位'
            rules={[
              {
                required: true,
                message: '请填写个人职位',
              },
            ]}
          >
            <Input placeholder='请填写个人职位' />
          </Form.Item>
          <Form.Item
            name='state'
            label='状态'
            rules={[
              {
                required: true,
                message: '请选择状态',
              },
            ]}
          >
            <Select defaultValue={Status.Offline} style={{ width: 120 }}>
              <Option value={Status.Normal}>可用</Option>
              <Option value={Status.Offline}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}
