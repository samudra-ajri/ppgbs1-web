import { Box, Chip } from '@mui/material'
import { useState } from 'react'
import equalArray from '../helpers/equalArray'
import BackHeader from './BackHeader'

function TargetChip(props) {
  const targets = props.subject.targets
  const initCompleted = props.completion ? props.completion.completed : []
  const [completed, setCompleted] = useState(initCompleted)

  const isCompleted = (completed, target) => {
    return completed.find(element => element === target);
  }

  const generateTargetsCompleted = () => {
    const targetCompleted = {}
    targets.map((target) => (
      targetCompleted[target] = isCompleted(initCompleted, target) ? true : false
    ))

    return targetCompleted
  }

  const initTargetCompleted = generateTargetsCompleted()
  const [targetCompleted, setTargetCompleted] = useState(initTargetCompleted)

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
    const target = e.target.innerText

    if (!targetCompleted[target]) {
      setTargetCompleted((prevState) => ({
        ...prevState,
        [target]: true
      }))
      setCompleted(prevState => [...prevState, target])
    } else {
      setTargetCompleted((prevState) => ({
        ...prevState,
        [target]: false
      }))
      setCompleted(completed.filter(completed => completed !== target))
    }
  }

  return (
    <>
      <BackHeader title={props.subject.name} subject={props.subject} isModified={!equalArray(completed, initCompleted)} completed={completed} />
      <Box textAlign={align()}>
        {targets.map((target) => (
          <Chip 
            variant={targetCompleted[target] ? 'solid' : 'outlined'} 
            key={target} 
            sx={style()}
            label={target} 
            name={target} 
            color='success' 
            onClick={handleClick} 
          />
        ))}
      </Box>
    </>
  )
}

export default TargetChip