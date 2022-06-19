import { Box, Chip } from '@mui/material'

function TargetChip(props) {
  const targets = props.subject.targets
  const completed = props.completion ? props.completion.completed : []

  const style = () => {
    if (
      props.subject.category === 'ALQURAN' ||
      props.subject.category === 'HADITS'
    ) return { m: 0.5, width: '15%' }
    return { m: 0.5 }
  }

  const align = () => {
    if (
      props.subject.category === 'ALQURAN' ||
      props.subject.category === 'HADITS'
    ) return 'center'
    return 'left'
  }

  const handleClick = () => {}

  const isCompleted = (target) => {
    return completed.includes(target)
  }

  return (
    <>
      <Box textAlign={align()}>
        {targets.map((target) => (
          <Chip variant={isCompleted(target) ? 'solid' : 'outlined'} key={target} sx={style()}
            label={target} color='success' onClick={handleClick}/>
        ))}
      </Box>
    </>
  )
}

export default TargetChip