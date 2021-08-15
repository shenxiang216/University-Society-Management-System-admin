import { useState, useEffect } from 'react'
import style from './style.module.css'
import * as api from '../../services/api'
import { message } from 'antd'
export default function Repsw() {
  const [oldPassword, setoldPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [examPassword, setExamPassword] = useState<string>('')
  const [disable, setDisable] = useState<boolean>(true)
  function handelChangeu(e: any) {
    setoldPassword(e.target.value)
  }
  function handelChangep(e: any) {
    setPassword(e.target.value)
  }
  function handelChangen(e: any) {
    setExamPassword(e.target.value)
  }

  useEffect(() => {
    if (examPassword !== '' && oldPassword !== '' && password !== '') {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [oldPassword, password, examPassword])
  async function Repass() {
    if (oldPassword === examPassword) {
      message.error('新旧密码不能相同')
      return
    }
    if (password !== examPassword) {
      message.error('两次输入的新密码必须相同')
      return
    }
    const result = await api.repass(oldPassword, password)
    if (result.stat === 'OK') {
      message.success('修改成功')
      setoldPassword('')
      setPassword('')
      setExamPassword('')
    } else {
      message.error(result.message)
    }
  }
  return (
    <div className={style.page}>
      <div className={style.login}>
        <div className={style.wrap}>
          <label className={style.inputtext}> 旧密码:</label>
          <input
            type='password'
            value={oldPassword}
            className={style.logininput}
            onChange={handelChangeu}
            placeholder='请输入旧密码'
          ></input>
        </div>
        <div className={style.wrap}>
          <label className={style.inputtext}> 新密码:</label>
          <input
            type='password'
            value={password}
            className={style.logininput}
            onChange={handelChangep}
            placeholder='请输入新密码'
          ></input>
        </div>
        <div className={style.wrap}>
          <label className={style.inputtext}> 新密码:</label>
          <input
            type='password'
            value={examPassword}
            className={style.logininput}
            onChange={handelChangen}
            placeholder='请确认新密码'
          ></input>
        </div>
        <button
          disabled={disable}
          onClick={Repass}
          className={style.loginbutton}
        >
          修改密码
        </button>
      </div>
    </div>
  )
}
