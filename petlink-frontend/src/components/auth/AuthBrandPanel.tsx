import { Link } from 'react-router-dom'
import { BrandLogo } from '../BrandLogo'
import { StarRating } from '../ui/StarRating'
import { Avatar } from '../ui/Avatar'
import { colors, radius } from '../../theme/tokens'

export function AuthBrandPanel() {
  return (
    <aside
      style={{
        flex: '1 1 0',
        backgroundColor: colors.brand[900],
        color: colors.white,
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
      }}
    >
      <div>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
          <BrandLogo size={30} colorText={colors.white} />
        </Link>
      </div>

      <div style={{ maxWidth: 380 }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: colors.white, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14 }}>
          Encontre quem cuida do seu pet
        </h1>
        <p style={{ fontSize: 15, color: colors.brand[200], lineHeight: 1.7, margin: 0 }}>
          Veterinários, pet shops e passeadores avaliados por tutores reais.
        </p>

        <div style={{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 20, marginTop: 32, maxWidth: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Avatar name="Clínica Pet Feliz" size={38} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.gray[900], margin: 0 }}>Clínica Pet Feliz</p>
              <p style={{ fontSize: 12, color: colors.gray[400], margin: 0 }}>Veterinária • Salvador, BA</p>
            </div>
          </div>
          <StarRating value={5} size={14} />
          <p style={{ fontSize: 13, color: colors.gray[700], lineHeight: 1.6, margin: '10px 0 8px' }}>
            “Minha gata foi atendida com muito cuidado e paciência.”
          </p>
          <p style={{ fontSize: 12, color: colors.gray[400], margin: 0 }}>Ana Souza • tutora</p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: colors.brand[400], margin: 0 }}>© 2026 PetLink</p>
    </aside>
  )
}
