import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { getPageMeta, SITE_NAME } from "../constants/pageMeta"

const upsertMeta = (attribute, key, content) => {
  const selector = `meta[${attribute}="${key}"]`
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute("content", content)
}

const upsertCanonical = (href) => {
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement("link")
    tag.setAttribute("rel", "canonical")
    document.head.appendChild(tag)
  }
  tag.setAttribute("href", href)
}

/**
 * Menyetel title, description, canonical, dan robots sesuai halaman aktif.
 * Aplikasi ini client-rendered, jadi Google baru membaca tag-tag ini setelah
 * merender JavaScript. Tanpa ini semua route memakai meta yang sama dan
 * snippet di hasil pencarian diambil asal-asalan dari label form.
 */
const usePageMeta = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description, canonical, indexable } = getPageMeta(pathname)

    document.title = title
    upsertMeta("name", "description", description)
    upsertMeta(
      "name",
      "robots",
      indexable
        ? "index, follow, max-image-preview:large, max-snippet:-1"
        : "noindex, follow",
    )
    upsertCanonical(canonical)

    upsertMeta("property", "og:title", title)
    upsertMeta("property", "og:description", description)
    upsertMeta("property", "og:url", canonical)
    upsertMeta("property", "og:site_name", SITE_NAME)
    upsertMeta("name", "twitter:title", title)
    upsertMeta("name", "twitter:description", description)
  }, [pathname])
}

export default usePageMeta
