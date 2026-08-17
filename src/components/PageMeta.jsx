import usePageMeta from "../helpers/pageMetaHelper"

// Harus berada di dalam <Router> karena hook-nya membaca route aktif.
function PageMeta() {
  usePageMeta()
  return null
}

export default PageMeta
