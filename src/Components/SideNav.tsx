import { Drawer,} from '@mui/material';
export interface INavLink {
  icon: JSX.Element;
  label: string;
  href: string;
}

interface SideNavProps {
  open: boolean;
  onClick: () => void;
  handleTitle: (value: string) => void;
}

const SideNav = ({ open, onClick, handleTitle }: SideNavProps) => {
  const drawerWidth = open ? 275 : 100;
  return (
    <>
      <Drawer
        anchor="left"
        open={true}
        variant='persistent'
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            transition: 'width 0.3s ease',
            backgroundColor: "#1c3766",
            overflowX: 'hidden',
            border: 'none',
            boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
      >

      </Drawer>
    </>
  );
};

export default SideNav;