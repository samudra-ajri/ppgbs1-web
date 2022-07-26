import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"

function PopDialog(props) {
  const { title, children, openPopup } = props

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(openPopup)
  }, [openPopup])

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <Typography variant="body1">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default PopDialog