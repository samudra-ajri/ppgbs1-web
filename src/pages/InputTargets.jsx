import BackHeader from '../components/BackHeader'

function InputTargets(props) {
  const rawTitle = props.path.split('/')
  const title = rawTitle[rawTitle.length - 1]
  return (
    <>
      <BackHeader title={title} />
    </>
  )
}

export default InputTargets