import * as React from 'react'
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom'
import { Menu, Layout, Avatar, Dropdown, message } from 'antd'
import 'antd/dist/antd.css'
import { TeamOutlined, UserOutlined, FileOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'

import style from './style.module.css'
import store from '../../store'
import * as api from '../../services/api'
import ExamineCompany from '../ExamineCompany'
import Repsw from '../Repsw'
import Users from '../Users'
import Company from '../Company'
import Info from '../Info'
import Jobs from '../Jobs'
import { UserRole } from '../../types'

@observer
export default class Home extends React.Component<RouteComponentProps> {
  //获取用户信息
  async userInfo() {
    let result = await api.userInfo()
    if (result.stat === 'OK') {
      store.setUser(result.data)
    } else {
      message.warning('请先登录')
      this.props.history.push('/login')
    }
  }

  async logout() {
    await api.logout()
    message.success('已退出登录')
    this.props.history.push('/login')
  }

  async componentDidMount() {
    this.userInfo()
  }

  render() {
    let prefix = this.props.match.url

    // 系统管理员
    const admin = (
      <>
        <Menu.Item icon={<TeamOutlined />} key={`${prefix}/examinecompany`}>
          社团审核
        </Menu.Item>
        <Menu.Item icon={<TeamOutlined />} key={`${prefix}/company`}>
          社团管理
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${prefix}/users`}>
          用户管理
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${prefix}/repsw`}>
          修改密码
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${prefix}/info`}>
          个人信息
        </Menu.Item>
      </>
    )
    // 企业管理员
    const admincompany = (
      <>
        <Menu.Item icon={<FileOutlined />} key={`${prefix}/company`}>
          我的社团
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${prefix}/info`}>
          个人信息
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${prefix}/repsw`}>
          修改密码
        </Menu.Item>
      </>
    )
    // 企业用户
    const company = (
      <>
        <Menu.Item icon={<FileOutlined />} key={`${prefix}/jobs`}>
          社团活动
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${prefix}/info`}>
          个人信息
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />} key={`${prefix}/repsw`}>
          修改密码
        </Menu.Item>
      </>
    )
    // 普通用户
    const normal = (
      <>
        <Menu.Item icon={<TeamOutlined />} key={`${prefix}/company`}>
          我的社团
        </Menu.Item>
        <Menu.Item icon={<TeamOutlined />} key={`${prefix}/repsw`}>
          修改密码
        </Menu.Item>
        <Menu.Item icon={<TeamOutlined />} key={`${prefix}/info`}>
          个人信息
        </Menu.Item>
      </>
    )
    let Item = normal
    if (store.user != null && store.user.role === UserRole.Admin) Item = company
    if (store.user != null && store.user.role === UserRole.Boss)
      Item = admincompany
    if (store.user != null && store.user.role === UserRole.SuperAdmin)
      Item = admin
    return (
      <Layout className={style.layout}>
        <Layout.Header className={style.header}>
          <div className={style.brand}>社团管理系统</div>
          <span className={style.username}>{store.user?.nickname}</span>
          <Dropdown
            arrow
            placement='bottomCenter'
            overlay={
              <Menu>
                <Menu.Item key='logout' onClick={this.logout.bind(this)}>
                  退出登录
                </Menu.Item>
              </Menu>
            }
          >
            <Avatar
              src={store.user.photo?`/api/file/download/${store.user.photo}`:'https://img2.baidu.com/it/u=1529904285,1383039143&fm=26&fmt=auto&gp=0.jpg'}
              className={style.avatar}
            />
          </Dropdown>
        </Layout.Header>
        <Layout>
          <Layout.Sider width={150}>
            <Menu
              theme='dark'
              onSelect={(item) => {
                this.props.history.push(item.key)
              }}
              selectedKeys={[this.props.location.pathname]}
            >
              {Item}
            </Menu>
          </Layout.Sider>
          <Layout.Content className={style.content}>
            <Switch>
              <Route
                path={`${prefix}/examinecompany`}
                exact
                component={ExamineCompany}
              />
              <Route path={`${prefix}/repsw`} component={Repsw} />
              <Route path={`${prefix}/users`} exact component={Users} />
              <Route path={`${prefix}/company`} exact component={Company} />
              <Route path={`${prefix}/company/:id`} component={Users} />
              <Route path={`${prefix}/info`} exact component={Info} />
              <Route path={`${prefix}/jobs`} exact component={Jobs} />
              <Redirect from={`${prefix}`} to={`${prefix}/info`} />
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    )
  }
}
