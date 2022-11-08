// 将播放时长还原为秒数
function returnSecond (time) {
  time = time.split(':')
  const m = parseInt(time[0])
  const s = parseInt(time[1])
  return m * 60 + s
}

export default returnSecond
