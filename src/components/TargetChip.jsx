import { Box, Chip } from '@mui/material'
import { useState } from 'react'
import BackHeader from './BackHeader'

function TargetChip(props) {
  const targets = props.subject.targets
  const [completed, setCompleted] = useState(
    props.completion ? props.completion.completed : []
  )
  const [isModified, setIsModified] = useState(false)

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

  const handleClick = (e) => {
    const target = e.target.childNodes[0].data

    if (target && !isCompleted(target)) {
      setCompleted(prevState => [...prevState, target])
      setIsModified(true)
    } else if (target && isCompleted(target)) {
      setCompleted(completed.filter(completed => completed !== target))
      setIsModified(true)
    }
  }

  const isCompleted = (target) => {
    return completed.includes(target)
  }

  return (
    <>
      <BackHeader title={props.subject.name} subject={props.subject} isModified={isModified} completed={completed} />
      <Box textAlign={align()}>
        {targets.map((target) => (
          <Chip 
            variant={isCompleted(target) ? 'solid' : 'outlined'} 
            key={target} 
            sx={style()}
            label={target} 
            color='success' 
            onClick={handleClick} 
          />
        ))}
      </Box>
    </>
  )
}

export default TargetChip