export const menuLinksCust = [
  { label: 'Home', href: '/' },
  {
      label: 'My Account',
      children: [
          { label: 'Orders', href: '/orders/' },
          { 
              label: 'Account', 
              href: (typeof window !== "undefined" && window.location.pathname.startsWith('/vend/menu')) 
                  ? '/VendAccount' 
                  : '/CustAccount' 
          },
          { label: 'Logout', href: '/logout' },
      ],
  }
];