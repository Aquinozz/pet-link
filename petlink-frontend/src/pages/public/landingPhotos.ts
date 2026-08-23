const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export interface LandingPhoto {
  src: string
  alt: string
}

/* ---------------------------------- HERO ---------------------------------- */

export const heroPhotos: LandingPhoto[] = [
  { src: unsplash('1601758228041-f3b2795255f1'), alt: 'Tutora com seu corgi no sofá' },
  { src: unsplash('1544568100-847a948585b9'), alt: 'Pessoa segurando um filhote de cachorro' },
  { src: unsplash('1477884213360-7e9d7dcc1e48'), alt: 'Homem passeando com seu cachorro' },
  { src: unsplash('1530281700549-e82e7bf110d6'), alt: 'Tutor em trilha com seu cachorro' },
]

/* ------------------------------ COMO FUNCIONA ----------------------------- */

export const stepPhotos: LandingPhoto[] = [
  { src: unsplash('1450778869180-41d0601e046e'), alt: 'Tutora com seu cachorro e gato em casa' },
  { src: unsplash('1628009368231-7bb7cfcb0def'), alt: 'Veterinária atendendo um cachorro' },
  { src: unsplash('1591160690555-5debfba289f0'), alt: 'Golden retriever brincando com seu tutor' },
]

/* ------------------------------- DEPOIMENTOS ------------------------------ */

export const testimonialPhotos = {
  ana: unsplash('1596492784531-6e6eb5ea9993', 200),
  carlos: unsplash('1583337130417-3346a1be7dee', 200),
  juliana: unsplash('1495360010541-f48722b34f7d', 200),
}

/* ----------------------------------- CTA ---------------------------------- */

export const ctaPhoto: LandingPhoto = {
  src: unsplash('1601758124510-52d02ddb7cbd', 900),
  alt: 'Criança abraçando seu cachorro labrador',
}
