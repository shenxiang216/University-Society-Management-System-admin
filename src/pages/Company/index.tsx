import { Table, Form, Button, Menu, Dropdown, Tag, message } from 'antd'
import { SettingOutlined, PlusOutlined } from '@ant-design/icons'
import { ColumnProps } from 'antd/lib/table'
import style from './style.module.css'
import * as api from '../../services/api'
import { ICompany, Status, UserRole } from '../../types'
import Edit from './Edit'
import { useState } from 'react'
import { useEffect } from 'react'
import store from '../../store'
import { useHistory } from 'react-router-dom'
export default function Company(props: { match: { url: any } }) {
  const [visible, setVisible] = useState<boolean>(false)
  const [company, setCompany] = useState<ICompany[]>([])
  const [data, SetData] = useState<number>(0)
  const [current, setCurrent] = useState<ICompany>()
  const history = useHistory()
  useEffect(() => {
    const getData = async () => {
      try {
        if (store.user.role === UserRole.SuperAdmin) {
          let result = await api.listcompany()
          if (result.stat === 'OK') {
            setCompany(result.rows)
          }
        }
        if (store.user.role === UserRole.Boss) {
          let result = await api.listallcompany()
          if (result.stat === 'OK') {
            setCompany(result.rows)
          }
        }
      } catch (error) {
        message.error('网络错误')
      }
    }
    getData()
  }, [data])

  const columns: ColumnProps<ICompany>[] = [
    {
      title: 'Logo',
      dataIndex: 'companyLogo',
      align: 'center',
      width: 80,
      render: (value) => <img alt='logo' src={value} width='80' />,
    },
    {
      title: '社团名',
      dataIndex: 'companyName',
     
    },
    {
      title: '社团地址',
      dataIndex: 'companyAddress',
    },
    {
      title: '社团规模',
      dataIndex: 'companySize',
      align: 'center',
      
      render: (value: Status) => {
        if (value === 1) return '少于20人'
        if (value === 2) return '20-99人'
        if (value === 3) return '100-499人'
        if (value === 4) return '500-999人'
        if (value === 5) return '1000-9999人'
        return '一万人以上'
      },
    },
    {
      title: '社团类型',
      dataIndex: 'trade',
    },
    {
      title: '更新时间',
      dataIndex: 'refreshTime',
    },
    {
      title: '详情',
      dataIndex: 'companyIntroduce',
      align: 'center',
      width: 200,
      render: (value: string) => {
        return value.slice(0, 30)
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 50,
      render: (value: Status) => {
        if (value === 1) return <Tag color='green'>可用</Tag>
        return <Tag color='red'>禁用</Tag>
      },
    },

    {
      title: '操作',
      key: 'opt',
      width: 50,
      align: 'center',
      render: (record: ICompany) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key='view'
                  onClick={() =>
                    history.push(`${props.match.url}/${record._id}`)
                  }
                >
                  查看
                </Menu.Item>
                <Menu.Item key='edit' onClick={() => edit(record)}>
                  编辑
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
  function edit(record: ICompany) {
    setCurrent(record)
    setVisible(true)
    SetData(1)
  }
  function add() {
    setCurrent({} as ICompany)
    setVisible(true)
    SetData(2)
  }

  return (
    <>
      <Form layout='inline' className={style.toolbar}>
        <Form.Item>
          <Button type='primary' onClick={add} icon={<PlusOutlined />}>
            添加社团
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={company} rowKey='_id' columns={columns} />
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
