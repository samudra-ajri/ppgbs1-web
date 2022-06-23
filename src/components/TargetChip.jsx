import { Box, Chip } from '@mui/material'
import { useState } from 'react'
import equalArray from '../helpers/equalArray'
import BackHeader from './BackHeader'

function TargetChip(props) {
  const targets = props.subject.targets
  const initCompleted = props.completion ? props.completion.completed : []
  const [completed, setCompleted] = useState(initCompleted)

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
    } else if (target && isCompleted(target)) {
      setCompleted(completed.filter(completed => completed !== target))
    }
  }

  const isCompleted = (target) => {
    return completed.includes(target)
  }

  return (
    <>
      <BackHeader title={props.subject.name} subject={props.subject} isModified={!equalArray(completed, initCompleted)} completed={completed} />
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