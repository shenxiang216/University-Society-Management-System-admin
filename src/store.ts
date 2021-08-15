import { makeAutoObservable } from 'mobx'
import { IUser, UserRole } from './types'
import { Sex, Status } from '../src/types'
class Store {
  user: IUser = {
    /**
     * 角色
     */
    role: UserRole.Worker,
    /**
     * 用户名
     */
    username: '',
    /**
     * 密码
     */
    password: '',
    /**
     * 名字
     */
    nickname: '',
    /**
     * 性别
     */
    sex: Sex.Man,
    /**
     * 头像
     */
    photo: '',
    /**
     * 个人职位
     */
    position: '',
    /**
     * 感兴趣
     */
    interested: [],
    /**
     * 状态
     */
    state: Status.Normal,
  }

  setUser(user: IUser) {
    this.user = user
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new Store()
