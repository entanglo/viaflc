import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const FlcIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon sx={{ height: '25', width: '25' }} {...props} viewBox="0 0 645 645">
      <circle cx="322.83" cy="322.541" r="321.859" fill="#D0970F" />
      <rect
        x="250.973"
        y="155.304"
        width="73"
        height="350"
        rx="3"
        transform="rotate(10 250.973 155.304)"
        fill="white"
      />
      <rect
        x="310.061"
        y="165.723"
        width="177"
        height="63"
        rx="3"
        transform="rotate(10 310.061 165.723)"
        fill="white"
      />
      <rect
        x="278.91"
        y="322.682"
        width="153"
        height="63"
        rx="3"
        transform="rotate(10 278.91 322.682)"
        fill="white"
      />
      <rect
        x="212.569"
        y="242.682"
        width="139"
        height="38"
        rx="3"
        transform="rotate(10 212.569 242.682)"
        fill="white"
      />
    </SvgIcon>
  );
};

export default FlcIcon;
