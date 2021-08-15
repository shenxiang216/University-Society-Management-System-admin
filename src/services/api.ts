import * as request from './request'
import { ICompany, IJobs, IUser } from '../types'

interface BaseRes {
  stat: string
  message?: string
}

interface UserRes extends BaseRes {
  data: IUser
}
interface UserList extends BaseRes {
  rows: IUser[]
}
interface CompanyList extends BaseRes {
  rows: ICompany[]
}

interface JobRes extends BaseRes {
  rows: IJobs[]
}

/**
 * 管理端登录、注册
 * @param username
 * @param password
 * @returns
 */
export function login(username: string, password: string) {
  return request.post<UserRes>('/api/user/login', {
    username,
    password,
  })
}

/**
 * 用户修改密码（普通用户、管理员、超级管理员）
 * @param oldPassword
 * @param newPassword
 * @returns
 */
export function repass(oldPassword: string, newPassword: string) {
  return request.post<BaseRes>('/api/user//settings/password', {
    oldPassword,
    newPassword,
  })
}

/**
 * 获取用户信息
 * @returns
 */
export function userInfo() {
  return request.post<UserRes>('/api/user/userinfo')
}
/**
 * 更新用户信息
 * @param record
 * @returns
 */
export function updateInfo(record:any) {
  return request.post<UserRes>('/api/user/settings',record)
}

/**
 * 退出登录
 * @returns
 */
export function logout() {
  return request.post<BaseRes>('/api/user/exit')
}

/**
 * 列出所有企业
 * @param word
 * @returns
 */
export function listcompany(word: string = '') {
  return request.post<CompanyList>('/api/superadmin/companyList', {
    word,
  })
}

/**
 * 系统管理员禁用、删除企业
 */
export function managecompany() {}

/**
 * 列出所有用户
 * @param word
 * @returns
 */
export function listuser(word: string = '') {
  return request.post<UserList>('/api/superadmin/userList', {
    word,
  })
}

/**
 * 系统管理员可用、禁用、删除用户
 * @param id
 * @returns
 */
export function manageuser(id?: string) {
  return request.post<BaseRes>('/api/superadmin/changeUserStatus', {
    id,
  })
}

/**
 * 系统管理员审核企业通过与否
 * @param id
 * @returns
 */
export function examcompany(id?: string) {
  return request.post<BaseRes>('/api/superadmin/examine', {
    id,
  })
}
/**
 * 查看审核中的企业名单
 * @returns
 */
export function findexamcompany() {
  return request.post<CompanyList>('/api/superadmin/companyCreateList')
}

/**
 * 列出我的公司
 * @returns
 */
export function listmycompany() {
  return request.post<CompanyList>('/api/admin/myCompany')
}

/**
 * 查看我管理的职位
 * @param word
 * @returns
 */
export function listmyjobs(word: string = '') {
  return request.post<JobRes>('/api/admin/positions', {
    word,
  })
}

/**
 * 发布职位信息
 * @param record
 * @returns
 */
export function addjob(record: IJobs) {
  return request.post<BaseRes>('/api/admin/addjob', record)
}

/**
 * 修改职位信息
 * @param record
 * @returns
 */
export function rejob(record: IJobs) {
  return request.post<BaseRes>('/api/admin/rejob', record)
}

/**
 * 删除招聘信息
 * @param _id
 * @returns
 */
export function deljob(_id: string) {
  return request.post<BaseRes>('/api/admin/deletejob', {
    _id: _id,
  })
}

/**
 * 修改企业信息
 * @param record
 * @returns
 */
export function recompany(record: ICompany) {
  return request.post<BaseRes>('/api/companymanage/recompany', record)
}

/**
 * 创建企业
 * @param record
 * @returns
 */
export function addcompany(record: ICompany) {
  return request.post<BaseRes>('/api/companymanage/createCompany', record)
}

/**
 * 根据企业id展示某个企业所有用户
 * @param id
 * @returns
 */
export function listcompanyusers(id: string) {
  return request.post<UserList>('/api/companymanage/companyUsers', {
    id,
  })
}

/**
 * 展示他所创建的公司
 * @returns
 */
export function listallcompany() {
  return request.post<CompanyList>('/api/companymanage/companies')
}

/**
 * 企业创建者添加企业用户
 * @param username
 * @param position
 * @param companyId
 * @returns
 */
export function addcompanyuser(
  username: string,
  position: string,
  companyId?: string
) {
  return request.post<BaseRes>('/api/companymanage/addcompanyUsers', {
    username,
    position,
    companyId,
  })
}

/**
 * 企业创建者删除企业用户
 * @param id
 * @returns
 */
export function delcompanyuser(id: string) {
  return request.post<BaseRes>('/api/companymanage/deleteCompanyUser', {
    id,
  })
}
