function Kibana() {
  const kibanaUrl = process.env.REACT_APP_KIBANA_URL

  return (
    <div style={{ width: "100%", height: "200vh" }}>
      <iframe
        src={kibanaUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        title='Kibana Dashboard'
      />
    </div>
  )
}

export default Kibana
