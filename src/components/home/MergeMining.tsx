import GlassCard from '@components/styled/GlassCard';
import { MERGE_MINING_COINS } from '@constants/config';
import { Badge, Box, CircularProgress, Container, Typography } from '@mui/material';
import { PRIMARY_GOLD } from '@styles/colors';
import { useTranslation } from 'react-i18next';

const MergeMining = () => {
  const { t } = useTranslation();
  const computeOpacity = (active: boolean, progress?: number | null) => {
    if (active) return 1;
    if (progress == null) return 0.5;
    const p = Math.max(0.5, Math.min(1, progress));
    return 0.5 * p + 0.5; // linear from 0.75 at 0.5 to 1 at 1
  };

  const prepareCoin = (c: any) => {
    const active = !!c.active;
    const progress: number | undefined =
      typeof c.mergeProgress === 'number' ? c.mergeProgress : undefined;
    const p = progress != null ? Math.max(0, Math.min(1, progress)) : 0;
    const showProgress = !active && progress != null; // show ring for any defined progress
    const imageOpacity = computeOpacity(active, progress);
    const grayscale = active ? 0 : progress == null || p <= 0 ? 1 : 1 - p; // reveal colors progressively
    const blur = !active && progress == null ? 2 : 0; // blur only inactive coins without progress

    const filterParts: string[] = [];
    if (grayscale > 0) filterParts.push(`grayscale(${grayscale})`);
    if (blur > 0) filterParts.push(`blur(${blur}px)`);
    const filter = filterParts.length ? filterParts.join(' ') : 'none';

    const size = 48;
    const stroke = 4; // ring thickness

    return { active, p, showProgress, imageOpacity, grayscale, filter, size, stroke };
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <GlassCard>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {t('home.merge.title')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3,1fr)',
                sm: 'repeat(4,1fr)',
                md: 'repeat(5,1fr)'
              },
              gap: 2,
              justifyItems: 'center',
              alignItems: 'center'
            }}>
            {MERGE_MINING_COINS.map((c: any) => {
              const ui = prepareCoin(c);
              const coinNode = (
                <Box sx={{ position: 'relative', width: ui.size, height: ui.size, mb: 1 }}>
                  <Box
                    component="img"
                    src={c.icon}
                    alt={c.code}
                    sx={{
                      width: ui.size,
                      height: ui.size,
                      borderRadius: '50%',
                      opacity: ui.imageOpacity,
                      filter: ui.filter
                    }}
                  />
                  {ui.showProgress && (
                    <CircularProgress
                      variant="determinate"
                      value={Math.round(ui.p * 100)}
                      size={ui.size + 10}
                      thickness={ui.stroke}
                      sx={{
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        zIndex: 1,
                        
                      }}
                      // @ts-ignore - MUI v7 track slot
                      enableTrackSlot
                    />
                  )}
                </Box>
              );

              const hasProgress = typeof c.mergeProgress === 'number';
              const percentLabel = `${Math.round(ui.p * 100)}%`;

              return (
                <Box key={c.code} sx={{ textAlign: 'center' }}>
                  {hasProgress ? (
                    <Badge
                      overlap="circular"
                      badgeContent={percentLabel}
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: PRIMARY_GOLD,
                          color: '#1a1a1a',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          minWidth: 'auto',
                          height: '18px',
                          padding: '0 6px',
                          borderRadius: '12px'
                        }
                      }}
                    >
                      {coinNode}
                    </Badge>
                  ) : (
                    coinNode
                  )}
                  <Typography sx={{ fontWeight: 700 }}>{c.code}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </GlassCard>
    </Container>
  );
};

export default MergeMining;
