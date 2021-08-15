import {
  Table,
  Form,
  Button,
  Menu,
  Dropdown,
  Tag,
  message,
  Input,
  Modal,
} from 'antd'
import { SettingOutlined, PlusOutlined } from '@ant-design/icons'
import { ColumnProps } from 'antd/lib/table'
import style from './style.module.css'
import * as api from '../../services/api'
import { Status, UserRole, IUser, Sex } from '../../types'
import Edit from './Edit'
import { useState } from 'react'
import { useEffect } from 'react'
import store from '../../store'
export default function Users(props: { match: { params: { id: string } } }) {
  const [visible, setVisible] = useState<boolean>(false)
  const [user, setUser] = useState<IUser[]>([])
  const [data, SetData] = useState<number>(0)
  const [current, setCurrent] = useState<IUser>()
  const [dis, setDis] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  useEffect(() => {
    const getData = async () => {
      try {
        if (
          (store.user.role === UserRole.SuperAdmin ||
            store.user.role === UserRole.Boss) &&
          props.match.params.id != null
        ) {
          let result = await api.listcompanyusers(props.match.params.id)
          if (result.stat === 'OK') {
            setUser(result.rows)
            setDis(true)
          }
        }
        if (
          store.user.role === UserRole.SuperAdmin &&
          props.match.params.id === undefined
        ) {
          let result = await api.listuser(keyword)
          if (result.stat === 'OK') {
            setUser(result.rows)
          }
        }
      } catch (error) {
        message.error('网络错误')
      }
    }
    getData()
  }, [props.match.params.id, keyword, data])

  const columns: ColumnProps<IUser>[] = [
    {
      title: '头像',
      dataIndex: 'photo',
      align: 'center',
      width: 80,
      render: (value) => <img alt='lable' src={value} width='80' />,
    },
    {
      title: '名称',
      dataIndex: 'nickname',
      align: 'center',
      width: 80,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      render: (value: Sex) => {
        if (value === Sex.Man) return <Tag color='blue'>男</Tag>
        return <Tag color='red'>女</Tag>
      },
    },
    {
      title: '个人职位',
      dataIndex: 'position',
    },

    {
      title: '状态',
      dataIndex: 'state',
      width: 50,
      render: (value: Status) => {
        if (value === Status.Normal) return <Tag color='green'>可用</Tag>
        return <Tag color='red'>禁用</Tag>
      },
    },

    {
      title: '操作',
      key: 'opt',
      width: 50,
      align: 'center',
      render: (record) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key='edit' onClick={() => edit(record)}>
                  编辑
                </Menu.Item>
                <Menu.Item
                  key='remove'
                  style={{ display: dis ? '' : 'none' }}
                  onClick={() => remove(record)}
                >
                  删除
                </Menu.Item>
              </Menu>
            }
          >
            <Button icon={<SettingOutlined />} />
          </Dropdown>
        )
      },
    },
  ]
  function edit(record: IUser) {
    setCurrent(record)
    setVisible(true)
    SetData(1)
  }
  function add() {
    setCurrent({} as IUser)
    setVisible(true)
    SetData(2)
  }
  function remove(record: IUser) {
    Modal.confirm({
      title: '提示',
      content: `确定要删除该职员吗？`,
      onOk: async () => {
        if (record._id === undefined) return null
        console.log(record._id)
        let result = await api.delcompanyuser(record._id)
        if (result.stat === 'OK') {
          message.success('职员已删除')
          SetData(3)
        } else {
          message.warning(result.message)
        }
      },
    })
  }

  return (
    <>
      <Form layout='inline' className={style.toolbar}>
        <Form.Item style={{ display: dis ? '' : 'none' }}>
          <Button type='primary' onClick={add} icon={<PlusOutlined />}>
            添加职员
          </Button>
        </Form.Item>
        <Form.Item style={{ display: dis ? 'none' : '' }}>
          <Input
            placeholder='姓名'
            autoComplete='off'
            allowClear
            value={keyword}
            onKeyDown={(e) => {
              if (e.key === 'Enter') SetData(1)
            }}
            onChange={(e) => {
              setKeyword(e.target.value.trim())
            }}
          />
        </Form.Item>
        <Form.Item style={{ display: dis ? 'none' : '' }}>
          <Button type='primary' onClick={() => SetData(2)}>
            搜索
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={user} rowKey='_id' columns={columns} />
      {visible && (
        <Edit
          id={props.match.params.id}
          record={current}
          onSuccess={() => SetData(3)}
          afterClose={() => setVisible(false)}
        />
      )}
    </>
  )
}
