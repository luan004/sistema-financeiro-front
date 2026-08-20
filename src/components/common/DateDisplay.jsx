import moment from 'moment'

export function DateDisplay({ date }) {
  const full = moment(date).format('DD/MM/YYYY HH:mm:ss')

  return <span title={full}>{moment(date).calendar()}</span>
}