import {
  Table,
  Form,
  Button,
  Input,
  Menu,
  Dropdown,
  Modal,
  Tag,
  message,
} from 'antd'
import { SettingOutlined, PlusOutlined } from '@ant-design/icons'
import { ColumnProps } from 'antd/lib/table'
import style from './style.module.css'
import * as api from '../../services/api'
import { IJobs, Status } from '../../types'
import Edit from './Edit'
import { useState } from 'react'
import { useEffect } from 'react'
export default function Jobs() {
  const [visible, setVisible] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [jobs, setJobs] = useState<IJobs[]>([])
  const [data, SetData] = useState<number>(0)
  const [current, setCurrent] = useState<IJobs>()
  useEffect(() => {
    const getData = async () => {
      let handle = message.loading('正在加载数据...', 0)
      try {
        let result = await api.listmyjobs(keyword)
        if (result.stat === 'OK') {
          setJobs(result.rows)
        }
        handle()
      } catch (error) {
        handle()
        message.error('网络错误')
      }
    }
    getData()
  }, [keyword, data])

  const columns: ColumnProps<IJobs>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '城市',
      dataIndex: 'city',
    },
   
    {
      title: '标签',
      dataIndex: 'label',
      align: 'center',

    },
   
    {
      title: '详情',
      dataIndex: 'decription',
      align: 'center',
      width: 200,
      render: (value: string) => {
        return value.slice(0, 30)
      },
    },
    {
      title: '更新时间',
      dataIndex: 'refreshTime',
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 50,
      render: (value: Status) => {
        if (value === 1) return <Tag color='green'>上架</Tag>
        return <Tag color='red'>下架</Tag>
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
                <Menu.Item key='delete' onClick={() => remove(record)}>
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

  function edit(record: IJobs) {
    setCurrent(record)
    setVisible(true)
  }

  function reset() {
    setKeyword('')
  }
  function remove(record: IJobs) {
    Modal.confirm({
      title: '提示',
      content: `确定要删除该活动吗？`,
      onOk: async () => {
        let result = await api.deljob(record._id)
        if (result.stat === 'OK') {
          message.success('活动已删除')
          SetData(4)
        } else {
          message.warning(result.message)
        }
      },
    })
  }
  function add() {
    setCurrent({} as IJobs)
    setVisible(true)
  }

  return (
    <>
      <Form layout='inline' className={style.toolbar}>
        <Form.Item>
          <Button type='primary' onClick={add} icon={<PlusOutlined />}>
            添加活动
          </Button>
        </Form.Item>
        <Form.Item>
          <Input
            placeholder='标题'
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
        <Form.Item>
          <Button type='primary' onClick={() => SetData(2)}>
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={reset}>重置</Button>
        </Form.Item>
      </Form>
      <Table dataSource={jobs} rowKey='_id' columns={columns} />
      {visible && (
        <Edit
          record={current}
          onSuccess={() => SetData(3)}
          afterClose={() => setVisible(false)}
        />
      )}
    </>
  )
}
