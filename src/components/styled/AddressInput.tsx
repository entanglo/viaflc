import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { BORDER_SUBTLE, SURFACE_MUTED } from '@styles/colors';
import React from 'react';

// Styled building blocks kept as named exports for compatibility
export const AddressInput = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  backgroundColor: SURFACE_MUTED,
  border: `1px solid ${BORDER_SUBTLE}`,
  borderRadius: 8,
  boxShadow: 'none',
  padding: '10px 12px',
  height: 48,
  position: 'relative'
}));

export const AddressIconWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

export const StyledAddressInputBase = styled(InputBase)(({ theme }) => ({
  color: '#fff',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: 0,
    lineHeight: 1.2,
    fontSize: 16
  }
}));

// Minimal controlled input matching the image
type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  'aria-label'?: string;
  start?: React.ReactNode;
};

const AddressInputField: React.FC<Props> = ({ value, onChange, placeholder, start, ...rest }) => {
  return (
    <AddressInput>
      {start && <AddressIconWrapper>{start}</AddressIconWrapper>}
      <StyledAddressInputBase
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          ml: start ? '32px' : 0
        }}
        inputProps={{ 'aria-label': rest['aria-label'] || 'address-input' }}
      />
    </AddressInput>
  );
};

export default AddressInputField;
