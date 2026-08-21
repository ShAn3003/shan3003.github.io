import Link from "next/link";

const links = [
  ["/", "首页"],
  ["/skills/", "Skills"],
  ["/archive/", "文章"],
  ["/about/", "关于"],
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Shan Xie 首页">
          <span>SX</span>
          <strong>Shan Xie</strong>
        </Link>
        <nav aria-label="主导航">
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
