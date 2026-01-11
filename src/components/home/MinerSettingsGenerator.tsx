import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContainerDI from 'typedi';
import { POOL_URL, RELAY_URL } from '@constants/config';
import {
  alpha,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography
} from '@mui/material';
import {
  planSharenoteFromHashrate,
  ReliabilityId,
  withPlanReliability
} from '@soprinter/sharenotejs';
import CopyIcon from '@components/icons/CopyIcon';
import GlassCard from '@components/styled/GlassCard';
import { IconInput, IconWrapper, StyledIconInputBase } from '@components/styled/IconInput';
import { SimpleInput } from '@components/styled/SimpleInput';
import { RelayService } from '@services/api/RelayService';
import { LINK_COLOR, PRIMARY_BLUE, PRIMARY_WHITE } from '@styles/colors';
import { validateAddress } from '@utils/Utils';

// ... imports

interface Props {
  flcAddress: string;
  onAddressChange: (addr: string) => void;
  onSettingsGenerated?: (address: string, settings: any[] | null) => void;
}

const MinerSettingsGenerator = ({ flcAddress, onAddressChange, onSettingsGenerated }: Props) => {
  const { t } = useTranslation();

  // const [flcAddress, setFlcAddress] = useState(''); // Removed, using prop
  const [workerName, setWorkerName] = useState('');
  const [inputMode, setInputMode] = useState<'sharenote' | 'hashrate'>('sharenote');
  const [targetSharenote, setTargetSharenote] = useState('');

  const [hashrateValue, setHashrateValue] = useState('');
  const [hashrateUnit, setHashrateUnit] = useState<string>('GH/s');

  // State
  const [flcError, setFlcError] = useState<string | null>(null);
  const [sharenoteError, setSharenoteError] = useState<string | null>(null);
  const [hashrateError, setHashrateError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedTooltip, setCopiedTooltip] = useState<string | null>(null);

  // const [nostrSettings, setNostrSettings] = useState<any[] | null>(null); // Payouts found - Moved to Parent

  const units = ['H/s', 'kH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
  const relayService = ContainerDI.get(RelayService);

  const calculateSharenote = useCallback(() => {
    if (!hashrateValue) return '';
    const num = parseFloat(hashrateValue);
    if (isNaN(num)) return '';

    let multiplier = 1;
    switch (hashrateUnit) {
      case 'kH/s':
        multiplier = 1e3;
        break;
      case 'MH/s':
        multiplier = 1e6;
        break;
      case 'GH/s':
        multiplier = 1e9;
        break;
      case 'TH/s':
        multiplier = 1e12;
        break;
      case 'PH/s':
        multiplier = 1e15;
        break;
      case 'EH/s':
        multiplier = 1e18;
        break;
    }
    const hps = num * multiplier;

    try {
      const result = planSharenoteFromHashrate({
        hashrate: hps,
        seconds: 5,
        ...withPlanReliability(ReliabilityId.Mean)
      });
      return result?.sharenote?.toString() || '';
    } catch (e) {
      console.error(e);
      return '';
    }
  }, [hashrateValue, hashrateUnit]);

  useEffect(() => {
    if (inputMode === 'hashrate') {
      const note = calculateSharenote();
      if (note) setTargetSharenote(note);
    }
  }, [hashrateValue, hashrateUnit, inputMode, calculateSharenote]);

  useEffect(() => {
    const v = targetSharenote.trim();
    if (v.length > 0 && inputMode === 'sharenote') {
      // 2 digits, z, 2 digits. (Case insensitive)
      if (!/^\d{2}z\d{2}$/i.test(v)) {
        setSharenoteError(t('home.minerSettings.sharenoteError'));
      } else {
        setSharenoteError(null);
      }
    } else {
      setSharenoteError(null);
    }
  }, [targetSharenote, inputMode, t]);

  const handleFlcChange = (value: string) => {
    onAddressChange(value);
    if (value.length > 0) {
      if (!validateAddress(value)) {
        setFlcError(t('home.payouts.invalidAddress', { coin: 'FLC' }));
      } else {
        setFlcError(null);
      }
    } else {
      setFlcError(null);
    }

    if (generated) {
      relayService.stopSettings();
      setGenerated(false);
      if (onSettingsGenerated) onSettingsGenerated(value, null);
    }
  };

  const handleSharenoteChange = (value: string) => {
    setTargetSharenote(value);
  };

  const handleGetSettings = async () => {
    if (!validateAddress(flcAddress)) {
      setFlcError(t('home.payouts.invalidAddress', { coin: 'FLC' }));
      return;
    }
    setFlcError(null);

    setLoading(true);
    setGenerated(true);

    try {
      await relayService.connectRelay(RELAY_URL);

      let found = false;
      relayService.subscribeSettings(flcAddress, {
        onevent: (event) => {
          if (event && event.tags) {
            const payouts = event.tags
              .filter((tag) => tag[0] !== 'a' && tag[0] !== 'd' && tag.length >= 3)
              .map((tag) => ({ coin: tag[0].toUpperCase(), address: tag[1], signature: tag[2] }));

            if (onSettingsGenerated) {
              if (payouts.length > 0) {
                found = true;
                onSettingsGenerated(flcAddress, payouts);
              }
            }
          }
        },
        oneose: () => {
          setLoading(false);
          if (!found && onSettingsGenerated) {
            onSettingsGenerated(flcAddress, null);
          }
        }
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const finalWorker = workerName ? `${flcAddress}.${workerName}` : flcAddress;
  const finalPassword = targetSharenote || 'x';

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTooltip(id);
      setTimeout(() => setCopiedTooltip(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <GlassCard sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          {t('home.minerSettings.title')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('home.minerSettings.subtitle')}
        </Typography>

        <Box sx={{ mb: 3, maxWidth: 500 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontWeight: 600, mr: 1 }}>
              {t('home.minerSettings.flcAddressLabel')}
            </Typography>
            <Tooltip
              title={t('home.minerSettings.flcAddressHelp').replace('[[link:tWallet]]', 'tWallet')}>
              <Box
                component="span"
                sx={{
                  color: PRIMARY_BLUE,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12
                }}>
                ?
              </Box>
            </Tooltip>
          </Box>
          <IconInput>
            <IconWrapper>
              <Image
                src="/img/flc.png"
                alt="FLC"
                width={24}
                height={24}
                style={{ borderRadius: '50%' }}
              />
            </IconWrapper>
            <StyledIconInputBase
              placeholder={t('home.minerSettings.flcAddressPlaceholder')}
              value={flcAddress}
              onChange={(e) => handleFlcChange(e.target.value)}
            />
          </IconInput>
          {flcError ? (
            <Typography variant="caption" color="error">
              {flcError}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: t('home.minerSettings.flcAddressHelp')
                    .replace(
                      '[[link:tWallet]]',
                      `<a href="#" style="color:${LINK_COLOR}">tWallet</a>`
                    )
                    .replace(/\[\[bold:(.*?)\]\]/g, '<b>$1</b>')
                }}
              />
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderColor: alpha(PRIMARY_WHITE, 0.1), my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography
                sx={{
                  fontWeight: inputMode === 'sharenote' ? 700 : 400,
                  cursor: 'pointer',
                  borderBottom: inputMode === 'sharenote' ? `2px solid ${PRIMARY_BLUE}` : 'none'
                }}
                onClick={() => setInputMode('sharenote')}>
                {t('home.minerSettings.targetSharenoteLabel')}
              </Typography>
              <Box
                onClick={() => setInputMode('hashrate')}
                sx={{
                  cursor: 'pointer',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  backgroundColor:
                    inputMode === 'hashrate' ? PRIMARY_BLUE : 'rgba(255,255,255,0.1)',
                  color: inputMode === 'hashrate' ? '#000' : PRIMARY_WHITE,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor:
                      inputMode === 'hashrate' ? PRIMARY_BLUE : 'rgba(255,255,255,0.2)'
                  }
                }}>
                {t('home.minerSettings.hashrateLabel')} ?
              </Box>
            </Box>
            {inputMode === 'sharenote' ? (
              <Box>
                <SimpleInput
                  placeholder={t('home.minerSettings.sharenotePlaceholder')}
                  value={targetSharenote}
                  onChange={(e) => handleSharenoteChange(e.target.value)}
                  sx={{ width: '100%' }}
                />
                {sharenoteError && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#ff5252', mt: 0.5, display: 'block' }}>
                    {sharenoteError}
                  </Typography>
                )}
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <SimpleInput
                    type="number"
                    inputProps={{ step: 'any' }}
                    placeholder={t('home.minerSettings.hashratePlaceholder')}
                    value={hashrateValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setHashrateValue(val);
                      if (val && (isNaN(parseFloat(val)) || parseFloat(val) < 0)) {
                        setHashrateError(t('home.minerSettings.hashrateError'));
                      } else {
                        setHashrateError(null);
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Select
                    value={hashrateUnit}
                    onChange={(e) => setHashrateUnit(e.target.value)}
                    sx={{
                      color: PRIMARY_WHITE,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      border: 'none',
                      minWidth: 100,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.25)'
                      },
                      '& .MuiSelect-select': {
                        padding: '10px 15px'
                      },
                      '& fieldset': {
                        border: 'none'
                      }
                    }}>
                    {units.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                {hashrateError && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#ff5252', mt: 0.5, display: 'block' }}>
                    {hashrateError}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Right: Worker Name */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 600, mr: 1 }}>
                {t('home.minerSettings.workerNameLabel')}
              </Typography>
              <Tooltip title={t('home.minerSettings.workerNameTooltip')}>
                <Box
                  component="span"
                  sx={{
                    color: PRIMARY_BLUE,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12
                  }}>
                  ?
                </Box>
              </Tooltip>
            </Box>
            <SimpleInput
              placeholder={t('home.minerSettings.workerNamePlaceholder')}
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
            />
          </Box>
        </Box>

        {inputMode === 'sharenote' && (
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 3 }}>
            <span
              dangerouslySetInnerHTML={{
                __html: t('home.minerSettings.sharenoteHelp')
                  .replace(
                    '[[link:sharenotePrintPlanner]]',
                    `<a href="#" style="color:#57bcee">${t(
                      'home.minerSettings.sharenotePrintPlanner'
                    )}</a>`
                  )
                  .replace(/\[\[bold:(.*?)\]\]/g, '<b>$1</b>')
              }}
            />
            <br />
            <span
              dangerouslySetInnerHTML={{
                __html: t('home.minerSettings.sharenoteHelp2').replace(
                  /\[\[bold:(.*?)\]\]/g,
                  '<b>$1</b>'
                )
              }}
            />
          </Typography>
        )}
        {inputMode === 'hashrate' && targetSharenote && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: alpha(PRIMARY_BLUE, 0.1),
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${alpha(PRIMARY_BLUE, 0.2)}`
            }}>
            <Typography variant="body2" sx={{ color: PRIMARY_BLUE, fontWeight: 500 }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: t('home.minerSettings.hashrateHelpWrapper')
                    .replace('{{sharenote}}', targetSharenote || '...')
                    .replace('{{hashrate}}', `${hashrateValue || '...'} ${hashrateUnit}`)
                    .replace(/\[\[bold:(.*?)\]\]/g, '<b>$1</b>')
                }}
              />
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleGetSettings}
            disabled={
              loading ||
              !!flcError ||
              !flcAddress ||
              !workerName ||
              (inputMode === 'sharenote'
                ? !targetSharenote || !!sharenoteError
                : !hashrateValue || !!hashrateError)
            }
            sx={{
              bgcolor: PRIMARY_BLUE,
              fontWeight: 700,
              borderRadius: 1,
              textTransform: 'uppercase',
              '&:hover': { bgcolor: alpha(PRIMARY_BLUE, 0.8) }
            }}>
            {loading ? t('home.minerSettings.generating') : t('home.minerSettings.getSettings')}
          </Button>
        </Box>

        <Collapse in={generated && !loading}>
          <Divider sx={{ borderColor: alpha(PRIMARY_WHITE, 0.1), my: 3 }} />
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: 1,
                display: 'block',
                mb: 1
              }}>
              {t('home.minerSettings.stratumUrlLabel')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography component="code" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                {POOL_URL}
              </Typography>
              <Tooltip
                open={copiedTooltip === 'url'}
                title={t('home.poolServer.copied')}
                placement="top">
                <IconButton size="small" onClick={() => copyToClipboard(POOL_URL, 'url')}>
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: 1,
                display: 'block',
                mb: 1
              }}>
              {t('home.minerSettings.usernameLabel')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography component="code" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                {finalWorker}
              </Typography>
              <Tooltip
                open={copiedTooltip === 'user'}
                title={t('home.poolServer.copied')}
                placement="top">
                <IconButton size="small" onClick={() => copyToClipboard(finalWorker, 'user')}>
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: 1,
                display: 'block',
                mb: 1
              }}>
              {t('home.minerSettings.passwordLabel')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
              <Typography component="code" sx={{ fontWeight: 600 }}>
                {finalPassword}
              </Typography>
              <Tooltip
                open={copiedTooltip === 'pwd'}
                title={t('home.poolServer.copied')}
                placement="top">
                <IconButton size="small" onClick={() => copyToClipboard(finalPassword, 'pwd')}>
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Collapse>
      </GlassCard>
    </Container>
  );
};

export default MinerSettingsGenerator;
