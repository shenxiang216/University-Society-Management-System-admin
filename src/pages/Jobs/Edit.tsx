//编辑
import { Modal, Form, Input, Button, Select, message, InputNumber } from 'antd'
import { useState } from 'react'
import { IJobs, salary } from '../../types'
import * as api from '../../services/api'

interface Props {
  record?: IJobs
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
      let strArr = []
      strArr[0] = values.label
      strArr[1] = values.wages
      if (strArr[0].indexOf(' ')) values.label = strArr[0].split(' ')
      console.log(values.label)
      const wages: number[] = strArr[1].split('-').map(Number)
      let obj: salary = {
        min: wages[0],
        max: wages[1],
      }
      values.wages = obj
      setDisabled(true)
      if (props.record?._id) {
        let result = await api.rejob({
          _id: props.record._id,
          ...values,
        })
        if (result.stat === 'OK') {
          message.success('活动更新成功')
          close()
          props.onSuccess()
        } else {
          message.error(result.message)
        }
      } else {
        console.log('shibaui')
        let result = await api.addjob(values)
        if (result.stat === 'OK') {
          message.success('活动添加成功')
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
      title={props.record?._id ? '编辑活动' : '添加活动'}
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
          name='title'
          label='标题'
          rules={[
            {
              required: true,
              message: '请填写标题',
            },
          ]}
        >
          <Input placeholder='请填写标题' />
        </Form.Item>
        <Form.Item
          name='city'
          label='城市'
          rules={[
            {
              required: true,
              message: '请填写城市',
            },
          ]}
        >
          <Input placeholder='请填写城市' />
        </Form.Item>

        <Form.Item
          name='ageLimit'
          label='经验'
          rules={[
            {
              required: true,
              message: '请选择经验要求',
            },
          ]}
        >
          <Select placeholder='请选择经验要求'>
            <Select.Option value={0}>不限</Select.Option>
            <Select.Option value={1}>在校生</Select.Option>
            <Select.Option value={2}>应届生</Select.Option>
            <Select.Option value={3}>1年以内</Select.Option>
            <Select.Option value={4}>1-3年</Select.Option>
            <Select.Option value={5}>3-5年</Select.Option>
            <Select.Option value={6}>5-10年</Select.Option>
            <Select.Option value={7}>十年以上</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='degree'
          label='学历'
          rules={[
            {
              required: true,
              message: '请选择学历要求',
            },
          ]}
        >
          <Select placeholder='请选择学历要求'>
            <Select.Option value={1}>专科</Select.Option>
            <Select.Option value={2}>本科</Select.Option>
            <Select.Option value={3}>硕士</Select.Option>
            <Select.Option value={4}>博士</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name='label'
          label='标签'
          rules={[
            {
              required: true,
              message: '请填写活动标签',
            },
          ]}
          style={{ whiteSpace: 'pre' }}
        >
          <Input.TextArea
            placeholder='请填写活动标签，空格分隔'
            rows={4}
            style={{ width: 300 }}
          />
        </Form.Item>

        <Form.Item
          name='wages'
          label='薪资'
          rules={[
            {
              required: true,
              message: '请填写薪资范围',
            },
          ]}
          style={{ whiteSpace: 'pre' }}
        >
          <Input.TextArea
            placeholder='请填写薪资范围，例如12-15（K）'
            rows={2}
            style={{ width: 300 }}
          />
        </Form.Item>

        <Form.Item
          name='wagesTimes'
          label='薪资数'
          rules={[
            {
              type: 'number',
              required: true,
              message: '请填写薪资数',
            },
          ]}
        >
          <InputNumber
            placeholder='请填写薪资数'
            style={{ width: 200 }}
          ></InputNumber>
        </Form.Item>

        <Form.Item
          name='decription'
          label='活动详情'
          rules={[
            {
              required: true,
              message: '请填写活动详情',
            },
          ]}
        >
          <Input.TextArea placeholder='请填写详情' rows={5} />
        </Form.Item>
        <Form.Item
          name='address'
          label='活动地址'
          rules={[
            {
              required: true,
              message: '请填写活动地址',
            },
          ]}
        >
          <Input placeholder='请填写活动地址' />
        </Form.Item>
        <Form.Item
          name='state'
          label='活动状态'
          rules={[
            {
              required: true,
              message: '请选择活动状态',
            },
          ]}
        >
          <Select placeholder='请选择活动状态'>
            <Select.Option value={1}>上架</Select.Option>
            <Select.Option value={2}>下架</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
