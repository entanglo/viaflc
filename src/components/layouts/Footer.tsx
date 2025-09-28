import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Link as MLink, Typography } from '@mui/material';
import Link from 'next/link';
import LanguageSwitcher from '@components/common/LanguageSwitcher';
import { TEXT_SUBTLE, TEXT_WEAK } from '@styles/colors';
import { justifyContent } from '@mui/system';

type FooterLink = { label: string; link: string };
type FooterColumn = { title: string; links: FooterLink[] };

const Footer = () => {
  const { t } = useTranslation();
  const columns = t('footer.columns', { returnObjects: true }) as unknown as FooterColumn[];

  const isInternal = (href: string) => href.startsWith('/');

  return (
    <Box
      component="footer"
      sx={{ borderTop: '1px solid #232323', mt: 6, py: 2, bgcolor: 'transparent' }}>
      <Container maxWidth="md" sx={{ justifyContent: 'center' }}>
        {/* <Grid container spacing={4}>
          {columns.map((col, idx) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
                {col.title}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', textAlign: 'left' }}>
                {col.links.map((lnk, i) => (
                  <Box component="li" key={i} sx={{ my: 0.5 }}>
                    {isInternal(lnk.link) ? (
                      <MLink
                        component={Link}
                        href={lnk.link}
                        underline="hover"
                        sx={{ color: TEXT_SUBTLE, fontSize: 14 }}>
                        {lnk.label}
                      </MLink>
                    ) : (
                      <MLink
                        href={lnk.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: TEXT_SUBTLE, fontSize: 14 }}>
                        {lnk.label}
                      </MLink>
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid> */}
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', color: TEXT_WEAK }}>
          {t('footer.title')}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
