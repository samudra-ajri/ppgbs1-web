import { Box, Chip } from '@mui/material'

function TargetChip(props) {
  const targets = props.subject.targets
  return (
    <Box mb={5} textAlign='center'>
    {targets.map((target) => (
      <Chip key={target} sx={{m: 0.5, width: '15%'}}
      label={target} color="success" />
    ))}
  </Box>
  )
}
      
export default TargetChip