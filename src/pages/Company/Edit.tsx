//编辑
import { Modal, Form, Input, Button, Select, message } from 'antd'
import { useState } from 'react'
import { ICompany } from '../../types'
import * as api from '../../services/api'
interface Props {
  record?: ICompany
  afterClose: () => void
  onSuccess: () => void
}

export default function Edit(props: Props) {
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(true)

  function close() {
    setVisible(false)
  }

  async function submit() {
    try {
      let values = await form.validateFields()
      setDisabled(true)
      if (props.record?._id) {
        let result = await api.recompany({
          _id: props.record._id,
          ...values,
        })
        if (result.stat === 'OK') {
          message.success('社团信息更新成功')
          close()
          props.onSuccess()
        } else {
          message.error(result.message)
        }
      } else {
        let result = await api.addcompany(values)
        if (result.stat === 'OK') {
          message.success('申请成功，请等待审核')
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
      title={props.record?._id ? '编辑信息' : '添加社团'}
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
      <Form form={form} initialValues={props.record} labelCol={{ span: 3 }}>
        <Form.Item
          name='companyLogo'
          label='Logo'
          rules={[
            {
              required: true,
              message: '请上传logo',
            },
          ]}
        >
          <Input placeholder='请上传logo' />
        </Form.Item>
        <Form.Item
          name='companyName'
          label='社团名'
          rules={[
            {
              required: true,
              message: '请填写社团名',
            },
          ]}
        >
          <Input placeholder='请填写社团名' />
        </Form.Item>
        <Form.Item
          name='companyAddress'
          label='社团地址'
          rules={[
            {
              required: true,
              message: '请填写社团地址',
            },
          ]}
        >
          <Input placeholder='请填写社团地址' />
        </Form.Item>
        <Form.Item
          name='companySize'
          label='社团规模'
          rules={[
            {
              required: true,
              message: '请选择社团规模',
            },
          ]}
        >
          <Select placeholder='请选择社团规模'>
            <Select.Option value={1}>少于20人</Select.Option>
            <Select.Option value={2}>20-99人</Select.Option>
            <Select.Option value={3}>100-499人</Select.Option>
            <Select.Option value={4}>500-999人</Select.Option>
            <Select.Option value={5}>1000-9999人</Select.Option>
            <Select.Option value={6}>一万人以上</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='financing'
          label='融资情况'
          rules={[
            {
              required: true,
              message: '请输入融资情况',
            },
          ]}
        >
          <Input placeholder='请输入融资情况' />
        </Form.Item>
        <Form.Item
          name='trade'
          label='社团类型'
          rules={[
            {
              required: true,
              message: '请输入社团类型',
            },
          ]}
        >
          <Input placeholder='请输入社团类型' />
        </Form.Item>

        <Form.Item
          name='companyIntroduce'
          label='社团详情'
          rules={[
            {
              required: true,
              message: '请填写社团详情',
            },
          ]}
        >
          <Input.TextArea placeholder='请填写社团详情' rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
