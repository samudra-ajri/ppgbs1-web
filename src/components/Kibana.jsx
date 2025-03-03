import { useState } from "react"
import { Chip, Grid } from "@mui/material"

function Kibana() {
  const [menu, setMenu] = useState("Kehadiran")

  const kibanaUrls = {
    "Kehadiran": process.env.REACT_APP_KIBANA_URL_PRESENCES,
    "Log Aktivitas": process.env.REACT_APP_KIBANA_URL_ACTIVITIES,
    "Asrama Alquran Online": process.env.REACT_APP_KIBANA_URL_ASRAMA,
  }

  const handleMenuClick = (selectedMenu) => {
    setMenu(selectedMenu)
  }

  return (
    <>
      <Grid container spacing={1} pb={2} pl={3}>
        <Grid item>
          <Chip
            label='Kehadiran'
            color='info'
            variant={menu === "Kehadiran" ? "solid" : "outlined"}
            onClick={() => handleMenuClick("Kehadiran")}
          />
        </Grid>
        <Grid item>
          <Chip
            label='Asrama Alquran Online'
            color='info'
            variant={menu === "Asrama Alquran Online" ? "solid" : "outlined"}
            onClick={() => handleMenuClick("Asrama Alquran Online")}
          />
        </Grid>
        <Grid item>
          <Chip
            label='Log Aktivitas'
            color='info'
            variant={menu === "Log Aktivitas" ? "solid" : "outlined"}
            onClick={() => handleMenuClick("Log Aktivitas")}
          />
        </Grid>
      </Grid>

      <div style={{ width: "100%", height: "200vh" }}>
        <iframe
          src={kibanaUrls[menu]}
          style={{ width: "100%", height: "100%", border: "none" }}
          title='Kibana Dashboard'
        />
      </div>
    </>
  )
}

export default Kibana
