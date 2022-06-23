import { Box, Chip, Pagination } from '@mui/material'
import { useState } from 'react'
import equalArray from '../helpers/equalArray'
import BackHeader from './BackHeader'

const shard = (targets, chunkSize) => {
  const sharded = {}
  let i = 0
  while (targets.length > 0) {
    const chunk = targets.splice(0, chunkSize)
    sharded[i] = chunk
    i ++
  }
  return sharded
}

function TargetChip(props) {
  const targets = props.subject.targets
  const targetsForShard = [...targets]
  const chunkSize = 50
  const shardTargets = shard(targetsForShard, chunkSize)
  const initCompleted = props.completion ? props.completion.completed : []
  const [completed, setCompleted] = useState(initCompleted)
  const targetCompleted = props.targetCompleted
  const [page, setPage] = useState(1)

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
      targetCompleted[target] = true
      setCompleted(prevState => [...prevState, target])
    } else {
      targetCompleted[target] = false
      setCompleted(completed.filter(completed => completed !== target))
    }
  }

  const handleChange = (event, value) => {
    setPage(value)
  }

  return (
    <>
      <BackHeader 
        title={props.subject.name} 
        subject={props.subject} 
        isModified={!equalArray(completed, initCompleted)} 
        completed={completed} 
      />
      <Box textAlign={align()}>
        {shardTargets[page-1].map((target) => (
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
      <Pagination 
        size='medium' 
        count={Math.ceil(targets.length/chunkSize)}
        onChange={handleChange}
        sx={{ 
          justifyContent:'center', 
          display:'flex', 
          marginTop:10
        }}
      />
    </>
  )
}

export default TargetChip