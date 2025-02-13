import PropTypes from 'prop-types';

export default function Navbar({ brandName, links }) {
  return (
    <div style={{ margin: "20px 50px 20px 50px" }}>
    <div className="navbar bg-base-100 rounded-lg shadow-lg p-4">
    <div className="flex-1">
        <a className="btn btn-ghost text-xl">{brandName}</a>
    </div>
    <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
        {links.map((link, index) =>
            link.children ? (
            // if has children, render as dropdown
            <li key={index}>
                <details>
                <summary>{link.label}</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                    {link.children.map((child, childIndex) => (
                    <li key={childIndex}>
                        <a href={child.href || "#"}>{child.label}</a>
                    </li>
                    ))}
                </ul>
                </details>
            </li>
            ) : (
            // if no children, render as normal link
            <li key={index}>
                <a href={link.href || "#"}>{link.label}</a>
            </li>
            )
        )}
        </ul>
    </div>
    </div>
    </div>
  );
}

Navbar.propTypes = {
  brandName: PropTypes.string.isRequired, // brand name
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // label
      href: PropTypes.string, // link
      children: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string,
        })
      ),
    })
  ).isRequired,
};
