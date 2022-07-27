import { Box, Button, Chip, Pagination, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import equalArray from '../helpers/equalArray'
import BackHeader from './BackHeader'

const shard = (targets, chunkSize) => {
  const sharded = {}
  let i = 0
  while (targets.length > 0) {
    const chunk = targets.splice(0, chunkSize)
    sharded[i] = chunk
    i++
  }
  return sharded
}

function TargetChip(props) {
  const navigate = useNavigate()
  const userId = window.location.pathname.split('/')[4]
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

  const clickFinish = () => {
    Object.keys(targetCompleted).forEach(function(index) {
      targetCompleted[index] = true
    })
    setCompleted(Object.keys(targetCompleted))
  }

  const clickReset = () => {
    setCompleted(initCompleted)
    navigate('#')
  }

  return (
    <>
      <BackHeader
        title={props.subject.name}
        subject={props.subject}
        isModified={!equalArray(completed, initCompleted)}
        completed={completed}
        canSave={userId ? false : true}
      />
      <Box>
      {!userId && (
        <Stack spacing={1} direction='row' pb={2}>
          <Button sx={{ fontSize: 10 }} variant='contained' onClick={clickFinish}>Pilih Semua</Button>
          <Button sx={{ fontSize: 10 }} variant='outlined' onClick={clickReset}>Reset pilihan</Button>
        </Stack>
      )}
</Box>
      <Box textAlign={align()}>
        {shardTargets[page - 1].map((target) => (
          <Chip
            variant={targetCompleted[target] ? 'solid' : 'outlined'}
            key={target}
            sx={style()}
            label={<Typography sx={{ fontSize: 10 }}> {target} </Typography>}
            name={target}
            color='success'
            onClick={userId ? undefined : handleClick}
          />
        ))}
      </Box>
      <Pagination
        size='medium'
        count={Math.ceil(targets.length / chunkSize)}
        onChange={handleChange}
        sx={{
          justifyContent: 'center',
          display: 'flex',
          marginTop: 2
        }}
      />
    </>
  )
}

export default TargetChip