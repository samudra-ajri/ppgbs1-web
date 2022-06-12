import BackHeader from '../components/BackHeader'
import LinearProgressWithLabel from '../components/LinearProgressWithLabel'

function DetailTargets(props) {
  const rawTitle = props.path.split('/')
  const title = rawTitle[rawTitle.length - 1]
  return (
    <>
      <BackHeader title={title}/>
      <LinearProgressWithLabel value={67} />
    </>
  )
}

export default DetailTargets