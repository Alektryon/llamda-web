const FooterLink = ({ href, children, isLast }:{ href: string, children: React.ReactNode, isLast: boolean }) => (
  <a 
    className={`text-green-500 hover:bg-green-600 hover:text-white ${!isLast ? 'after:content-["|"] after:mx-2 after:text-white' : ''}`} 
    target='_blank' 
    href={href}
  >
    {children}
  </a>
)

const defaultLinks = [
  { href: "mailto:claude@llamda.com", label: "mail" },
  { href: "https://x.com/lumpenspace", label: "x dot com" },
  { href: "https://substack.com/lumpenspace", label: "substack" },
  { href: "https://github.com/lumpenspace", label: "github" },
]

interface FooterProps {
  links?: { href: string; label: string }[];
}

const Footer: React.FC<FooterProps> = ({ links = defaultLinks }) => (
  <div className="w-full z-10 fixed flex flex-row bottom-0 left-0 justify-between font-mono mix-blend-exclusion ">
    llamda, inc | 2024
    <div className='text-right'>
      {links.map((link, index) => (
        <FooterLink 
          key={link.href} 
          href={link.href} 
          isLast={index === links.length - 1}
        > 
          {link.label} 
        </FooterLink>
      ))} 
    </div>
  </div>
)

export { Footer }
