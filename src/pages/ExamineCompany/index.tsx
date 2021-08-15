import { Table, Button, Menu, Dropdown, Tag, message } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { ColumnProps } from 'antd/lib/table'
import * as api from '../../services/api'
import { ICompany, Status, UserRole } from '../../types'
import { useState } from 'react'
import { useEffect } from 'react'
import store from '../../store'
export default function ExamineCompany() {
  const [company, setCompany] = useState<ICompany[]>([])
  const [data, SetData] = useState<number>(0)
  const [current, setCurrent] = useState<ICompany>()

  useEffect(() => {
    const getData = async () => {
      try {
        let result = await api.findexamcompany()
        if (result.stat === 'OK') {
          setCompany(result.rows)
        }
      } catch (error) {
        message.error('网络错误')
      }
    }
    if (store.user.role === UserRole.SuperAdmin) {
      getData()
    }
  }, [data, current])

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
      width: 80,
    },
    {
      title: '社团地址',
      dataIndex: 'companyAddress',
    },
    {
      title: '社团规模',
      dataIndex: 'companySize',
      align: 'center',
      width: 100,
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
      render: (record) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key='edit' onClick={() => edit(record)}>
                  同意
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
  async function edit(record: ICompany) {
    setCurrent(record)
    await api.examcompany(record?._id)
    SetData(1)
  }

  return (
    <>
      <Table dataSource={company} rowKey='_id' columns={columns} />
    </>
  )
}
