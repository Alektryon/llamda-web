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

const Footer = ({ links = defaultLinks }: { links: { href: string, label: string }[] }) => (
  <div className="w-full min-h-screen flex flex-col items-center justify-center font-mono">
    <div className="text-center mb-4">
      llamda, inc | 2024
    </div>
    <div className="overflow-y-auto max-h-[50vh]">
      <table className="border-collapse">
        <tbody>
          {links.map((link, index) => (
            <tr key={link.href}>
              <td className="py-2">
                <FooterLink 
                  href={link.href} 
                  isLast={index === links.length - 1}
                > 
                  {link.label} 
                </FooterLink>
              </td>
            </tr>
          ))} 
        </tbody>
      </table>
    </div>
  </div>
)

export { Footer }
