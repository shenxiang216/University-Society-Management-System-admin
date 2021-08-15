import store from '../../store'
import style from './style.module.css'
import { useState, useEffect } from 'react'
import * as api from '../../services/api'
import { message } from 'antd'
export default function Info() {
  const [nickname, setNickname] = useState<string>(store.user.nickname)
  const [position, setPosition] = useState<string>(store.user.position)
  const [disable, setDisable] = useState<boolean>(true)
  function handelChange(e: any) {
    setNickname(e.target.value)
  }
  function handelChangp(e: any) {
    setPosition(e.target.value)
  }
  useEffect(() => {
    if (nickname !== store.user.nickname) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [nickname, position])
  async function Update() {
    let record = store.user
    record.nickname = nickname
    record.position = position
    const result = await api.updateInfo(record)
    if (result.stat === 'OK') {
      message.success('修改成功')
      // store.setUser(result.data)
    }
  }
  return (
    <div className={style.container}>
      <img
        src={`/api/file/download/${store.user.photo}`}
        alt=''
        className={style.photo}
      />
      <div className={style.wrap}>
        <label className={style.inputtext}>账号:</label>
        <input
          type='text'
          value={store.user.username}
          className={style.logininput}
          placeholder={store.user.username}
          disabled={true}
        ></input>
      </div>
      <div className={style.wrap}>
        <label className={style.inputtext}> 姓名:</label>
        <input
          type='text'
          value={nickname}
          className={style.logininput}
          onChange={handelChange}
          placeholder={store.user.nickname}
        ></input>
      </div>
      <div className={style.wrap}>
        <label className={style.inputtext}>职位:</label>
        <input
          type='text'
          value={position}
          className={style.logininput}
          onChange={handelChangp}
          placeholder={store.user.position}
        ></input>
      </div>
      <button disabled={disable} onClick={Update} className={style.loginbutton}>
        更新信息
      </button>
    </div>
  )
}
