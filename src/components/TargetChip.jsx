import { Box, Chip } from '@mui/material'

function TargetChip(props) {
  const targets = props.subject.targets

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

  return (
    <>
      <Box textAlign={align()}>
        {targets.map((target) => (
          <Chip variant='outlined' key={target} sx={style()}
            label={target} color='success' onClick={handleClick}/>
        ))}
      </Box>
    </>
  )
}

export default TargetChip